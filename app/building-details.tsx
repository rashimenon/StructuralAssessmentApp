// app/building-details.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { saveData } from '../lib/localStorage';

export default function BuildingDetailsScreen() {
  const [buildingName, setBuildingName] = useState('');
  const [surveyorName, setSurveyorName] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [timestamp, setTimestamp] = useState('');

  // Fetch GPS
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
      try {
        let geocode = await Location.reverseGeocodeAsync(location.coords);
        if (geocode.length > 0) {
          const place = geocode[0];
          setAddress(`${place.name || ''}, ${place.city || ''}, ${place.region || ''}`);
        }
      } catch (e) {
        console.warn('Reverse geocode failed');
      }
      setTimestamp(new Date().toLocaleString());
    };
    getLocation();
  }, []);

  const [structuralType, setStructuralType] = useState<string | null>(null);
  const structuralOptions = [
    { label: 'Unreinforced Masonry', value: 'URM', image: require('../assets/images/structural/urm.png') },
    { label: 'RC Frame + Infill', value: 'RC', image: require('../assets/images/structural/rc_frame.png') },
  ];

  const [selectedOccupancy, setSelectedOccupancy] = useState<string[]>([]);
  const occupancyOptions = [
    'Residential', 'Educational', 'Healthcare', 'Police Station', 'Fire Station',
    'Transportation', 'Power Facility', 'Communication', 'Governance',
  ];
  const toggleOccupancy = (category: string) =>
    setSelectedOccupancy((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );

  const [buildingAge, setBuildingAge] = useState<string | null>(null);
  const [floors, setFloors] = useState('');
  const [footprint, setFootprint] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const materialOptions = [
    { label: 'Brick', value: 'brick', image: require('../assets/images/materials/brick.png') },
    { label: 'Stone', value: 'stone', image: require('../assets/images/materials/stone.png') },
    { label: 'Concrete', value: 'concrete', image: require('../assets/images/materials/concrete.png') },
    { label: 'Timber/Wood', value: 'timber', image: require('../assets/images/materials/timber.png') },
    { label: 'Adobe/Mud', value: 'adobe', image: require('../assets/images/materials/adobe.png') },
  ];

  const toggleMaterial = (value: string) =>
    setSelectedMaterials((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

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
      selectedMaterials,
    };

    await saveData('buildingDetails', data);
    console.log('✅ Saved buildingDetails locally');
    router.push(`../photo-capture?buildingData=${encodeURIComponent(JSON.stringify(data))}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🏢 Building Details</Text>

      {/* Basic Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="information-circle-outline" size={18} color="#00e6a8" /> Basic Info
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Building Name"
          placeholderTextColor="#888"
          value={buildingName}
          onChangeText={setBuildingName}
        />
        <TextInput
          style={styles.input}
          placeholder="Surveyor Name"
          placeholderTextColor="#888"
          value={surveyorName}
          onChangeText={setSurveyorName}
        />
        <Text style={styles.subText}>
          📍 {coordinates ? `${coordinates.lat.toFixed(5)}, ${coordinates.lon.toFixed(5)}` : 'Fetching...'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#888"
          value={address}
          onChangeText={setAddress}
        />
        <Text style={styles.subText}>🕒 {timestamp || 'Fetching...'}</Text>
      </View>

      {/* Structural Type */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🏗️ Structural Typology</Text>
        <View style={styles.rowWrap}>
          {structuralOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.imageOption, structuralType === opt.value && styles.selected]}
              onPress={() => setStructuralType(opt.value)}
            >
              <Image source={opt.image} style={styles.optionImage} />
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Occupancy */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🏠 Occupancy Type</Text>
        <View style={styles.rowWrap}>
          {occupancyOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, selectedOccupancy.includes(opt) && styles.chipSelected]}
              onPress={() => toggleOccupancy(opt)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedOccupancy.includes(opt) && styles.chipTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Building Age */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🏗️ Building Age</Text>
        <View style={styles.rowWrap}>
          {['Pre-1990', 'Post-1990'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, buildingAge === opt && styles.chipSelected]}
              onPress={() => setBuildingAge(opt)}
            >
              <Text
                style={[
                  styles.chipText,
                  buildingAge === opt && styles.chipTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Floors and Footprint */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Number of Floors"
          placeholderTextColor="#888"
          value={floors}
          onChangeText={setFloors}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Footprint (sq.m)"
          placeholderTextColor="#888"
          value={footprint}
          onChangeText={setFootprint}
        />
      </View>

      {/* Materials */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🏗️ Construction Materials</Text>
        <View style={styles.rowWrap}>
          {materialOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.imageOption, selectedMaterials.includes(opt.value) && styles.selected]}
              onPress={() => toggleMaterial(opt.value)}
            >
              <Image source={opt.image} style={styles.optionImage} />
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          !(
            buildingName &&
            surveyorName &&
            structuralType &&
            buildingAge &&
            floors &&
            footprint &&
            selectedMaterials.length > 0
          ) && { opacity: 0.5 },
        ]}
        onPress={handleSaveAndContinue}
        disabled={
          !buildingName ||
          !surveyorName ||
          !structuralType ||
          !buildingAge ||
          !floors ||
          !footprint ||
          selectedMaterials.length === 0
        }
      >
        <Text style={styles.saveButtonText}>💾 Save & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0f', padding: 16 },
  header: { fontSize: 26, color: '#00e6a8', fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  card: {
    backgroundColor: '#1a1a1f',
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sectionTitle: { color: '#00e6a8', fontWeight: '600', marginBottom: 10, fontSize: 16 },
  input: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  subText: { color: '#aaa', fontSize: 14, marginTop: 4 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  imageOption: {
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 10,
    margin: 5,
    padding: 8,
    width: 90,
  },
  selected: { backgroundColor: '#00e6a8' },
  optionImage: { width: 70, height: 70, borderRadius: 8, marginBottom: 4 },
  optionLabel: { color: '#fff', fontSize: 12, textAlign: 'center' },
  chip: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: '#222',
  },
  chipSelected: { backgroundColor: '#00e6a8', borderColor: '#00e6a8' },
  chipText: { color: '#fff' },
  chipTextSelected: { color: '#000', fontWeight: '600' },
  saveButton: {
    backgroundColor: '#00e6a8',
    marginVertical: 24,
    borderRadius: 12,
    alignItems: 'center',
    padding: 14,
  },
  saveButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
