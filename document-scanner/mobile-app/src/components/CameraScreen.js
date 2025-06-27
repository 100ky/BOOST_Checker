import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Title } from 'react-native-paper';
import OCRService from '../services/OCRService';
import ApiService from '../services/ApiService';
import TextPreview from './TextPreview';

export default function CameraScreen() {
  const [type, setType] = useState(CameraType.back);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastImage, setLastImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [documentType, setDocumentType] = useState('document');
  const cameraRef = useRef();

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        // Upravíme obrázek pro lepší OCR rozpoznávání textu a čísel
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            { resize: { width: 1200 } }, // Vyšší rozlišení pro lepší OCR
            { rotate: 0 }
          ],
          { 
            compress: 0.9, // Vyšší kvalita pro lepší rozpoznávání
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true 
          }
        );

        setLastImage(manipulatedImage.uri);
        
        // Spustíme OCR
        const text = await OCRService.extractText(manipulatedImage.uri);
        setExtractedText(text);
        
        // Pošleme data na server
        const response = await ApiService.uploadDocument({
          image: manipulatedImage.base64,
          text: text,
          timestamp: new Date().toISOString()
        });
        
        // Uložíme parsovaná data z odpovědi serveru
        if (response.parsed) {
          setParsedData(response.parsed);
        }
        if (response.type) {
          setDocumentType(response.type);
        }
        
        Alert.alert('Úspěch', 'Dokument byl úspěšně naskenován a odeslán!');
        
      } catch (error) {
        console.error('Chyba při skenování:', error);
        Alert.alert('Chyba', 'Nepodařilo se naskenovat dokument.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const toggleCameraType = () => {
    setType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera 
          style={styles.camera} 
          type={type}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.captureButton, isProcessing && styles.disabledButton]}
          onPress={takePicture}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons name="camera" size={32} color="white" />
          )}
        </TouchableOpacity>
        
        {lastImage && (
          <View style={styles.previewContainer}>
            <Card style={styles.imageCard}>
              <Card.Content>
                <Title>Poslední snímek</Title>
                <Image source={{ uri: lastImage }} style={styles.previewImage} />
              </Card.Content>
            </Card>
            <TextPreview 
              text={extractedText} 
              parsed={parsedData}
              type={documentType}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 0.7,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  flipButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  controlsContainer: {
    flex: 0.3,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#2196F3',
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  resultCard: {
    width: '100%',
    marginTop: 10,
  },
  previewContainer: {
    width: '100%',
  },
  imageCard: {
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginVertical: 10,
  },
  textContainer: {
    marginTop: 10,
  },
  textLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  extractedText: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    fontSize: 12,
  },
});
