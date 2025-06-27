# Návod k použití - Document Scanner

## 🚀 Rychlý start

### 1. Instalace
```bash
chmod +x install-project.sh
./install-project.sh
```

### 2. Zjištění IP adresy vašeho PC
```bash
# Linux/Mac
hostname -I
# nebo
ip addr show | grep 'inet ' | grep -v '127.0.0.1'
```

### 3. Nastavení IP adresy v mobilní aplikaci
Otevřete soubor `mobile-app/src/services/ApiService.js` a změňte:
```javascript
const BASE_URL = 'http://VAŠE_IP_ADRESA:3000';
```

### 4. Spuštění aplikace

#### Terminal 1 - Server
```bash
cd server
npm start
```

#### Terminal 2 - Mobilní aplikace  
```bash
cd mobile-app
npx expo start
```

### 5. Připojení telefonu
1. Nainstalujte aplikaci **Expo Go** z App Store/Google Play
2. Naskenujte QR kód zobrazený v terminálu
3. Aplikace se spustí na vašem telefonu

## 📱 Používání aplikace

### Skenování dokumentů
1. Otevřete záložku **"Skenovat"**
2. Namiřte kameru na dokument s textem nebo čísly
3. Ujistěte se, že je text dobře čitelný a osvětlený
4. Stiskněte tlačítko fotoaparátu
5. Počkejte na zpracování OCR
6. Dokument se automaticky odešle na server

### Tipy pro nejlepší výsledky OCR:
- **Dobré osvětlení** - používejte přirozené světlo nebo dobré umělé osvětlení
- **Stabilní držení** - držte telefon stabilně, aby nebyl obrázek rozmazaný
- **Správná vzdálenost** - držte telefon dostatečně blízko, aby byl text čitelný
- **Rovný úhel** - fotografujte dokument z kolmého úhlu
- **Kontrastní pozadí** - černý text na bílém pozadí funguje nejlépe

### Zobrazení dokumentů
1. Záložka **"Dokumenty"** zobrazuje všechny naskenované dokumenty
2. Můžete prohlížet rozpoznaný text
3. Dokumenty lze mazat přes tlačítko "Smazat"

## 🌐 Webové rozhraní

Otevřete webový prohlížeč a přejděte na:
```
http://localhost:3000
```

### Funkce webového rozhraní:
- **Real-time zobrazení** nových dokumentů
- **Statistiky** - počet dokumentů, dnešní aktivity
- **Detail dokumentů** - zobrazení originálního obrázku a rozpoznaného textu
- **Správa dokumentů** - mazání, export

## 🔧 Řešení problémů

### Mobilní aplikace se nemůže připojit k serveru
1. Zkontrolujte, že server běží (`cd server && npm start`)
2. Ověřte IP adresu v `ApiService.js`
3. Ujistěte se, že jsou telefon i PC ve stejné WiFi síti
4. Zkontrolujte firewall nastavení

### OCR nerozpoznává text správně
1. Zlepšete osvětlení
2. Držte telefon stabilně
3. Ujistěte se, že text je ostrý a čitelný
4. Zkuste fotografovat z menší vzdálenosti

### Server se nespustí
1. Zkontrolujte, že je nainstalován Node.js (`node --version`)
2. Spusťte `npm install` ve složce server
3. Zkontrolujte, že port 3000 není používán jiným procesem

## 📂 Struktura projektu

```
document-scanner/
├── mobile-app/          # React Native aplikace
├── server/              # Express.js server s OCR
├── README.md           # Hlavní dokumentace  
├── install-project.sh  # Instalační skript
└── USAGE.md           # Tento návod
```

## 🔮 Rozšíření funkcí

### Možná vylepšení:
- **Databáze** - nahrazení in-memory úložiště databází (MongoDB, PostgreSQL)
- **Cloud OCR** - integrace s Google Vision API nebo Azure Computer Vision
- **Export funkcí** - export do PDF, Word, Excel
- **Vyhledávání** - fulltextové vyhledávání v dokumentech
- **Uživatelské účty** - autentifikace a osobní složky
- **Kategorizace** - automatické třídění dokumentů podle typu

### Přidání cloud OCR (Google Vision API):
1. Vytvořte Google Cloud projekt
2. Povolte Vision API
3. Vytvořte service account a stáhněte klíče
4. Nainstalujte: `npm install @google-cloud/vision`
5. Aktualizujte server kód pro použití Google Vision API

### Přidání databáze (MongoDB):
1. Nainstalujte MongoDB
2. Přidejte závislost: `npm install mongoose`
3. Vytvořte modely pro dokumenty
4. Nahraďte in-memory pole databázovými operacemi

## 🆘 Podpora

Pokud narazíte na problémy:
1. Zkontrolujte logy v terminálu
2. Ověřte síťové připojení
3. Restartujte server i mobilní aplikaci
4. Zkontrolujte verze Node.js a npm
