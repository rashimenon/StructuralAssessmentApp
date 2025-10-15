// app/summary.tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SummaryScreen() {
  const params = useLocalSearchParams();

  // parse hazards param safely
  const hazards = useMemo(() => {
    const h = params.hazards as string | undefined;
    if (!h) return [];
    try {
      const parsed = JSON.parse(h);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Couldn't parse hazards param:", e);
      return [];
    }
  }, [params.hazards]);

  // parse buildingData param safely
  const building = useMemo(() => {
    const b = params.buildingData as string | undefined;
    if (!b) return null;
    try {
      return JSON.parse(b);
    } catch (e) {
      console.warn("Couldn't parse buildingData param:", e);
      return null;
    }
  }, [params.buildingData]);

  const buildingName = building?.buildingName ?? building?.name ?? "N/A";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Data Collection Complete</Text>

      <Text style={styles.subtitle}>
        All collected field data is saved locally. It will sync automatically when
        your device is online.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.info}>• Hazards recorded: {hazards.length}</Text>
        <Text style={styles.info}>• Photos mapped: {building?.photos ? building.photos.length : "N/A"}</Text>
        <Text style={styles.info}>• Building: {buildingName}</Text>
        <Text style={styles.info}>• Timestamp: {building?.timestamp ?? "N/A"}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>🏠 Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#00ffcc",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: "#cfcfcf",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 18,
  },
  info: {
    color: "#fff",
    fontSize: 15,
    marginVertical: 4,
  },
  button: {
    backgroundColor: "#00ffcc",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
    minWidth: 180,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },
});
