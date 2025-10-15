import { Audio } from "expo-av";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VoiceRecordScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    setRecording(null);
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    setUri(uri || null);
    console.log("Recording saved at", uri);
  };

  const playSound = async () => {
    if (!uri) return;
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    await sound.playAsync();
  };

  // ✅ Navigate to summary
  const goToSummary = () => {
    router.push("/summary");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎤 Voice Recorder</Text>

      <TouchableOpacity
        style={[styles.button, recording && styles.stopButton]}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? "⏹ Stop Recording" : "🎙 Start Recording"}
        </Text>
      </TouchableOpacity>

      {uri && (
        <TouchableOpacity style={styles.playButton} onPress={playSound}>
          <Text style={styles.buttonText}>▶️ Play Recording</Text>
        </TouchableOpacity>
      )}

      {uri && (
        <TouchableOpacity style={styles.nextButton} onPress={goToSummary}>
          <Text style={styles.buttonText}>✅ Continue</Text>
        </TouchableOpacity>
      )}

      
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#00ffcc",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "#ff4d4d",
  },
  playButton: {
    backgroundColor: "#ffaa00",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  homeButton: {
    marginTop: 30,
  },
  homeText: {
    color: "#999",
    fontSize: 14,
  },
});
