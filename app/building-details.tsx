// app/building-details.tsx
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { saveData } from '../lib/localStorage'; // <-- make sure this path matches where you put localStorage.ts

import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BuildingDetailsScreen() {
  // --- Basic Info ---
  const [buildingName, setBuildingName] = useState('');
  const [surveyorName, setSurveyorName] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [timestamp, setTimestamp] = useState('');

  // --- Fetch GPS coordinates ---
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCoordinates({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });

      let geocode = await Location.reverseGeocodeAsync(location.coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        setAddress(`${place.name || ''}, ${place.city || ''}, ${place.region || ''}`);
      }

      setTimestamp(new Date().toISOString());
    };

    getLocation();
  }, []);

  // --- Structural Typology ---
  const [structuralType, setStructuralType] = useState<string | null>(null);
  const structuralOptions = [
    { label: 'Unreinforced Masonry', value: 'URM', image: require('../assets/images/structural/urm.png') },
    { label: 'RC Frame w/ Masonry Infill', value: 'RC', image: require('../assets/images/structural/rc_frame.png') },
  ];

  // --- Occupancy Type ---
  const [selectedOccupancy, setSelectedOccupancy] = useState<string[]>([]);
  const occupancyOptions = [
    'Residential', 'Educational', 'Healthcare', 'Police Station / HQ', 'Fire Station',
    'Food & Civil Supplies', 'Transportation Facility', 'Power Facility', 'Communication Facility',
    'Disaster Management Facility', 'Business / Mercantile', 'Governance Facility',
  ];
  const toggleOccupancy = (category: string) => {
    setSelectedOccupancy((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // --- Building Age ---
  const [buildingAge, setBuildingAge] = useState<string | null>(null);
  const ageOptions = ['Pre-1990', 'Post-1990'];

  // --- Floors, Footprint ---
  const [floors, setFloors] = useState('');
  const [footprint, setFootprint] = useState('');

  // --- Construction Material ---
  const [material, setMaterial] = useState<string | null>(null);
  const materialOptions = [
    { label: 'Brick', value: 'brick', image: require('../assets/images/materials/brick.png') },
    { label: 'Stone', value: 'stone', image: require('../assets/images/materials/stone.png') },
    { label: 'Concrete', value: 'concrete', image: require('../assets/images/materials/concrete.png') },
    { label: 'Timber/Wood', value: 'timber', image: require('../assets/images/materials/timber.png') },
    { label: 'Adobe/Mud', value: 'adobe', image: require('../assets/images/materials/adobe.png') },
  ];

  // --- Handle Save (async!)
  const handleSaveAndContinue = async () => {
    const data = {
      buildingName,
      surveyorName,
      coordinates,
      address,
      timestamp,
      structuralType,
      selectedOccupancy,
      buildingAge,
      floors,
      footprint,
      material,
    };

    // Save offline using AsyncStorage via your helper
    try {
      await saveData('buildingDetails', data);
      console.log('Saved buildingDetails locally');
    } catch (e) {
      console.warn('Failed to save locally:', e);
    }

    // Navigate to photo capture
    router.push(`../photo-capture?buildingData=${encodeURIComponent(JSON.stringify(data))}`);
  };

  // --- Form Sections ---
  const formSections = [
    {
      key: 'basicInfo',
      component: (
        <View>
          <Text style={styles.header}>Basic Info</Text>

          <Text style={styles.label}>Building Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter building name"
            placeholderTextColor="#aaa"
            value={buildingName}
            onChangeText={setBuildingName}
          />

          <Text style={styles.label}>Surveyor Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter surveyor name"
            placeholderTextColor="#aaa"
            value={surveyorName}
            onChangeText={setSurveyorName}
          />

          <Text style={styles.label}>Coordinates</Text>
          <Text style={styles.coordinateText}>
            {coordinates ? `${coordinates.lat.toFixed(6)}, ${coordinates.lon.toFixed(6)}` : 'Fetching...'}
          </Text>

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.label}>Timestamp</Text>
          <Text style={styles.coordinateText}>{timestamp || 'Fetching...'}</Text>
        </View>
      ),
    },
    {
      key: 'structuralType',
      component: (
        <View>
          <Text style={styles.label}>Structural Typology</Text>
          <View style={styles.optionsContainer}>
            {structuralOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.imageOptionButton,
                  structuralType === option.value && styles.selectedOption,
                ]}
                onPress={() => setStructuralType(option.value)}
              >
                <Image source={option.image} style={styles.optionImage} />
                <Text
                  style={[
                    styles.optionText,
                    structuralType === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      key: 'occupancy',
      component: (
        <View>
          <Text style={styles.label}>Occupancy Type</Text>
          <View style={styles.optionsContainer}>
            {occupancyOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedOccupancy.includes(option) && styles.selectedOption,
                ]}
                onPress={() => toggleOccupancy(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOccupancy.includes(option) && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      key: 'buildingAge',
      component: (
        <View>
          <Text style={styles.label}>Building Age</Text>
          <View style={styles.optionsContainer}>
            {ageOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  buildingAge === option && styles.selectedOption,
                ]}
                onPress={() => setBuildingAge(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    buildingAge === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      key: 'floors',
      component: (
        <View>
          <Text style={styles.label}>Number of Floors</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter number of floors"
            placeholderTextColor="#aaa"
            value={floors}
            onChangeText={setFloors}
          />
        </View>
      ),
    },
    {
      key: 'footprint',
      component: (
        <View>
          <Text style={styles.label}>Approximate Footprint Size (sq. m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter area"
            placeholderTextColor="#aaa"
            value={footprint}
            onChangeText={setFootprint}
          />
        </View>
      ),
    },
    {
      key: 'material',
      component: (
        <View>
          <Text style={styles.label}>Construction Material</Text>
          <View style={styles.optionsContainer}>
            {materialOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.imageOptionButton,
                  material === option.value && styles.selectedOption,
                ]}
                onPress={() => setMaterial(option.value)}
              >
                <Image source={option.image} style={styles.optionImage} />
                <Text
                  style={[
                    styles.optionText,
                    material === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      key: 'button',
      component: (
        <View style={{ marginTop: 20, marginBottom: 40 }}>
          <Button
            title="Save & Continue"
            onPress={handleSaveAndContinue} // <-- async handler used directly
            disabled={
              !buildingName ||
              !surveyorName ||
              !structuralType ||
              !buildingAge ||
              !floors ||
              !footprint ||
              !material
            }
          />
        </View>
      ),
    },
  ];

  return (
    <FlatList
      data={formSections}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => item.component}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#000' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, color: '#fff', marginTop: 20, marginBottom: 8 },
  coordinateText: { color: '#fff', fontSize: 14, marginBottom: 10 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  optionButton: {
    borderWidth: 1,
    borderColor: '#666',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 5,
    backgroundColor: '#111',
  },
  imageOptionButton: {
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    margin: 5,
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#111',
    width: 100,
  },
  selectedOption: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  optionText: { color: '#fff', textAlign: 'center' },
  selectedOptionText: { fontWeight: 'bold', color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#666',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#111',
    color: '#fff',
  },
  optionImage: { width: 80, height: 80, marginBottom: 5 },
});
