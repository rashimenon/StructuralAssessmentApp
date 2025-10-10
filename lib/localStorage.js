// lib/localStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`✅ Saved ${key} locally`);
  } catch (e) {
    console.error("Error saving data:", e);
  }
};

export const loadData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error loading data:", e);
    return null;
  }
};

export const clearData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`🗑 Cleared ${key}`);
  } catch (e) {
    console.error("Error clearing data:", e);
  }
};
