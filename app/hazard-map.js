import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { loadData, saveData } from "../lib/localStorage"; // ✅ import offline storage helpers

const hazardTypes = [
  { type: "crack", icon: "🧱", color: "red" },
  { type: "leak", icon: "💧", color: "blue" },
  { type: "electrical", icon: "⚡", color: "yellow" },
  { type: "blocked_exit", icon: "🚪", color: "orange" },
  { type: "fire", icon: "🔥", color: "crimson" },
];

export default function HazardMappingScreen() {
  const { buildingData, region } = useLocalSearchParams();
  const parsedData = buildingData ? JSON.parse(buildingData) : null;

  const [hazards, setHazards] = useState([]);
  const [selectedHazard, setSelectedHazard] = useState(hazardTypes[0]);
  const [mapRegion, setMapRegion] = useState(null);

  // 🟩 load region from previous screen
  useEffect(() => {
    if (region) {
      try {
        setMapRegion(JSON.parse(region));
      } catch (e) {
        console.warn("Invalid region data:", e);
      }
    }
  }, [region]);

  // 🧠 Restore saved hazards if any
  useEffect(() => {
    const loadOfflineData = async () => {
      const saved = await loadData("offlineHazards");
      if (saved && saved.hazards) {
        setHazards(saved.hazards);
        if (saved.region) setMapRegion(saved.region);
        console.log("📍 Restored offline hazards");
      }
    };
    loadOfflineData();
  }, []);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setHazards((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: selectedHazard.type,
        coords: { latitude, longitude },
      },
    ]);
  };

  const handleSave = async () => {
    const finalData = {
      hazards,
      region: mapRegion,
      building: parsedData,
      timestamp: new Date().toISOString(),
    };

    await saveData("offlineHazards", finalData);
    console.log("✅ Offline hazards saved!");

    alert("Hazards saved (offline)!");

    router.push({
      pathname: "/summary",
      params: {
        hazards: JSON.stringify(hazards),
        buildingData: JSON.stringify(parsedData),
      },
    });
  };

  if (!mapRegion) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={{ color: "#fff" }}>Loading map region...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        mapType="satellite"
        onPress={handleMapPress}
        region={mapRegion}
      >
        {hazards.map((hazard) => {
          const hazardInfo = hazardTypes.find((h) => h.type === hazard.type);
          return (
            <Marker
              key={hazard.id}
              coordinate={hazard.coords}
              title={hazard.type.replace("_", " ")}
              description={`Hazard #${hazard.id}`}
              pinColor={hazardInfo?.color || "red"}
            >
              <Text style={{ fontSize: 20 }}>{hazardInfo?.icon}</Text>
            </Marker>
          );
        })}
      </MapView>

      {/* Hazard Toolbar */}
      <View style={styles.hazardBar}>
        {hazardTypes.map((hazard) => (
          <TouchableOpacity
            key={hazard.type}
            style={[
              styles.hazardButton,
              selectedHazard.type === hazard.type && styles.selectedButton,
            ]}
            onPress={() => setSelectedHazard(hazard)}
          >
            <Text style={{ fontSize: 22 }}>{hazard.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Save Hazards & Finish" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  hazardBar: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 8,
  },
  hazardButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#333",
  },
  selectedButton: {
    backgroundColor: "#666",
  },
});
