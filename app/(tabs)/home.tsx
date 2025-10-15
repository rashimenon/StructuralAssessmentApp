import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#002b36', '#005f73', '#0a9396']}
      style={styles.container}
    >
      <View style={styles.content}>
        

        <Text style={styles.title}>🏗️ Structural Assessment Tool</Text>
        <Text style={styles.subtitle}>
          Rapid Visual Screening & Hazard Mapping for Disaster Response
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('../location-info')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        © 2025 RVS Digitization | Smart India Hackathon
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0fbfc',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#ee9b00',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#001219',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  footer: {
    textAlign: 'center',
    color: '#cdeefc',
    fontSize: 12,
    marginBottom: 10,
  },
});
