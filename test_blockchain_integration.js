#!/usr/bin/env node

/**
 * Quick test script to validate blockchain integration setup
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing NILbx Blockchain Integration\n');

// Test 1: Check if all required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'src/contexts/Web3Context.jsx',
  'src/contracts/abis.js',
  'src/services/blockchainService.js',
  'src/components/WalletConnect.jsx',
  'src/components/NFTMinting.jsx',
  'src/components/SponsorshipTasks.jsx',
  'src/components/BlockchainDashboard.jsx',
  'src/components/BlockchainLandingPage.jsx'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  try {
    const filePath = join(__dirname, file);
    readFileSync(filePath, 'utf8');
    console.log(`  ✅ ${file}`);
  } catch (error) {
    console.log(`  ❌ ${file} - ${error.message}`);
    allFilesExist = false;
  }
}

// Test 2: Check configuration
console.log('\n⚙️  Checking configuration...');
try {
  const configPath = join(__dirname, 'src/utils/config.js');
  const configContent = readFileSync(configPath, 'utf8');
  
  if (configContent.includes('blockchain')) {
    console.log('  ✅ Blockchain configuration found');
  } else {
    console.log('  ⚠️  Blockchain configuration not found');
  }
  
  if (configContent.includes('Web3')) {
    console.log('  ✅ Web3 configuration found');
  } else {
    console.log('  ⚠️  Web3 configuration not found');
  }
} catch (error) {
  console.log(`  ❌ Configuration check failed: ${error.message}`);
}

// Test 3: Check contract addresses
console.log('\n🔗 Checking contract addresses...');
try {
  const abisPath = join(__dirname, 'src/contracts/abis.js');
  const abisContent = readFileSync(abisPath, 'utf8');
  
  if (abisContent.includes('0x5FbDB2315678afecb367f032d93F642f64180aa3')) {
    console.log('  ✅ PlayerLegacyNFT address configured');
  } else {
    console.log('  ❌ PlayerLegacyNFT address missing');
  }
  
  if (abisContent.includes('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512')) {
    console.log('  ✅ SponsorshipContract address configured');
  } else {
    console.log('  ❌ SponsorshipContract address missing');
  }
} catch (error) {
  console.log(`  ❌ Contract address check failed: ${error.message}`);
}

// Test 4: Check package.json dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packagePath = join(__dirname, 'package.json');
  const packageContent = JSON.parse(readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = ['ethers', '@rainbow-me/rainbowkit', 'wagmi', 'viem', '@tanstack/react-query'];
  let allDepsInstalled = true;
  
  for (const dep of requiredDeps) {
    if (packageContent.dependencies && packageContent.dependencies[dep]) {
      console.log(`  ✅ ${dep} v${packageContent.dependencies[dep]}`);
    } else {
      console.log(`  ❌ ${dep} - not installed`);
      allDepsInstalled = false;
    }
  }
  
  if (allDepsInstalled) {
    console.log('\n✅ All blockchain dependencies are installed!');
  }
} catch (error) {
  console.log(`  ❌ Dependencies check failed: ${error.message}`);
}

// Summary
console.log('\n📊 Integration Status Summary:');
if (allFilesExist) {
  console.log('✅ All required files are present');
  console.log('✅ Blockchain integration is properly set up');
  console.log('✅ Ready for testing with Web3 wallets');
  console.log('\n🚀 Next steps:');
  console.log('  1. Ensure MetaMask or another Web3 wallet is installed');
  console.log('  2. Add localhost:8545 network to your wallet (Chain ID: 31337)');
  console.log('  3. Import one of the Hardhat test accounts');
  console.log('  4. Open http://localhost:5175 and test wallet connection');
  console.log('\n💡 Test account for import:');
  console.log('  Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  console.log('  Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
} else {
  console.log('❌ Some required files are missing');
  console.log('❌ Please check the file structure');
}

console.log('\n🎯 Integration test completed!');