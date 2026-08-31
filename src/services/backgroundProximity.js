import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as TaskManager from "expo-task-manager";

import { fallbackHotspots } from "../data/fallbackHotspots";
import { getDistanceInMeters } from "./hotspotService";

export const PROXIMITY_TASK = "restaurant-proximity-task";
const LAST_NOTIFICATION_KEY = "restaurant_last_background_notification_v1";
const PROXIMITY_RADIUS_METERS = 250;
const NOTIFICATION_COOLDOWN_MS = 20 * 60 * 1000;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

TaskManager.defineTask(PROXIMITY_TASK, async ({ data, error }) => {
    if (error || !data?.locations?.length) {
        return;
    }

    const location = data.locations[0].coords;
    const userLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
    };

    const nearby = fallbackHotspots
        .map((hotspot) => ({
            hotspot,
            distance: getDistanceInMeters(userLocation, hotspot),
        }))
        .filter((item) => item.distance <= PROXIMITY_RADIUS_METERS)
        .sort((a, b) => a.distance - b.distance)[0];

    if (!nearby) {
        return;
    }

    const previous = JSON.parse((await AsyncStorage.getItem(LAST_NOTIFICATION_KEY)) || "{}");
    const now = Date.now();
    if (previous.id === nearby.hotspot.id && now - previous.time < NOTIFICATION_COOLDOWN_MS) {
        return;
    }

    await AsyncStorage.setItem(
        LAST_NOTIFICATION_KEY,
        JSON.stringify({ id: nearby.hotspot.id, time: now })
    );

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Restaurant dichtbij",
            body: `Je bent in de buurt van ${nearby.hotspot.name}. Open de app voor de route.`,
        },
        trigger: null,
    });
});

export async function registerBackgroundProximity() {
    if (Platform.OS === "web") {
        return "web-not-supported";
    }

    const notificationPermission = await Notifications.requestPermissionsAsync();
    if (!notificationPermission.granted) {
        return "notifications-denied";
    }

    const foregroundPermission = await Location.requestForegroundPermissionsAsync();
    if (foregroundPermission.status !== "granted") {
        return "foreground-location-denied";
    }

    const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
    if (backgroundPermission.status !== "granted") {
        return "background-location-denied";
    }

    const alreadyStarted = await Location.hasStartedLocationUpdatesAsync(PROXIMITY_TASK);
    if (alreadyStarted) {
        return "already-running";
    }

    await Location.startLocationUpdatesAsync(PROXIMITY_TASK, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 100,
        deferredUpdatesInterval: 60000,
        foregroundService: {
            notificationTitle: "Rotterdam Hotspots actief",
            notificationBody: "De app controleert of je dichtbij een restaurant-hotspot bent.",
            notificationColor: "#166A5B",
        },
        pausesUpdatesAutomatically: true,
        showsBackgroundLocationIndicator: true,
    });

    return "started";
}
