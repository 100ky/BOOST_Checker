# Document Scanner App

Mobilní aplikace pro skenování dokumentů s OCR technologií (rozpoznávání textu a čísel) a přenos na PC.

## ✨ Funkce

- 📱 **Skenování dokumentů** kamerou telefonu
- 🔍 **OCR rozpoznávání textu a čísel** pomocí Tesseract.js
- 🌐 **Real-time přenos** dokumentů na PC přes WiFi
- 📄 **Webové rozhraní** pro zobrazování a správu dokumentů
- 📊 **Statistiky** a přehled naskenovaných dokumentů
- 🗂️ **Správa dokumentů** - mazání, prohlížení detailů

## 🚀 Rychlá instalace

### 1. Spusťte instalační skript
```bash
chmod +x install-project.sh
./install-project.sh
```

### 2. Nastavte IP adresu
Zjistěte IP adresu vašeho PC:
```bash
hostname -I
```

Upravte soubor `mobile-app/src/services/ApiService.js`:
```javascript
const BASE_URL = 'http://VAŠE_IP_ADRESA:3000';
```

### 3. Spusťte aplikaci
```bash
# Spuštění serveru
./start.sh

# V novém terminálu - spuštění mobilní aplikace
cd mobile-app
npx expo start
```

### 4. Připojte telefon
1. Nainstalujte **Expo Go** aplikaci
2. Naskenujte QR kód v terminálu
3. Začněte skenovat dokumenty!

## 📱 Použití

### Skenování textu a čísel:
1. Otevřete záložku **"Skenovat"**
2. Namiřte kameru na dokument s textem/čísly
3. Dbejte na dobré osvětlení a ostrý obraz
4. Stiskněte tlačítko kamery
5. OCR automaticky rozpozná text
6. Dokument se odešle na PC

### Tipy pro nejlepší výsledky:
- **Dobré osvětlení** ☀️
- **Stabilní držení** 📐
- **Čistý, kontrastní text** ⚫⚪
- **Kolmý úhel fotografování** 📏

### Webové rozhraní:
Přejděte na `http://localhost:3000` pro:
- Zobrazení všech dokumentů
- Real-time aktualizace
- Statistiky skenování
- Správu dokumentů

## 📂 Struktura projektu

```
document-scanner/
├── mobile-app/          # React Native + Expo aplikace
│   ├── src/
│   │   ├── components/  # Komponenty (Camera, DocumentList)
│   │   └── services/    # API komunikace, OCR služby
│   ├── App.js          # Hlavní aplikace
│   └── package.json    # Závislosti
├── server/              # Express.js server
│   ├── public/         # Webové rozhraní
│   ├── uploads/        # Uložené obrázky
│   ├── index.js        # Server s OCR
│   └── package.json    # Server závislosti
├── README.md           # Tento soubor
├── USAGE.md           # Detailní návod
├── install-project.sh  # Instalační skript
└── start.sh           # Spouštěcí skript
```

## 🔧 Požadavky

- **Node.js** 18+ ([stáhnout zde](https://nodejs.org/))
- **npm** (součást Node.js)
- **Mobilní zařízení** s aplikací Expo Go
- **WiFi síť** (telefon a PC ve stejné síti)

## 🛠️ Řešení problémů

### Aplikace se nemůže připojit k serveru:
1. ✅ Zkontrolujte, že server běží
2. ✅ Ověřte správnou IP adresu v `ApiService.js`
3. ✅ Ujistěte se, že jsou zařízení ve stejné WiFi
4. ✅ Zkontrolujte firewall nastavení

### OCR špatně rozpoznává text:
1. 💡 Zlepšete osvětlení
2. 📱 Držte telefon stabilně  
3. 🔍 Fotografujte z blíž
4. 📐 Držte kolmý úhel

### Detailní návod:
Přečtěte si [USAGE.md](USAGE.md) pro kompletní instrukce.

## 🚀 Produkční nasazení

Pro produkční použití doporučujeme:

1. **Databáze** místo in-memory úložiště
2. **HTTPS** pro bezpečnou komunikaci  
3. **Cloud OCR API** (Google Vision, Azure)
4. **Autentifikace** uživatelů
5. **Docker** kontejnerizace

## 📈 Možná rozšíření

- 🗄️ **Databázové úložiště** (MongoDB, PostgreSQL)
- ☁️ **Cloud OCR služby** pro lepší přesnost
- 📤 **Export funkcí** (PDF, Word, Excel)
- 🔍 **Fulltextové vyhledávání**
- 👥 **Uživatelské účty**
- 🏷️ **Kategorizace dokumentů**
- 📧 **Email notifikace**

## 📄 Licence

MIT License - volně použitelné pro komerční i nekomerční účely.

## 🆘 Podpora

Máte problém? 
1. Zkontrolujte [USAGE.md](USAGE.md)
2. Ověřte logy v terminálu
3. Restartujte server i aplikaci

---

**Vytvořeno pro skenování dokumentů s rozpoznáváním textu a čísel pomocí moderních technologií.** 🚀📱
