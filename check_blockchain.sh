#!/bin/bash
echo "🔗 Checking Blockchain Integration..."

# Check if Web3 is available
if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' http://localhost:8545 &> /dev/null; then
    echo "✅ Blockchain node is responding"
else
    echo "❌ Blockchain node not available"
fi

# Check contracts directory
if [ -d "../blockchain/contracts" ]; then
    echo "✅ Smart contracts directory found"
    contract_count=$(find ../blockchain/contracts -name "*.sol" | wc -l)
    echo "📄 Found $contract_count Solidity contracts"
else
    echo "❌ Smart contracts not found"
fi

# Check if contracts are compiled
if [ -d "../blockchain/build" ] || [ -d "../blockchain/artifacts" ]; then
    echo "✅ Compiled contracts found"
else
    echo "⚠️  Contracts may need compilation"
fi
