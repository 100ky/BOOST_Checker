#!/bin/bash

echo "🚀 Instalace Document Scanner aplikace"
echo "======================================"

# Kontrola Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js není nainstalován. Nainstalujte Node.js 18 nebo novější."
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//')
if [ "$(printf '%s\n' "18" "$NODE_VERSION" | sort -V | head -n1)" != "18" ]; then
    echo "❌ Potřebujete Node.js verzi 18 nebo novější. Aktuální verze: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js verze: $NODE_VERSION"

# Kontrola npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm není nainstalován."
    exit 1
fi

echo "✅ npm je dostupný"

# Instalace Expo CLI globálně
echo "📱 Instalace Expo CLI..."
npm install -g @expo/cli

# Instalace závislostí serveru
echo "🔧 Instalace závislostí serveru..."
cd server
npm install
cd ..

# Instalace závislostí mobilní aplikace
echo "📱 Instalace závislostí mobilní aplikace..."
cd mobile-app
npm install
cd ..

echo ""
echo "🎉 Instalace dokončena!"
echo ""
echo "📋 Další kroky:"
echo "1. Spusťte server: cd server && npm start"
echo "2. V novém terminálu spusťte mobilní app: cd mobile-app && npx expo start"
echo "3. Naskenujte QR kód aplikací Expo Go na vašem telefonu"
echo "4. Otevřete webové rozhraní: http://localhost:3000"
echo ""
echo "⚠️  Nezapomeňte změnit IP adresu v mobile-app/src/services/ApiService.js"
echo "   na skutečnou IP adresu vašeho PC (ne localhost)!"
echo ""
echo "🔍 Pro zjištění IP adresy použijte: ip addr show nebo ifconfig"
