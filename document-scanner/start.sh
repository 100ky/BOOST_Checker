#!/bin/bash

echo "🚀 Spouštím Document Scanner"
echo "============================"

# Kontrola, že jsou závislosti nainstalovány
if [ ! -d "server/node_modules" ]; then
    echo "❌ Server závislosti nejsou nainstalovány!"
    echo "Spusťte: ./install-project.sh"
    exit 1
fi

if [ ! -d "mobile-app/node_modules" ]; then
    echo "❌ Mobilní app závislosti nejsou nainstalovány!"
    echo "Spusťte: ./install-project.sh"
    exit 1
fi

# Získání IP adresy
IP_ADDR=$(hostname -I | awk '{print $1}')
echo "🌐 IP adresa vašeho PC: $IP_ADDR"

# Kontrola nastavení API v mobilní aplikaci
API_FILE="mobile-app/src/services/ApiService.js"
if grep -q "192.168.1.100" "$API_FILE"; then
    echo "⚠️  UPOZORNĚNÍ: Možná potřebujete aktualizovat IP adresu v $API_FILE"
    echo "   Aktuální nastavení: $(grep "const BASE_URL" $API_FILE)"
    echo "   Doporučená IP adresa: http://$IP_ADDR:3000"
fi

echo ""
echo "🖥️  Spouštím server..."
cd server
npm start &
SERVER_PID=$!
cd ..

echo "📱 Server běží na: http://$IP_ADDR:3000"
echo "📱 Pro spuštění mobilní aplikace otevřte nový terminál a spusťte:"
echo "   cd mobile-app && npx expo start"
echo ""
echo "🛑 Pro zastavení serveru stiskněte Ctrl+C"

# Čekání na ukončení
wait $SERVER_PID
