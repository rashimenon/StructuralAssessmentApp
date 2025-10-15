import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { saveData } from "../lib/localStorage";

export default function BuildingMapScreen() {
  const { photos } = useLocalSearchParams();
  const parsedPhotos = photos ? JSON.parse(photos) : [];

  const [markers, setMarkers] = useState(parsedPhotos);
  const [activePhotoId, setActivePhotoId] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧭 Get current GPS location to center map
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
      setLoading(false);
    })();
  }, []);

  // 🗺️ Tap map to set marker for active photo
  const handleMapPress = (e) => {
    if (!activePhotoId) {
      alert("Select a photo first to place its marker.");
      return;
    }

    const newCoord = e.nativeEvent.coordinate;
    setMarkers((prev) =>
      prev.map((m) => (m.id === activePhotoId ? { ...m, coords: newCoord } : m))
    );
    setActivePhotoId(null); // reset after placing
  };

const handleConfirm = async () => {
  const updatedData = {
    photos: markers,
    region,
    timestamp: new Date().toISOString(),
  };

  // ✅ Save locally (offline persistence)
  await saveData('offlineMappedPhotos', updatedData);
  console.log('✅ Offline map data saved successfully');

  alert('Photo locations saved (offline)!');

  // Continue navigation
  router.push({
    pathname: '/hazard-map',
    params: {
      photos: JSON.stringify(markers),
      region: JSON.stringify(region),
    },
  });
};


  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={styles.text}>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        mapType="satellite"
        region={region}
        onPress={handleMapPress}
      >
        {markers.map((photo) =>
          photo.coords ? (
            <Marker
              key={photo.id}
              coordinate={photo.coords}
              title={`Photo ${photo.id}`}
            >
              <View style={styles.markerCircle}>
                <Text style={styles.markerText}>{photo.id}</Text>
              </View>
            </Marker>
          ) : null
        )}
      </MapView>

      <View style={styles.bottomContainer}>
        <Text style={styles.instructions}>
          Select a photo → Tap on the map to place its marker
        </Text>

        {markers.map((photo) => (
          <View key={photo.id} style={styles.photoRow}>
            <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
            <Button
              title={
                activePhotoId === photo.id
                  ? `Placing Photo ${photo.id}...`
                  : photo.coords
                  ? `Reposition Photo ${photo.id}`
                  : `Place Photo ${photo.id}`
              }
              color={activePhotoId === photo.id ? "orange" : "#007bff"}
              onPress={() => setActivePhotoId(photo.id)}
            />
          </View>
        ))}

        <Button title="Confirm & Save" onPress={handleConfirm} />
      </View>
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
  text: {
    color: "#fff",
    marginTop: 10,
  },
  bottomContainer: {
    backgroundColor: "#000",
    padding: 10,
  },
  instructions: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  markerCircle: {
    backgroundColor: "red",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerText: {
    color: "#fff",
    fontWeight: "bold",
  },
});