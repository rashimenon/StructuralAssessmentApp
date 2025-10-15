import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SummaryScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.ibb.co/W6Fv3kM/success-icon.png" }}
        style={styles.image}
      />
      <Text style={styles.title}>✅ Data Saved Locally</Text>
      <Text style={styles.subtitle}>
        Your field data has been securely stored on this device.{"\n"}
        It will automatically sync to the cloud once you’re back online.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/")}
      >
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
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    color: "#00ffcc",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#cfcfcf",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
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
