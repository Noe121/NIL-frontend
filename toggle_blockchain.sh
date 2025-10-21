#!/bin/bash
# Toggle script to easily switch between core features and blockchain-enabled modes

if [ "$1" = "blockchain" ] || [ "$1" = "on" ]; then
    echo "⛓️  Enabling blockchain features..."
    # Update .env.local to enable blockchain
    sed -i.bak 's/VITE_ENABLE_BLOCKCHAIN=.*/VITE_ENABLE_BLOCKCHAIN=true/' .env.local
    sed -i.bak 's/VITE_BLOCKCHAIN_ENABLED=.*/VITE_BLOCKCHAIN_ENABLED=true/' .env.local
    echo "✅ Blockchain features enabled. Run 'npm run dev' to start."
elif [ "$1" = "core" ] || [ "$1" = "off" ]; then
    echo "🚫 Disabling blockchain features..."
    # Update .env.local to disable blockchain
    sed -i.bak 's/VITE_ENABLE_BLOCKCHAIN=.*/VITE_ENABLE_BLOCKCHAIN=false/' .env.local
    sed -i.bak 's/VITE_BLOCKCHAIN_ENABLED=.*/VITE_BLOCKCHAIN_ENABLED=false/' .env.local
    echo "✅ Core features only. Run 'npm run dev' to start."
else
    echo "🔄 Frontend Feature Toggle Script"
    echo ""
    echo "Usage:"
    echo "  $0 core|off     - Disable blockchain features (default)"
    echo "  $0 blockchain|on - Enable blockchain features"
    echo ""
    echo "Current mode:"
    if [ -f ".env.local" ]; then
        if grep -q "VITE_BLOCKCHAIN_ENABLED=true" .env.local; then
            echo "⛓️  Blockchain features: ENABLED"
        else
            echo "🚫 Blockchain features: DISABLED"
        fi
    else
        echo "❓ No .env.local found - using default configuration"
    fi
fi