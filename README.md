# Structural Assessment App

A React Native / Expo app for surveying and mapping building structures, capturing photos, and recording hazards. Designed for field data collection with GPS integration.

---

## Features

- **Building Details Capture:** Input building name, surveyor, structural typology, occupancy type, floors, material, and footprint.
- **Location Integration:** Automatically fetch GPS coordinates and address of the building.
- **Photo Capture:** Take multiple photos of the building and map their locations.
- **Hazard Mapping:** Mark hazards like cracks, leaks, fire risks, electrical issues, and blocked exits on the building map.
- **Flow:** Location → Building Details → Photo Capture → Map Photos → Hazard Mapping → Summary.

---

## Screens / Flow

1. **Location Info** – Fetch device GPS and address.  
2. **Building Details** – Fill in building info and characteristics.  
3. **Photo Capture** – Take up to 10 photos of the building.  
4. **Building Map** – Place each photo on a satellite map.  
5. **Hazard Mapping** – Mark hazards with icons and save.  
6. **Summary** – Review all collected data (optional).

---

## Requirements

- Node.js ≥ 18.x  
- npm ≥ 9.x or yarn ≥ 1.x  
- Expo CLI:  
```bash
npm install -g expo-cli
```
# Setup & Run

## 1. Clone the repo
```bash
git clone https://github.com/rashimenon/StructuralAssessmentApp.git
cd StructuralAssessmentApp
```

## 2. Install dependencies
```bash
npm install
# or
yarn install
```

## 3. Start Expo
```bash
npx expo start
```

## 4. Run on device
- Scan the QR code using Expo Go (iOS / Android)
- Or run on emulator:
```bash
npx expo run:android
npx expo run:ios
```

## Project Structure
app/
 ├─ location-info.tsx
 ├─ building-details.tsx
 ├─ photo-capture.js
 ├─ building-map.js
 ├─ hazard-map.js
 ├─ _layout.tsx
assets/
 ├─ images/
 ├─ structural/
 ├─ materials/
lib/
 ├─ localStorage.js
