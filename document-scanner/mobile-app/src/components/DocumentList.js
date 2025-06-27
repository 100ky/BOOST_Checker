import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  RefreshControl,
  Alert 
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button,
  Text,
  ActivityIndicator
} from 'react-native-paper';
import ApiService from '../services/ApiService';

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await ApiService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Chyba při načítání dokumentů:', error);
      Alert.alert('Chyba', 'Nepodařilo se načíst dokumenty.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  const deleteDocument = async (id) => {
    Alert.alert(
      'Smazat dokument',
      'Opravdu chcete smazat tento dokument?',
      [
        { text: 'Zrušit', style: 'cancel' },
        { 
          text: 'Smazat', 
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.deleteDocument(id);
              await loadDocuments();
            } catch (error) {
              Alert.alert('Chyba', 'Nepodařilo se smazat dokument.');
            }
          }
        }
      ]
    );
  };

  const renderDocument = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>
          {item.type === 'pruvodka' ? '📋 Průvodka' : '📄 Dokument'} {item.id}
        </Title>
        <Paragraph style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString('cs-CZ')}
        </Paragraph>
        
        {/* Zobrazení extrahovaných údajů z průvodky */}
        {item.parsed && item.parsed.parsed && (
          <View style={styles.parsedDataContainer}>
            <Text style={styles.parsedDataTitle}>📊 Extrahovaná data:</Text>
            
            {item.parsed.cisloVykresu && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>🔢 Číslo výkresu:</Text>
                <Text style={styles.dataValue}>{item.parsed.cisloVykresu}</Text>
              </View>
            )}
            
            {item.parsed.mnozstviVyrobku && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>📦 Množství výrobku:</Text>
                <Text style={styles.dataValue}>{item.parsed.mnozstviVyrobku}</Text>
              </View>
            )}
            
            {item.parsed.confidence && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>🎯 Spolehlivost:</Text>
                <Text style={[styles.dataValue, { color: item.parsed.confidence > 0.7 ? '#4CAF50' : '#FF9800' }]}>
                  {Math.round(item.parsed.confidence * 100)}%
                </Text>
              </View>
            )}
          </View>
        )}
        
        {/* Rozpoznaný text */}
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>📝 Rozpoznaný text:</Text>
          <Paragraph numberOfLines={3} style={styles.text}>
            {item.text || 'Žádný text nebyl rozpoznán'}
          </Paragraph>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => {/* TODO: Otevřít detail */}}
          style={styles.button}
        >
          Detail
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => deleteDocument(item.id)}
          style={styles.button}
        >
          Smazat
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Načítání dokumentů...</Text>
      </View>
    );
  }

  if (documents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Zatím nemáte žádné naskenované dokumenty.
        </Text>
        <Text style={styles.emptySubtext}>
          Přejděte na záložku "Skenovat" a naskenujte svůj první dokument!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
  },
  parsedDataContainer: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  parsedDataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  dataLabel: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
    flex: 1,
  },
  dataValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B5E20',
    flex: 1,
    textAlign: 'right',
  },
  textContainer: {
    marginTop: 8,
  },
  textLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  text: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
  },
});
