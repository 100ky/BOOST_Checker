import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';

export default function TextPreview({ text, confidence, parsed, type }) {
  if (!text || text.trim() === '') {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.emptyContent}>
          <Text style={styles.emptyText}>
            Žádný text nebyl rozpoznán
          </Text>
          <Text style={styles.emptySubtext}>
            Zkuste lepší osvětlení nebo ostřejší snímek
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // Detekce čísel a speciálních formátů
  const numbers = text.match(/\d+/g) || [];
  const emails = text.match(/\S+@\S+\.\S+/g) || [];
  const phones = text.match(/[\+]?[\s\-\(\)]?[\d\s\-\(\)]{9,}/g) || [];

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>
            {type === 'pruvodka' ? 'Průvodka' : 'Rozpoznaný text'}
          </Title>
          {confidence && (
            <Chip 
              style={[
                styles.confidenceChip, 
                confidence > 80 ? styles.highConfidence : styles.lowConfidence
              ]}
            >
              {Math.round(confidence)}% přesnost
            </Chip>
          )}
        </View>

        {/* Zobrazení parsovaných dat z průvodky */}
        {parsed && parsed.parsed && (
          <Card style={styles.parsedDataCard}>
            <Card.Content>
              <Title style={styles.parsedTitle}>Extrahovaná data</Title>
              {parsed.cisloVykresu && (
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Číslo výkresu:</Text>
                  <Text style={styles.dataValue}>{parsed.cisloVykresu}</Text>
                </View>
              )}
              {parsed.mnozstviVyrobku && (
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Množství výrobku:</Text>
                  <Text style={styles.dataValue}>{parsed.mnozstviVyrobku}</Text>
                </View>
              )}
              {parsed.polozky && parsed.polozky.length > 0 && (
                <View style={styles.itemsContainer}>
                  <Text style={styles.dataLabel}>Položky:</Text>
                  {parsed.polozky.map((polozka, index) => (
                    <View key={index} style={styles.itemRow}>
                      <Text style={styles.itemText}>• {polozka}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        )}
        
        <ScrollView style={styles.textContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.recognizedText} selectable>
            {text}
          </Text>
        </ScrollView>

        {/* Statistiky */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{text.length}</Text>
            <Text style={styles.statLabel}>znaků</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{text.split(/\s+/).length}</Text>
            <Text style={styles.statLabel}>slov</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{numbers.length}</Text>
            <Text style={styles.statLabel}>čísel</Text>
          </View>
        </View>

        {/* Detekované formáty */}
        {(emails.length > 0 || phones.length > 0) && (
          <View style={styles.detectedFormats}>
            <Text style={styles.formatsTitle}>Detekované formáty:</Text>
            {emails.map((email, index) => (
              <Chip key={`email-${index}`} style={styles.formatChip} icon="email">
                {email}
              </Chip>
            ))}
            {phones.map((phone, index) => (
              <Chip key={`phone-${index}`} style={styles.formatChip} icon="phone">
                {phone.trim()}
              </Chip>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidenceChip: {
    alignSelf: 'flex-start',
  },
  highConfidence: {
    backgroundColor: '#4CAF50',
  },
  lowConfidence: {
    backgroundColor: '#FF9800',
  },
  textContainer: {
    maxHeight: 150,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  recognizedText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detectedFormats: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  formatsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  formatChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  parsedDataCard: {
    marginBottom: 10,
    backgroundColor: '#e8f5e8',
    elevation: 2,
  },
  parsedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    minWidth: 120,
  },
  dataValue: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
    flex: 1,
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemRow: {
    marginLeft: 10,
    marginTop: 4,
  },
  itemText: {
    fontSize: 13,
    color: '#666',
  },
});
