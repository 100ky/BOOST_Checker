#!/bin/bash

# Skript pro automatickou aktualizaci IP adresy
echo "🔍 Zjišťuji aktuální IP adresu..."
IP=$(hostname -I | awk '{print $1}')
echo "📍 Nalezena IP: $IP"

echo "📝 Aktualizuji ApiService.js..."
sed -i "s|const BASE_URL = 'http://[0-9.]*:3000'|const BASE_URL = 'http://$IP:3000'|g" mobile-app/src/services/ApiService.js

echo "✅ IP adresa aktualizována na: $IP"
echo "📱 Nyní spusťte: eas update --branch development --message 'Auto IP update'"
