#!/bin/bash

echo "🚀 Instalace Document Scanner aplikace"
echo "======================================"

# Kontrola Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js není nainstalován!"
    echo "Nainstalujte Node.js z https://nodejs.org/"
    exit 1
fi

# Kontrola npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm není nainstalován!"
    exit 1
fi

echo "✅ Node.js verze: $(node --version)"
echo "✅ npm verze: $(npm --version)"

# Instalace Expo CLI globálně
echo ""
echo "📱 Instalace Expo CLI..."
npm install -g @expo/cli

# Instalace závislostí pro server
echo ""
echo "🖥️  Instalace závislostí serveru..."
cd server
npm install
cd ..

# Instalace závislostí pro mobilní aplikaci
echo ""
echo "📱 Instalace závislostí mobilní aplikace..."
cd mobile-app
npm install
cd ..

echo ""
echo "✅ Instalace dokončena!"
echo ""
echo "🎯 Další kroky:"
echo "1. Spusťte server: cd server && npm start"
echo "2. V novém terminálu spusťte mobilní app: cd mobile-app && npx expo start"
echo "3. Naskenujte QR kód v Expo Go aplikaci na telefonu"
echo "4. Webové rozhraní najdete na: http://localhost:3000"
echo ""
echo "📝 Poznámky:"
echo "- Ujistěte se, že je telefon ve stejné WiFi síti jako PC"
echo "- V souboru mobile-app/src/services/ApiService.js změňte IP adresu na adresu vašeho PC"
echo "- Pro získání IP adresy použijte: ip addr show nebo hostname -I"
