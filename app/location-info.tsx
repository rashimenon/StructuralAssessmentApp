import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { saveData } from '../lib/localStorage'; // ✅ import helper

export default function LocationInfoScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        setLoading(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(region);
      setMarker({
        latitude: region.latitude,
        longitude: region.longitude,
      });
      setLoading(false);
    })();
  }, []);

  // Allow user to tap to reposition marker
  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  // ✅ Save offline + navigate
  const handleNext = async () => {
    if (!marker) {
      Alert.alert('No Location Selected', 'Please select a location on the map.');
      return;
    }

    const timestamp = new Date().toISOString();
    const locationData = {
      latitude: marker.latitude,
      longitude: marker.longitude,
      timestamp,
    };

    try {
      await saveData('locationInfo', locationData); // ✅ offline save
      console.log('Saved locationInfo locally');
    } catch (error) {
      console.error('Failed to save location info:', error);
    }

    router.push('/building-details'); // ✅ navigate next
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView style={styles.map} initialRegion={location} onPress={handleMapPress}>
          {marker && <Marker coordinate={marker} />}
        </MapView>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.text}>📍 Latitude: {marker?.latitude?.toFixed(5)}</Text>
        <Text style={styles.text}>📍 Longitude: {marker?.longitude?.toFixed(5)}</Text>
        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  infoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  text: { fontSize: 16, marginVertical: 4 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
