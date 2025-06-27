# ✅ Checklist pro spuštění doma

## Před prvním spuštěním:

- [ ] Naklonovat projekt z GitHubu
- [ ] Spustit `./install-project.sh` 
- [ ] Nainstalovat Expo Go na telefon

## Každý den při spuštění:

### 1. Příprava serveru:
- [ ] Zjistit IP adresu PC: `hostname -I` (Linux/Mac) nebo `ipconfig` (Windows)
- [ ] Aktualizovat IP v `mobile-app/src/services/ApiService.js`
  ```javascript
  const BASE_URL = 'http://VAŠE_IP:3000';
  ```
- [ ] Spustit server: `./start.sh` nebo `cd server && npm start`
- [ ] Ověřit server: otevřít `http://localhost:3000` v prohlížeči

### 2. Spuštění mobilní aplikace:
- [ ] V novém terminálu: `cd mobile-app`
- [ ] Spustit Expo: `npx expo start`
- [ ] Naskenovat QR kód v Expo Go aplikaci na telefonu
- [ ] Ověřit připojení: zkontrolovat, že se aplikace načetla

### 3. Test funkčnosti:
- [ ] Vyfotografovat průvodku v aplikaci
- [ ] Zkontrolovat, že se zobrazí extrahovaná data (číslo výkresu, množství)
- [ ] Ověřit webové rozhraní na `http://localhost:3000`
- [ ] Zkontrolovat seznam dokumentů v mobilní aplikaci

## Pokud něco nefunguje:

### Server se nespouští:
- [ ] Zkontrolovat, že port 3000 není obsazený: `lsof -i:3000`
- [ ] Ukončit procesy na portu: `lsof -ti:3000 | xargs kill -9`
- [ ] Restartovat server

### Mobilní app se nemůže připojit:
- [ ] Ověřit, že PC i telefon jsou ve stejné WiFi
- [ ] Zkontrolovat firewall na PC
- [ ] Zkusit tunnel: `npx expo start --tunnel`
- [ ] Ověřit správnou IP adresu v ApiService.js

### OCR nefunguje:
- [ ] Počkat na první download Tesseract modelů (může trvat)
- [ ] Sledovat logy v terminálu serveru
- [ ] Zkontrolovat kvalitu fotky (dobré světlo, ostrý obraz)

## Aktuální funkcionalita:

✅ **Hotovo:**
- Mobilní aplikace s kamerou a OCR
- Server s REST API a WebSocket
- Webové rozhraní pro správu dokumentů
- Specializovaný parser pro průvodky
- Extrakce čísla výkresu a množství výrobku
- Zobrazení parsovaných dat v UI
- GitHub repozitář s kompletním kódem

📋 **Testovací scénář:**
1. Vyfotografovat průvodku
2. Ověřit extrakci: číslo výkresu, množství výrobku
3. Zkontrolovat typ dokumentu: "Průvodka" vs "Dokument"
4. Zobrazení v webovém rozhraní
5. Seznam dokumentů v mobilní aplikaci

---

**💡 Tip:** Všechno je uloženo na GitHubu, takže můžete kdykoliv stáhnout nejnovější verzi pomocí `git pull`.

## 🚨 Poslední chyba v Codespaces (vyřešená doma):

**Network Error:** 502 Bad Gateway při připojení k serveru
```
GET https://bookish-zebra-r4vwvx44rprcppgw-3000.app.github.dev/socket.io/ 502 (Bad Gateway)
```

**Příčina:** GitHub Codespaces tunel nefunguje správně pro WebSocket připojení.

**Řešení doma:** Použití lokální IP adresy místo Codespaces URL - proto jsou důležité skripty `update-ip.sh` a `update-ip.bat`!
