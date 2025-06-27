# Document Scanner App

Mobilní aplikace pro skenování dokumentů s OCR technologií (rozpoznávání textu a čísel) a přenos na PC.

## ✨ Funkce

- 📱 **Skenování dokumentů** kamerou telefonu
- 🔍 **OCR rozpoznávání textu a čísel** pomocí Tesseract.js
- 🌐 **Real-time přenos** dokumentů na PC přes WiFi
- 📄 **Webové rozhraní** pro zobrazování a správu dokumentů
- 📊 **Statistiky** a přehled naskenovaných dokumentů
- 🗂️ **Správa dokumentů** - mazání, prohlížení detailů

## 🏠 Spuštění doma ve VS Code

### Příprava (jednorázově):

1. **Klonování z GitHubu:**
```bash
git clone <URL_VAŠEHO_REPOZITÁŘE>
cd document-scanner
```

2. **Instalace závislostí:**
```bash
# Spusťte instalační skript
chmod +x install-project.sh
./install-project.sh
```

### Každodenní spuštění:

1. **Zjištění IP adresy vašeho PC:**
```bash
# Windows (Command Prompt)
ipconfig

# macOS/Linux
hostname -I
# nebo
ifconfig | grep inet
```

2. **Aktualizace IP adresy v mobilní aplikaci:**
```bash
# Automatické nastavení IP (Linux/macOS)
./update-ip.sh

# Nebo ručně upravte soubor:
# mobile-app/src/services/ApiService.js
# Změňte řádek: const BASE_URL = 'http://VAŠE_IP_ADRESA:3000';
```

3. **Spuštění serveru:**
```bash
# V hlavní složce document-scanner
./start.sh
# nebo ručně:
cd server && npm start
```

4. **Spuštění mobilní aplikace:**
```bash
# V novém terminálu
cd mobile-app
npx expo start

# Pro tunel (pokud máte problémy s lokální sítí):
npx expo start --tunnel
```

5. **Připojení telefonu:**
   - Nainstalujte **Expo Go** na telefon
   - Naskenujte QR kód z terminálu
   - Aplikace se automaticky načte

### 🧪 Testování s průvodkou:

Po spuštění můžete testovat:

1. **Vyfotografujte průvodku** v mobilní aplikaci
2. **Zkontrolujte extrakci dat:**
   - Číslo výkresu
   - Množství výrobku/položky  
   - Typ dokumentu (Průvodka vs Dokument)
3. **Webové rozhraní:** `http://localhost:3000`
4. **Seznam dokumentů** v mobilní aplikaci

### 🔧 Časté problémy doma:

**Server se nemůže spustit:**
- Zkontrolujte, že port 3000 není používán jinou aplikací
- Spusťte: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

**Mobilní app se nemůže připojit:**
- Ujistěte se, že PC i telefon jsou ve stejné WiFi síti
- Zkontrolujte firewall (Windows může blokovat port 3000)
- Zkuste `npx expo start --tunnel` pro obejití síťových problémů

**OCR nefunguje správně:**
- Server potřebuje chvíli na first-time download Tesseract modelů
- Sledujte logy v terminálu při prvním OCR

### 📊 Parsování průvodek:

Aplikace nyní umí rozpoznat z průvodek:
- **Číslo výkresu** (formát: číslo, /číslo, nebo R číslo)
- **Množství výrobku** (čísla následovaná "ks" nebo "CELKOVÉ MNOŽSTVÍ")
- **Položky** (řádky s čísly a textem)
- **Typ dokumentu** (automaticky detekuje průvodky)

### 🔗 GitHub repozitář:

Vše je uloženo na GitHubu, takže můžete:
- Stáhnout nejnovější verzi: `git pull`
- Vytvořit vlastní větev: `git checkout -b moje-upravy`
- Zálohovat změny: `git add . && git commit -m "Moje změny"`

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
