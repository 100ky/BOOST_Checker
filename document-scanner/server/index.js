const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const socketIo = require('socket.io');
const Tesseract = require('tesseract.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Statické soubory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Zajistíme, že složka uploads existuje
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Funkce pro optimalizované OCR zpracování
async function processOCR(imagePath) {
  try {
    console.log('Spouštím OCR pro:', imagePath);
    
    const { data: { text, confidence } } = await Tesseract.recognize(
      imagePath,
      'ces+eng', // čeština + angličtina
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR progress: ${Math.round(m.progress * 100)}%`);
          }
        },
        // Optimalizace pro lepší rozpoznávání textu a čísel
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ÁáČčĎďÉéÍíĹĺŇňÓóŔŕŠšŤťÚúÝýŽž.,;:!?()[]{}/"\'- ',
        tessedit_pageseg_mode: '6', // Uniform block of text
        preserve_interword_spaces: '1'
      }
    );
    
    console.log(`OCR dokončeno s důvěryhodností: ${confidence}%`);
    return {
      text: text.trim(),
      confidence: confidence
    };
  } catch (error) {
    console.error('Chyba při OCR zpracování:', error);
    return {
      text: '',
      confidence: 0
    };
  }
}

// In-memory úložiště pro dokumenty (v produkci použijte databázi)
let documents = [];

// WebSocket připojení
io.on('connection', (socket) => {
  console.log('Klient připojen:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Klient odpojen:', socket.id);
  });
});

// API Routes

// Získat všechny dokumenty
app.get('/api/documents', (req, res) => {
  res.json(documents.map(doc => ({
    id: doc.id,
    text: doc.text,
    timestamp: doc.timestamp,
    filename: doc.filename
  })));
});

// Nahrát nový dokument
app.post('/api/documents', async (req, res) => {
  try {
    const { image, text, timestamp } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Chybí obrázek' });
    }

    const id = uuidv4();
    const filename = `document_${id}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    
    // Uložíme base64 obrázek jako soubor
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    await fs.writeFile(filepath, base64Data, 'base64');
    
    // Spustíme OCR zpracování na serveru
    let extractedText = text || '';
    try {
      console.log('Zpracovávám OCR pro dokument:', id);
      const ocrResult = await processOCR(filepath);
      extractedText = ocrResult.text;
      console.log('OCR dokončeno pro dokument:', id);
    } catch (ocrError) {
      console.error('Chyba OCR:', ocrError);
      // Pokračujeme i bez OCR textu
    }
    
    const document = {
      id,
      text: extractedText,
      timestamp: timestamp || new Date().toISOString(),
      filename,
      filepath
    };
    
    documents.push(document);
    
    // Pošleme notifikaci všem připojeným klientům
    io.emit('newDocument', {
      id: document.id,
      text: document.text,
      timestamp: document.timestamp,
      filename: document.filename
    });
    
    console.log(`Nový dokument přijat: ${id}`);
    res.status(201).json({ 
      message: 'Dokument úspěšně nahrán', 
      id: document.id,
      text: extractedText 
    });
    
  } catch (error) {
    console.error('Chyba při nahrávání dokumentu:', error);
    res.status(500).json({ error: 'Chyba serveru' });
  }
});

// Získat konkrétní dokument
app.get('/api/documents/:id', (req, res) => {
  const document = documents.find(doc => doc.id === req.params.id);
  
  if (!document) {
    return res.status(404).json({ error: 'Dokument nenalezen' });
  }
  
  res.json(document);
});

// Smazat dokument
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const docIndex = documents.findIndex(doc => doc.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({ error: 'Dokument nenalezen' });
    }
    
    const document = documents[docIndex];
    
    // Smažeme soubor
    if (document.filepath && await fs.pathExists(document.filepath)) {
      await fs.remove(document.filepath);
    }
    
    // Odebereme z pole
    documents.splice(docIndex, 1);
    
    // Notifikujeme klienty
    io.emit('documentDeleted', req.params.id);
    
    res.json({ message: 'Dokument smazán' });
    
  } catch (error) {
    console.error('Chyba při mazání dokumentu:', error);
    res.status(500).json({ error: 'Chyba serveru' });
  }
});

// Stáhnout obrázek dokumentu
app.get('/api/documents/:id/image', (req, res) => {
  const document = documents.find(doc => doc.id === req.params.id);
  
  if (!document || !document.filepath) {
    return res.status(404).json({ error: 'Obrázek nenalezen' });
  }
  
  res.sendFile(document.filepath);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    documentsCount: documents.length 
  });
});

// Hlavní stránka
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint nenalezen' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Interní chyba serveru' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server běží na portu ${PORT}`);
  console.log(`Webové rozhraní: http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api`);
});
