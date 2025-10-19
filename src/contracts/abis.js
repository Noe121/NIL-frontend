/**
 * Smart Contract ABIs for NILbx Platform
 * Generated from PlayerLegacyNFT.sol and SponsorshipContract.sol
 */

// PlayerLegacyNFT Contract ABI
export const PlayerLegacyNFTABI = [
  // Constructor
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "athlete", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "tokenURI", "type": "string"},
      {"indexed": false, "internalType": "uint96", "name": "royaltyFee", "type": "uint96"}
    ],
    "name": "LegacyNFTMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "approved", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "Approval",
    "type": "event"
  },
  
  // Read Functions
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "tokensOfOwner",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "tokenToAthlete",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "athleteTokenCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Write Functions
  {
    "inputs": [
      {"internalType": "address", "name": "athlete", "type": "address"},
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "string", "name": "_tokenURI", "type": "string"},
      {"internalType": "uint96", "name": "royaltyFee", "type": "uint96"}
    ],
    "name": "mintLegacyNFT",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address[]", "name": "athletes", "type": "address[]"},
      {"internalType": "address[]", "name": "recipients", "type": "address[]"},
      {"internalType": "string[]", "name": "_tokenURIs", "type": "string[]"},
      {"internalType": "uint96[]", "name": "royaltyFees", "type": "uint96[]"}
    ],
    "name": "batchMintLegacyNFT",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "from", "type": "address"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// SponsorshipContract ABI
export const SponsorshipContractABI = [
  // Constructor
  {
    "inputs": [{"internalType": "address", "name": "_platformFeeRecipient", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "taskId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "sponsor", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "athlete", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "description", "type": "string"}
    ],
    "name": "TaskCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "taskId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "athlete", "type": "address"},
      {"indexed": false, "internalType": "bytes32", "name": "deliverableHash", "type": "bytes32"}
    ],
    "name": "TaskSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "taskId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "athlete", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "sponsor", "type": "address"}
    ],
    "name": "TaskCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "taskId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "athlete", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "athleteAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "platformFee", "type": "uint256"}
    ],
    "name": "PaymentReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "taskId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "sponsor", "type": "address"}
    ],
    "name": "TaskCancelled",
    "type": "event"
  },
  
  // Structs and Enums (represented as tuples in ABI)
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "tasks",
    "outputs": [
      {"internalType": "uint256", "name": "taskId", "type": "uint256"},
      {"internalType": "address", "name": "sponsor", "type": "address"},
      {"internalType": "address", "name": "athlete", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint8", "name": "status", "type": "uint8"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "uint256", "name": "completedAt", "type": "uint256"},
      {"internalType": "bytes32", "name": "deliverableHash", "type": "bytes32"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Read Functions
  {
    "inputs": [{"internalType": "uint256", "name": "taskId", "type": "uint256"}],
    "name": "getTask",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "taskId", "type": "uint256"},
          {"internalType": "address", "name": "sponsor", "type": "address"},
          {"internalType": "address", "name": "athlete", "type": "address"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint8", "name": "status", "type": "uint8"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "uint256", "name": "completedAt", "type": "uint256"},
          {"internalType": "bytes32", "name": "deliverableHash", "type": "bytes32"}
        ],
        "internalType": "struct SponsorshipContract.Task",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "athlete", "type": "address"}],
    "name": "getAthleteTasks",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "sponsor", "type": "address"}],
    "name": "getSponsorTasks",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "athleteEarnings",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "sponsorSpending",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTasks",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformFeePercentage",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Write Functions
  {
    "inputs": [
      {"internalType": "address", "name": "athlete", "type": "address"},
      {"internalType": "string", "name": "description", "type": "string"}
    ],
    "name": "createTask",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "taskId", "type": "uint256"}],
    "name": "acceptTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "taskId", "type": "uint256"},
      {"internalType": "bytes32", "name": "deliverableHash", "type": "bytes32"}
    ],
    "name": "submitDeliverable",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "taskId", "type": "uint256"}],
    "name": "approveTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "taskId", "type": "uint256"}],
    "name": "cancelTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Task Status Enum
export const TaskStatus = {
  Created: 0,
  Assigned: 1,
  Submitted: 2,
  Completed: 3,
  Paid: 4,
  Cancelled: 5
};

// Task Status Labels
export const TaskStatusLabels = {
  [TaskStatus.Created]: 'Created',
  [TaskStatus.Assigned]: 'Assigned', 
  [TaskStatus.Submitted]: 'Submitted',
  [TaskStatus.Completed]: 'Completed',
  [TaskStatus.Paid]: 'Paid',
  [TaskStatus.Cancelled]: 'Cancelled'
};

// Contract addresses (can be updated based on deployment)
export const CONTRACT_ADDRESSES = {
  PlayerLegacyNFT: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  SponsorshipContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
};

// Network configurations
export const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorer: 'https://etherscan.io'
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet', 
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorer: 'https://sepolia.etherscan.io'
  },
  hardhat: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://localhost:8545',
    blockExplorer: null
  }
};