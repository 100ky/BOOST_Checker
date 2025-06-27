// Konfigurace pro produkční nasazení
module.exports = {
  development: {
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    ocr: {
      languages: 'ces+eng',
      confidence_threshold: 60
    }
  },
  production: {
    server: {
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    },
    ocr: {
      languages: 'ces+eng',
      confidence_threshold: 70
    },
    database: {
      // Pro produkci doporučujeme databázi
      type: 'mongodb',
      url: process.env.MONGODB_URL || 'mongodb://localhost:27017/document-scanner'
    }
  }
};
