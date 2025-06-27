/**
 * Specializovaný parser pro průvodky ECOS
 * Extrahuje číslo výkresu a množství výrobku
 */

class PruvodkaParser {
  /**
   * Parsuje text z průvodky a extrahuje důležité informace
   * @param {string} rawText - Raw text z OCR
   * @returns {Object} Parsované informace
   */
  static parsePruvodka(rawText) {
    const result = {
      cisloVykresu: null,
      mnozstviVyrobku: null,
      mnozstviPolozky: null,
      jednotky: 'ks',
      parsed: false,
      rawData: rawText
    };

    try {
      // Normalizace textu
      const normalizedText = rawText
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s\d.,:-]/g, ' ')
        .trim();

      // 1. Hledání čísla výkresu
      result.cisloVykresu = this.extractCisloVykresu(normalizedText);

      // 2. Hledání množství výrobku
      result.mnozstviVyrobku = this.extractMnozstviVyrobku(normalizedText);

      // 3. Hledání množství položky
      result.mnozstviPolozky = this.extractMnozstviPolozky(normalizedText);

      // 4. Detekce jednotek
      result.jednotky = this.extractJednotky(normalizedText);

      // Označení jako úspěšně parsované, pokud najdeme alespoň jedno číslo
      result.parsed = !!(result.cisloVykresu || result.mnozstviVyrobku || result.mnozstviPolozky);

      return result;
    } catch (error) {
      console.error('Chyba při parsování průvodky:', error);
      return result;
    }
  }

  /**
   * Extrahuje číslo výkresu z textu
   */
  static extractCisloVykresu(text) {
    // Různé možnosti označení čísla výkresu
    const patterns = [
      // Číslo výkresu: 1234567890
      /(?:číslo\s*výkresu|cislo\s*vykresu|výkres|vykres|drawing|dwg)[:\s]*([A-Z0-9\-._]+)/i,
      
      // VP-2025-0091968 (formát z obrázku)
      /VP-\d{4}-\d{7}/i,
      
      // Evidenční číslo
      /(?:evidenční|evidencni)[:\s]*([A-Z0-9\-._]+)/i,
      
      // Identifikační číslo
      /(?:identifikač|identifikac)[:\s]*([A-Z0-9\-._]+)/i,
      
      // Obecný pattern pro alfanumerické kódy
      /([A-Z]{2,3}-\d{4}-\d{6,8})/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return null;
  }

  /**
   * Extrahuje množství výrobku
   */
  static extractMnozstviVyrobku(text) {
    const patterns = [
      // "Množství výrobku 2,00 ks"
      /(?:množství\s*výrobku|mnozstvi\s*vyrobku)[:\s]*(\d+[,.]?\d*)\s*ks/i,
      
      // "Množství výrobku: 2.00"
      /(?:množství\s*výrobku|mnozstvi\s*vyrobku)[:\s]*(\d+[,.]?\d*)/i,
      
      // Hledání čísla před "ks" v kontextu výrobku
      /výrobku[^0-9]*(\d+[,.]?\d*)\s*ks/i,
      
      // Číselné hodnoty následované "ks" (obecně)
      /(\d+[,.]?\d*)\s*ks/gi
    ];

    const foundNumbers = [];
    
    for (const pattern of patterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          foundNumbers.push(parseFloat(match[1].replace(',', '.')));
        }
      }
    }

    // Vrátíme první nalezené číslo nebo nejčastější
    return foundNumbers.length > 0 ? foundNumbers[0] : null;
  }

  /**
   * Extrahuje množství položky
   */
  static extractMnozstviPolozky(text) {
    const patterns = [
      // "Množství položky 2,00 ks"
      /(?:množství\s*položky|mnozstvi\s*polozky)[:\s]*(\d+[,.]?\d*)\s*ks/i,
      
      // "Množství položky: 2.00"
      /(?:množství\s*položky|mnozstvi\s*polozky)[:\s]*(\d+[,.]?\d*)/i,
      
      // Hledání v kontextu položky
      /položky?[^0-9]*(\d+[,.]?\d*)\s*ks/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return parseFloat(match[1].replace(',', '.'));
      }
    }

    return null;
  }

  /**
   * Detekuje jednotky (ks, kg, m, atd.)
   */
  static extractJednotky(text) {
    const patterns = [
      /(\d+[,.]?\d*)\s*(ks|kg|g|m|mm|cm|l|ml|t)/gi
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[2]) {
        return match[2];
      }
    }

    return 'ks'; // Default
  }

  /**
   * Vytvoří strukturovaný výstup pro uživatele
   */
  static formatOutput(parsedData) {
    const output = {
      title: 'Průvodka',
      sections: []
    };

    if (parsedData.cisloVykresu) {
      output.sections.push({
        label: 'Číslo výkresu',
        value: parsedData.cisloVykresu,
        type: 'drawing_number'
      });
    }

    if (parsedData.mnozstviVyrobku) {
      output.sections.push({
        label: 'Množství výrobku',
        value: `${parsedData.mnozstviVyrobku} ${parsedData.jednotky}`,
        type: 'product_quantity'
      });
    }

    if (parsedData.mnozstviPolozky) {
      output.sections.push({
        label: 'Množství položky',
        value: `${parsedData.mnozstviPolozky} ${parsedData.jednotky}`,
        type: 'item_quantity'
      });
    }

    return output;
  }

  /**
   * Validuje, zda se jedná o průvodku
   */
  static validatePruvodka(text) {
    const indicators = [
      /průvodka/i,
      /ecos/i,
      /výkres/i,
      /množství\s*výrobku/i,
      /evidenční/i,
      /VP-\d{4}-\d{7}/i
    ];

    let score = 0;
    for (const pattern of indicators) {
      if (pattern.test(text)) {
        score++;
      }
    }

    return {
      isPruvodka: score >= 2,
      confidence: (score / indicators.length) * 100
    };
  }
}

export default PruvodkaParser;
