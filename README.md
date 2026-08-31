# Rotterdam Hotspots

React Native and Expo mobile app for discovering restaurant hotspots in Rotterdam. The app focuses on mobile interaction patterns such as navigation, maps, local preferences, offline fallback data, saved notes, photos, and device features like location and biometric authentication.

## Features

- Browse restaurant hotspots in Rotterdam
- View hotspots on an interactive map
- Save local notes, ratings, visited state, and favourites
- Switch between light and dark themes
- Change layout and language preferences
- Add or replace local photos for hotspots
- Use cached or fallback data when online data is unavailable
- Register background proximity notifications on supported devices

## Tech Stack

- React Native
- Expo
- React Navigation
- AsyncStorage
- Expo Location
- Expo Notifications
- Expo Local Authentication
- React Native Maps

## Getting Started

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Run on web:

```bash
npm run web
```

## Project Structure

```text
assets/             App icons and splash assets
src/components/     Reusable UI components
src/context/        App state, preferences and local storage
src/data/           Fallback data and translations
src/services/       Hotspot API and background proximity logic
App.js              Main navigation and app setup
```

## Notes

Some native features, such as biometrics, maps, background location, and notifications, work best on a real device through Expo Go or a native development build.
