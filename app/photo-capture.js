import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { saveData } from '../lib/localStorage'; // ✅ add this line

export default function PhotoCaptureScreen() {
  const { buildingData } = useLocalSearchParams();
  const parsedData = buildingData ? JSON.parse(buildingData) : null;

  const cameraRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  const MAX_PHOTOS = 10;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <Text style={styles.text}>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>We need your permission to use the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current && photos.length < MAX_PHOTOS) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotos([...photos, photo.uri]);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const dataToSave = {
      buildingData: parsedData,
      photos: photos.map((uri, index) => ({
        uri,
        id: index + 1,
        coords: null,
      })),
      timestamp: new Date().toISOString(),
    };

    await saveData('offlinePhotoData', dataToSave); // ✅ store offline until connectivity returns
    console.log('✅ Saved offline data successfully');

    router.push({
      pathname: '/building-map',
      params: {
        photos: JSON.stringify(dataToSave.photos),
        buildingData: JSON.stringify(parsedData),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Capture Photos ({photos.length}/{MAX_PHOTOS})</Text>

      <CameraView style={styles.camera} ref={cameraRef} facing={facing} />

      <View style={styles.buttons}>
        <Button title="Flip Camera" onPress={() => setFacing(facing === 'back' ? 'front' : 'back')} />
        <Button title="Take Photo" onPress={takePhoto} />
      </View>

      <FlatList
        data={photos}
        horizontal
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.photoContainer}>
            <Image source={{ uri: item }} style={styles.thumbnail} />
            <TouchableOpacity style={styles.removeButton} onPress={() => removePhoto(index)}>
              <Text style={{ color: '#fff' }}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button
        title="Save & Map Photos"
        onPress={handleSave} // ✅ updated
        disabled={photos.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', textAlign: 'center' },
  header: { fontSize: 20, color: '#fff', marginBottom: 10, textAlign: 'center' },
  camera: { width: '100%', height: 300, marginBottom: 10 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  photoContainer: { marginRight: 10, position: 'relative' },
  thumbnail: { width: 80, height: 80, borderRadius: 8 },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
