/**
 * Specializovaný parser pro průvodky ECOS na serveru
 * Extrahuje číslo výkresu a množství výrobku z OCR textu
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
      rawData: rawText,
      detectedNumbers: [],
      detectedCodes: []
    };

    try {
      // Normalizace textu
      const normalizedText = rawText
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s\d.,:-]/g, ' ')
        .trim();

      console.log('Parsing průvodka text:', normalizedText);

      // 1. Hledání čísla výkresu
      result.cisloVykresu = this.extractCisloVykresu(normalizedText);

      // 2. Hledání množství výrobku
      result.mnozstviVyrobku = this.extractMnozstviVyrobku(normalizedText);

      // 3. Hledání množství položky
      result.mnozstviPolozky = this.extractMnozstviPolozky(normalizedText);

      // 4. Detekce jednotek
      result.jednotky = this.extractJednotky(normalizedText);

      // 5. Extrakce všech čísel a kódů pro debug
      result.detectedNumbers = this.extractAllNumbers(normalizedText);
      result.detectedCodes = this.extractAllCodes(normalizedText);

      // Označení jako úspěšně parsované, pokud najdeme alespoň jedno číslo
      result.parsed = !!(result.cisloVykresu || result.mnozstviVyrobku || result.mnozstviPolozky);

      console.log('Parsing result:', result);
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
      // VP-2025-0091968 (přesný formát z obrázku)
      /VP-\d{4}-\d{7}/i,
      
      // Obecný pattern pro ECOS kódy
      /[A-Z]{2,3}-\d{4}-\d{6,8}/i,
      
      // Číslo výkresu: 1234567890
      /(?:číslo\s*výkresu|cislo\s*vykresu|výkres|vykres|drawing|dwg)[:\s]*([A-Z0-9\-._]+)/i,
      
      // Evidenční číslo
      /(?:evidenční|evidencni)[:\s]*([A-Z0-9\-._]+)/i,
      
      // ID nebo číselné kódy
      /(?:^|\s)([A-Z]{2,3}-\d{4}-\d{6,9})(?:\s|$)/i,
      
      // Dlouhé číselné sekvence (10+ číslic)
      /(\d{10,})/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const result = match[1] || match[0];
        console.log(`Found číslo výkresu: ${result} using pattern: ${pattern}`);
        return result.trim();
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
      
      // Hledání v kontextu výrobku
      /výrobku[^0-9]*?(\d+[,.]?\d*)\s*ks/i,
      
      // Hledání čísel s "ks" v blízkosti slova "výrobek"
      /výrobk[a-z]*[^0-9]*?(\d+[,.]?\d*)\s*ks/i,
      
      // Obecné hledání "X,XX ks" nebo "X.XX ks"
      /(\d+[,.]?\d*)\s*ks/gi
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const value = parseFloat(match[1].replace(',', '.'));
        console.log(`Found množství výrobku: ${value} using pattern: ${pattern}`);
        return value;
      }
    }

    return null;
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
      /položky?[^0-9]*?(\d+[,.]?\d*)\s*ks/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const value = parseFloat(match[1].replace(',', '.'));
        console.log(`Found množství položky: ${value} using pattern: ${pattern}`);
        return value;
      }
    }

    return null;
  }

  /**
   * Detekuje jednotky
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
   * Extrahuje všechna čísla pro debug
   */
  static extractAllNumbers(text) {
    const numbers = [];
    const patterns = [
      /(\d+[,.]?\d*)\s*ks/gi,
      /(\d{10,})/g,
      /(\d+[,.]?\d+)/g,
      /(\d+)/g
    ];

    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        if (match[1]) {
          numbers.push({
            value: match[1],
            context: text.substring(Math.max(0, match.index - 20), match.index + match[0].length + 20)
          });
        }
      }
    }

    return numbers;
  }

  /**
   * Extrahuje všechny kódy pro debug
   */
  static extractAllCodes(text) {
    const codes = [];
    const patterns = [
      /([A-Z]{2,3}-\d{4}-\d{6,9})/gi,
      /([A-Z]+\d+[A-Z]*\d*)/gi,
      /(\d{8,})/g
    ];

    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        if (match[1]) {
          codes.push({
            value: match[1],
            context: text.substring(Math.max(0, match.index - 20), match.index + match[0].length + 20)
          });
        }
      }
    }

    return codes;
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
      /VP-\d{4}-\d{7}/i,
      /\d+\s*ks/i // jakékoliv množství s "ks"
    ];

    let score = 0;
    const foundIndicators = [];
    
    for (const pattern of indicators) {
      if (pattern.test(text)) {
        score++;
        foundIndicators.push(pattern.toString());
      }
    }

    const result = {
      isPruvodka: score >= 1, // Snížený práh pro lepší detekci
      confidence: (score / indicators.length) * 100,
      foundIndicators: foundIndicators
    };

    console.log('Průvodka validation:', result);
    return result;
  }

  /**
   * Vytvoří strukturovaný výstup
   */
  static formatOutput(parsedData) {
    const output = {
      title: 'Průvodka ECOS',
      type: 'pruvodka',
      sections: [],
      summary: {}
    };

    if (parsedData.cisloVykresu) {
      output.sections.push({
        label: 'Číslo výkresu',
        value: parsedData.cisloVykresu,
        type: 'drawing_number',
        highlighted: true
      });
      output.summary.cisloVykresu = parsedData.cisloVykresu;
    }

    if (parsedData.mnozstviVyrobku) {
      output.sections.push({
        label: 'Množství výrobku',
        value: `${parsedData.mnozstviVyrobku} ${parsedData.jednotky}`,
        type: 'product_quantity',
        highlighted: true
      });
      output.summary.mnozstviVyrobku = parsedData.mnozstviVyrobku;
    }

    if (parsedData.mnozstviPolozky) {
      output.sections.push({
        label: 'Množství položky',
        value: `${parsedData.mnozstviPolozky} ${parsedData.jednotky}`,
        type: 'item_quantity',
        highlighted: true
      });
      output.summary.mnozstviPolozky = parsedData.mnozstviPolozky;
    }

    // Debug informace
    if (parsedData.detectedNumbers.length > 0) {
      output.debug = {
        detectedNumbers: parsedData.detectedNumbers,
        detectedCodes: parsedData.detectedCodes
      };
    }

    return output;
  }
}

module.exports = PruvodkaParser;
