/**
 * Service Endpoint Health Check Script
 * Run with: node scripts/check-endpoints.js [standalone|centralized]
 */

const fetch = require('node-fetch');

const MODE = process.argv[2] || 'standalone';
const IS_CENTRALIZED = MODE === 'centralized';

const config = {
  standalone: {
    api: 'http://localhost:8002',
    auth: 'http://localhost:9000',
    company: 'http://localhost:8002'
  },
  centralized: {
    api: 'http://localhost:8001',
    auth: 'http://localhost:9000',
    company: 'http://localhost:8002',
    blockchain: 'http://localhost:8545'
  }
};

const endpoints = IS_CENTRALIZED ? config.centralized : config.standalone;

async function checkHealth(name, url) {
  try {
    console.log(`\nChecking ${name} health at ${url}/health...`);
    const response = await fetch(`${url}/health`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${name} is healthy:`, data);
      return true;
    } else {
      console.log(`❌ ${name} health check failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} is not accessible:`, error.message);
    return false;
  }
}

async function main() {
  console.log(`\n🔍 Checking endpoints in ${MODE} mode...\n`);
  
  const results = await Promise.all([
    checkHealth('API Service', endpoints.api),
    checkHealth('Auth Service', endpoints.auth),
    checkHealth('Company API', endpoints.company),
    ...(IS_CENTRALIZED ? [checkHealth('Blockchain Service', endpoints.blockchain)] : [])
  ]);
  
  const allHealthy = results.every(r => r);
  
  console.log('\n🎯 Summary:');
  console.log(`Mode: ${MODE}`);
  console.log(`Status: ${allHealthy ? '✅ All services healthy' : '❌ Some services unhealthy'}`);
  
  if (!allHealthy) {
    process.exit(1);
  }
}

main().catch(console.error);