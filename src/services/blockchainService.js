/**
 * Blockchain Service - Smart contract interaction utilities
 * Handles NFT minting, sponsorship tasks, and Ethereum transactions
 */

import { ethers } from 'ethers';
import { config } from '../utils/config.js';
import { TaskStatus, TaskStatusLabels } from '../contracts/abis.js';

export class BlockchainService {
  constructor(web3Context) {
    this.web3 = web3Context;
  }

  // Helper method to ensure wallet is connected
  _ensureConnected() {
    if (!this.web3.isConnected) {
      throw new Error('Wallet not connected');
    }
    if (!this.web3.networkSupported) {
      throw new Error('Unsupported network');
    }
  }

  // Helper method to format Ethereum amounts
  _formatEther(amount) {
    return ethers.formatEther(amount);
  }

  // Helper method to parse Ethereum amounts
  _parseEther(amount) {
    return ethers.parseEther(amount.toString());
  }

  // Helper method to create transaction options
  _getTxOptions(overrides = {}) {
    return {
      gasLimit: 300000, // Default gas limit
      ...overrides
    };
  }

  /**
   * PlayerLegacyNFT Contract Methods
   */

  // Mint a new legacy NFT for an athlete
  async mintLegacyNFT(athleteAddress, recipientAddress, tokenURI, royaltyFee = 500) {
    this._ensureConnected();
    
    try {
      const contract = this.web3.contracts.playerLegacyNFT;
      
      // Validate inputs
      if (!ethers.isAddress(athleteAddress)) {
        throw new Error('Invalid athlete address');
      }
      if (!ethers.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }
      if (!tokenURI || tokenURI.trim().length === 0) {
        throw new Error('Token URI is required');
      }
      if (royaltyFee < 0 || royaltyFee > 1000) {
        throw new Error('Royalty fee must be between 0 and 1000 (0-10%)');
      }

      console.log('🎨 Minting Legacy NFT:', {
        athlete: athleteAddress,
        recipient: recipientAddress,
        tokenURI,
        royaltyFee
      });

      const tx = await contract.mintLegacyNFT(
        athleteAddress,
        recipientAddress, 
        tokenURI,
        royaltyFee,
        this._getTxOptions()
      );

      console.log('📝 Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ NFT minted successfully:', receipt.hash);

      // Extract token ID from events
      const mintEvent = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log)?.name === 'LegacyNFTMinted';
        } catch {
          return false;
        }
      });

      if (mintEvent) {
        const parsedEvent = contract.interface.parseLog(mintEvent);
        const tokenId = parsedEvent.args.tokenId.toString();
        
        return {
          success: true,
          tokenId,
          transactionHash: receipt.hash,
          gasUsed: receipt.gasUsed.toString()
        };
      }

      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Failed to mint NFT:', error);
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  }

  // Get NFTs owned by an address
  async getNFTsOfOwner(ownerAddress) {
    try {
      const contract = this.web3.contracts.playerLegacyNFT;
      
      if (!ethers.isAddress(ownerAddress)) {
        throw new Error('Invalid owner address');
      }

      const tokenIds = await contract.tokensOfOwner(ownerAddress);
      
      const nfts = await Promise.all(
        tokenIds.map(async (tokenId) => {
          try {
            const [tokenURI, athlete] = await Promise.all([
              contract.tokenURI(tokenId),
              contract.tokenToAthlete(tokenId)
            ]);

            return {
              tokenId: tokenId.toString(),
              tokenURI,
              athlete,
              owner: ownerAddress
            };
          } catch (error) {
            console.warn(`Failed to fetch NFT ${tokenId}:`, error);
            return null;
          }
        })
      );

      return nfts.filter(nft => nft !== null);
    } catch (error) {
      console.error('❌ Failed to get NFTs:', error);
      throw new Error(`Failed to get NFTs: ${error.message}`);
    }
  }

  // Get total NFT supply
  async getTotalNFTSupply() {
    try {
      const contract = this.web3.contracts.playerLegacyNFT;
      const total = await contract.totalSupply();
      return total.toString();
    } catch (error) {
      console.error('❌ Failed to get total supply:', error);
      return '0';
    }
  }

  // Get athlete's NFT count
  async getAthleteNFTCount(athleteAddress) {
    try {
      const contract = this.web3.contracts.playerLegacyNFT;
      
      if (!ethers.isAddress(athleteAddress)) {
        throw new Error('Invalid athlete address');
      }

      const count = await contract.athleteTokenCount(athleteAddress);
      return count.toString();
    } catch (error) {
      console.error('❌ Failed to get athlete NFT count:', error);
      return '0';
    }
  }

  /**
   * SponsorshipContract Methods
   */

  // Create a new sponsorship task
  async createSponsorshipTask(athleteAddress, description, amountInEth) {
    this._ensureConnected();
    
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      
      // Validate inputs
      if (!ethers.isAddress(athleteAddress)) {
        throw new Error('Invalid athlete address');
      }
      if (!description || description.trim().length === 0) {
        throw new Error('Task description is required');
      }
      if (!amountInEth || amountInEth <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const amountWei = this._parseEther(amountInEth);

      console.log('📋 Creating sponsorship task:', {
        athlete: athleteAddress,
        description,
        amount: `${amountInEth} ETH`
      });

      const tx = await contract.createTask(
        athleteAddress,
        description,
        { 
          value: amountWei,
          ...this._getTxOptions()
        }
      );

      console.log('📝 Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Task created successfully:', receipt.hash);

      // Extract task ID from events
      const taskEvent = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log)?.name === 'TaskCreated';
        } catch {
          return false;
        }
      });

      if (taskEvent) {
        const parsedEvent = contract.interface.parseLog(taskEvent);
        const taskId = parsedEvent.args.taskId.toString();
        
        return {
          success: true,
          taskId,
          transactionHash: receipt.hash,
          gasUsed: receipt.gasUsed.toString()
        };
      }

      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Failed to create task:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  // Accept a sponsorship task (athlete)
  async acceptTask(taskId) {
    this._ensureConnected();
    
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      
      console.log('✋ Accepting task:', taskId);

      const tx = await contract.acceptTask(taskId, this._getTxOptions());
      
      const receipt = await tx.wait();
      console.log('✅ Task accepted:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Failed to accept task:', error);
      throw new Error(`Failed to accept task: ${error.message}`);
    }
  }

  // Submit deliverable for a task (athlete)
  async submitDeliverable(taskId, deliverableHash) {
    this._ensureConnected();
    
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      
      if (!deliverableHash || deliverableHash.length !== 66) {
        throw new Error('Invalid deliverable hash');
      }

      console.log('📤 Submitting deliverable:', { taskId, deliverableHash });

      const tx = await contract.submitDeliverable(
        taskId,
        deliverableHash,
        this._getTxOptions()
      );
      
      const receipt = await tx.wait();
      console.log('✅ Deliverable submitted:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Failed to submit deliverable:', error);
      throw new Error(`Failed to submit deliverable: ${error.message}`);
    }
  }

  // Approve task and release payment (sponsor)
  async approveTask(taskId) {
    this._ensureConnected();
    
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      
      console.log('✅ Approving task:', taskId);

      const tx = await contract.approveTask(taskId, this._getTxOptions());
      
      const receipt = await tx.wait();
      console.log('✅ Task approved and payment released:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Failed to approve task:', error);
      throw new Error(`Failed to approve task: ${error.message}`);
    }
  }

  // Cancel a task (sponsor)
  async cancelTask(taskId) {
    this._ensureConnected();
    
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      
      console.log('❌ Cancelling task:', taskId);

      const tx = await contract.cancelTask(taskId, this._getTxOptions());
      
      const receipt = await tx.wait();
      console.log('✅ Task cancelled:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Failed to cancel task:', error);
      throw new Error(`Failed to cancel task: ${error.message}`);
    }
  }

  // Get task details
  async getTask(taskId) {
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      const task = await contract.getTask(taskId);
      
      return {
        taskId: task.taskId.toString(),
        sponsor: task.sponsor,
        athlete: task.athlete,
        amount: this._formatEther(task.amount),
        description: task.description,
        status: task.status,
        statusLabel: TaskStatusLabels[task.status],
        createdAt: new Date(Number(task.createdAt) * 1000),
        completedAt: task.completedAt > 0 ? new Date(Number(task.completedAt) * 1000) : null,
        deliverableHash: task.deliverableHash
      };
    } catch (error) {
      console.error('❌ Failed to get task:', error);
      throw new Error(`Failed to get task: ${error.message}`);
    }
  }

  // Get tasks for an athlete
  async getAthleteTasks(athleteAddress) {
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      
      if (!ethers.isAddress(athleteAddress)) {
        throw new Error('Invalid athlete address');
      }

      const taskIds = await contract.getAthleteTasks(athleteAddress);
      
      const tasks = await Promise.all(
        taskIds.map(async (taskId) => {
          try {
            return await this.getTask(taskId.toString());
          } catch (error) {
            console.warn(`Failed to fetch task ${taskId}:`, error);
            return null;
          }
        })
      );

      return tasks.filter(task => task !== null);
    } catch (error) {
      console.error('❌ Failed to get athlete tasks:', error);
      throw new Error(`Failed to get athlete tasks: ${error.message}`);
    }
  }

  // Get tasks for a sponsor
  async getSponsorTasks(sponsorAddress) {
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      
      if (!ethers.isAddress(sponsorAddress)) {
        throw new Error('Invalid sponsor address');
      }

      const taskIds = await contract.getSponsorTasks(sponsorAddress);
      
      const tasks = await Promise.all(
        taskIds.map(async (taskId) => {
          try {
            return await this.getTask(taskId.toString());
          } catch (error) {
            console.warn(`Failed to fetch task ${taskId}:`, error);
            return null;
          }
        })
      );

      return tasks.filter(task => task !== null);
    } catch (error) {
      console.error('❌ Failed to get sponsor tasks:', error);
      throw new Error(`Failed to get sponsor tasks: ${error.message}`);
    }
  }

  // Get athlete earnings
  async getAthleteEarnings(athleteAddress) {
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      
      if (!ethers.isAddress(athleteAddress)) {
        throw new Error('Invalid athlete address');
      }

      const earnings = await contract.athleteEarnings(athleteAddress);
      return this._formatEther(earnings);
    } catch (error) {
      console.error('❌ Failed to get athlete earnings:', error);
      return '0';
    }
  }

  // Get sponsor spending
  async getSponsorSpending(sponsorAddress) {
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      
      if (!ethers.isAddress(sponsorAddress)) {
        throw new Error('Invalid sponsor address');
      }

      const spending = await contract.sponsorSpending(sponsorAddress);
      return this._formatEther(spending);
    } catch (error) {
      console.error('❌ Failed to get sponsor spending:', error);
      return '0';
    }
  }

  // Get total number of tasks
  async getTotalTasks() {
    try {
      const contract = this.web3.contracts.sponsorshipContract;
      const total = await contract.totalTasks();
      return total.toString();
    } catch (error) {
      console.error('❌ Failed to get total tasks:', error);
      return '0';
    }
  }

  /**
   * Utility Methods
   */

  // Create hash for deliverable
  createDeliverableHash(content) {
    return ethers.keccak256(ethers.toUtf8Bytes(content));
  }

  // Format transaction hash for display
  formatTxHash(hash, length = 10) {
    if (!hash) return '';
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
  }

  // Format address for display
  formatAddress(address, length = 6) {
    if (!address) return '';
    return `${address.slice(0, length)}...${address.slice(-4)}`;
  }

  // Get transaction URL on block explorer
  getTxUrl(hash) {
    const network = this.web3.network;
    const baseUrl = network?.name === 'sepolia' 
      ? 'https://sepolia.etherscan.io'
      : 'https://etherscan.io';
    return `${baseUrl}/tx/${hash}`;
  }

  // Get address URL on block explorer
  getAddressUrl(address) {
    const network = this.web3.network;
    const baseUrl = network?.name === 'sepolia'
      ? 'https://sepolia.etherscan.io'
      : 'https://etherscan.io';
    return `${baseUrl}/address/${address}`;
  }
}

// Export singleton instance factory
export function createBlockchainService(web3Context) {
  return new BlockchainService(web3Context);
}