# 📄 Document Scanner - OCR Aplikace

> Mobilní aplikace pro skenování dokumentů s OCR rozpoznáváním textu a čísel

![Document Scanner](https://img.shields.io/badge/Platform-React%20Native%20%7C%20Node.js-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Funkce

- 📸 **Mobilní skenování** - Používání kamery telefonu pro focení dokumentů
- 🔤 **OCR rozpoznávání** - Automatické rozpoznání textu a čísel pomocí Tesseract.js
- 📊 **Inteligentní analýza** - Zvýrazňování čísel, emailů, telefonních čísel
- 📈 **Statistiky** - Počet znaků, slov, rozpoznaných prvků
- 💾 **Cloudové ukládání** - Synchronizace mezi mobilní aplikací a webem
- 🌐 **Webové rozhraní** - Správa dokumentů přes prohlížeč
- 🔄 **Real-time sync** - WebSocket komunikace pro okamžité aktualizace

## 🏗️ Architektura

```
📁 document-scanner/
├── 📱 mobile-app/          # React Native + Expo aplikace
├── 🖥️  server/             # Node.js + Express API server
└── 📚 docs/               # Dokumentace
```

### 🛠️ Technologie

**Frontend (Mobile):**
- React Native + Expo
- React Navigation
- React Native Paper (Material Design)
- Expo Camera API
- Axios pro HTTP komunikaci

**Backend (Server):**
- Node.js + Express
- Tesseract.js (OCR engine)
- Socket.io (WebSocket)
- Multer (file upload)
- fs-extra (file system)

**DevOps:**
- EAS (Expo Application Services)
- GitHub Actions ready
- Docker ready

## 📦 Instalace

### Požadavky
- Node.js 18+
- npm nebo yarn
- Expo CLI
- Expo Go aplikace na telefonu

### 🚀 Rychlé spuštění

```bash
# Klonování repositáře
git clone https://github.com/100ky/BOOST_Checker.git
cd BOOST_Checker/document-scanner

# Automatická instalace všech závislostí
chmod +x install-project.sh
./install-project.sh

# Spuštění celé aplikace
chmod +x start.sh
./start.sh
```

### 🔧 Manuální spuštění

```bash
# 1. Spuštění serveru
cd server
npm install
npm start

# 2. Spuštění mobilní aplikace
cd ../mobile-app
npm install
npx expo start --tunnel
```

## 📱 Použití

1. **Mobilní aplikace:**
   - Naskenujte QR kód z Expo serveru
   - Povolte přístup ke kameře
   - Focíte dokument na kartě "Skenovat"
   - Prohlížejte výsledky na kartě "Dokumenty"

2. **Webové rozhraní:**
   - Otevřete http://localhost:3000
   - Spravujte všechny naskenované dokumenty
   - Exportujte nebo sdílejte výsledky

## ⚙️ Konfigurace

### IP adresa serveru
Před použitím aktualizujte IP adresu v `mobile-app/src/services/ApiService.js`:

```javascript
const BASE_URL = 'http://VASE_IP_ADRESA:3000';
```

### OCR nastavení
Server podporuje tyto jazyky pro OCR:
- Čeština (ces)
- Angličtina (eng)

## 📊 API Dokumentace

### Endpoints

- `GET /api/health` - Health check
- `GET /api/documents` - Seznam všech dokumentů
- `POST /api/documents` - Upload nového dokumentu
- `GET /api/documents/:id` - Detail dokumentu
- `DELETE /api/documents/:id` - Smazání dokumentu

### WebSocket Events

- `document_processed` - Dokument byl zpracován OCR
- `document_deleted` - Dokument byl smazán
- `document_updated` - Dokument byl aktualizován

## 🧪 Testování

```bash
# Testování API serveru
curl http://localhost:3000/api/health

# Testování uploadů
curl -X POST -F "image=@test.jpg" http://localhost:3000/api/documents
```

## 📈 Výkon

- **OCR rychlost:** ~2-5 sekund na A4 dokument
- **Podporované formáty:** JPG, PNG, WebP
- **Max velikost:** 10MB na obrázek
- **Rozlišení:** Optimalizováno pro 1080p+

## 🤝 Přispívání

1. Forkněte repository
2. Vytvořte feature branch (`git checkout -b feature/nova-funkce`)
3. Commitněte změny (`git commit -am 'Přidání nové funkce'`)
4. Pushněte branch (`git push origin feature/nova-funkce`)
5. Vytvořte Pull Request

## 📄 License

MIT License - viz [LICENSE](LICENSE) soubor.

## 👥 Autoři

- **100ky** - *Iniciální vývoj* - [GitHub](https://github.com/100ky)

## 🆘 Podpora

Máte problém? Vytvořte [issue](https://github.com/100ky/BOOST_Checker/issues) nebo se podívejte do [dokumentace](./document-scanner/USAGE.md).

## 🎯 Roadmap

- [ ] 🔍 Vylepšení OCR accuracy
- [ ] 📱 iOS/Android native builds
- [ ] 🌍 Více jazyků pro OCR
- [ ] ☁️ Cloud storage integrace
- [ ] 🔐 Uživatelské účty a autentizace
- [ ] 📊 Pokročilá analytika dokumentů

---

⭐ **Pokud se vám projekt líbí, dejte mu hvězdu!** ⭐