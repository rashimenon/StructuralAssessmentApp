import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { saveData } from "../lib/localStorage";

const hazardTypes = [
  { type: "Crack", icon: "🧱", color: "red" },
  { type: "Water Leak", icon: "💧", color: "deepskyblue" },
  { type: "Electrical Fault", icon: "⚡", color: "gold" },
  { type: "Blocked Exit", icon: "🚪", color: "orange" },
  { type: "Fire", icon: "🔥", color: "crimson" },
];

export default function HazardMappingScreen() {
  const { buildingData } = useLocalSearchParams();
  const parsedData = buildingData ? JSON.parse(buildingData) : null;

  const [mapRegion, setMapRegion] = useState(null);
  const [hazards, setHazards] = useState([]);
  const [selectedHazard, setSelectedHazard] = useState(hazardTypes[0]);
  const [loading, setLoading] = useState(true);

  // 🧭 Fetch current GPS location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required to view the map.");
        setLoading(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      };
      setMapRegion(region);
      setLoading(false);
    })();
  }, []);

  // 🟩 Add a new hazard marker
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setHazards((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: selectedHazard.type,
        icon: selectedHazard.icon,
        color: selectedHazard.color,
        coords: { latitude, longitude },
      },
    ]);
  };

  // 🔁 Allow repositioning markers
  const handleDragEnd = (id, newCoords) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === id ? { ...h, coords: newCoords } : h))
    );
  };

  // 💾 Save data and move to summary
  const handleSave = async () => {
    if (!hazards.length) {
      Alert.alert("No Hazards", "Please mark at least one hazard before finishing.");
      return;
    }

    const finalData = {
      hazards,
      region: mapRegion,
      building: parsedData,
      timestamp: new Date().toISOString(),
    };

    try {
      await saveData("offlineHazards", finalData);
      console.log("✅ Hazards saved locally");
    } catch (error) {
      console.error("Error saving hazards:", error);
    }

    router.push({
      pathname: "/summary",
      params: {
        hazards: JSON.stringify(hazards),
        buildingData: JSON.stringify(parsedData),
      },
    });
  };

  if (loading || !mapRegion) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Fetching GPS location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <MapView
        style={{ flex: 1 }}
        mapType="hybrid"
        onPress={handleMapPress}
        region={mapRegion}
      >
        {hazards.map((hazard) => (
          <Marker
            key={hazard.id}
            coordinate={hazard.coords}
            title={hazard.type}
            pinColor={hazard.color}
            draggable
            onDragEnd={(e) => handleDragEnd(hazard.id, e.nativeEvent.coordinate)}
          >
            <View style={styles.markerContainer}>
              <Text style={styles.markerIcon}>{hazard.icon}</Text>
              <Text style={styles.markerLabel}>{hazard.type}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* 🧰 Hazard Type Toolbar */}
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Select Hazard Type:</Text>
        <View style={styles.hazardList}>
          {hazardTypes.map((hazard) => (
            <TouchableOpacity
              key={hazard.type}
              style={[
                styles.hazardButton,
                selectedHazard.type === hazard.type && styles.selectedHazard,
              ]}
              onPress={() => setSelectedHazard(hazard)}
            >
              <Text style={{ fontSize: 18 }}>{hazard.icon}</Text>
              <Text style={styles.hazardText}>{hazard.type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 💾 Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>✅ Save & Finish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  markerContainer: { alignItems: "center" },
  markerIcon: { fontSize: 20 },
  markerLabel: { color: "#fff", fontSize: 10, textAlign: "center" },
  toolbar: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  toolbarTitle: { color: "#fff", fontSize: 14, marginBottom: 5, textAlign: "center" },
  hazardList: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  hazardButton: {
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 8,
    margin: 5,
    width: 90,
  },
  selectedHazard: {
    backgroundColor: "#00ffcc",
  },
  hazardText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#00ffcc",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
