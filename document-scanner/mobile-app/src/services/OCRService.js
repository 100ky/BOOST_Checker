// Pro jednoduchost budeme OCR zpracovávat na serveru
// V budoucnu můžeme integrovat cloudové API jako Google Vision nebo Azure

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

  static async isAvailable() {
    return true;
  }
}

export default OCRService;
