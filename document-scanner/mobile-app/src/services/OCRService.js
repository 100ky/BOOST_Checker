import PruvodkaParser from './PruvodkaParser';

// OCR service pro zpracování dokumentů s specializací na průvodky
class OCRService {
  static async extractText(imageUri) {
    try {
      // Pro demonstraci vrátíme prázdný řetězec
      // V produkční verzi by se obrázek poslal na server nebo cloudové API
      console.log('OCR processing image:', imageUri);
      
      // Simulace zpracování
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vrátíme prázdný řetězec - text bude zpracován na serveru
      return '';
    } catch (error) {
      console.error('OCR Error:', error);
      return '';
    }
  }

  /**
   * Zpracuje text pomocí specializovaného parseru pro průvodky
   * @param {string} rawText - Raw text z OCR
   * @returns {Object} Zpracované informace
   */
  static async processPruvodka(rawText) {
    try {
      console.log('Processing průvodka:', rawText);
      
      // 1. Validace, zda se jedná o průvodku
      const validation = PruvodkaParser.validatePruvodka(rawText);
      
      if (!validation.isPruvodka) {
        return {
          type: 'unknown',
          confidence: validation.confidence,
          message: 'Dokument nerozpoznán jako průvodka'
        };
      }

      // 2. Parsování průvodky
      const parsedData = PruvodkaParser.parsePruvodka(rawText);
      
      // 3. Formátování výstupu
      const formattedOutput = PruvodkaParser.formatOutput(parsedData);
      
      return {
        type: 'pruvodka',
        confidence: validation.confidence,
        parsed: parsedData.parsed,
        data: parsedData,
        formatted: formattedOutput,
        rawText: rawText
      };
      
    } catch (error) {
      console.error('Error processing průvodka:', error);
      return {
        type: 'error',
        error: error.message,
        rawText: rawText
      };
    }
  }

  static async isAvailable() {
    return true;
  }
}

export default OCRService;
