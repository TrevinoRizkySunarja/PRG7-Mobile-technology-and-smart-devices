import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";

import AppButton from "./components/AppButton";
import ThemedScreen from "./components/ThemedScreen";
import { useApp } from "./context/AppContext";
import { fallbackHotspots } from "./data/fallbackHotspots";
import { formatDistance, getDistanceInMeters } from "./services/hotspotService";

const rotterdamRegion = {
    latitude: 51.9175,
    longitude: 4.4841,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
};

function toRegion(hotspot) {
    if (!hotspot) {
        return rotterdamRegion;
    }

    return {
        latitude: hotspot.latitude,
        longitude: hotspot.longitude,
        latitudeDelta: 0.018,
        longitudeDelta: 0.018,
    };
}

export default function MapScreen({ route, navigation }) {
    const { colors, cachedHotspots, t } = useApp();
    const mapRef = useRef(null);
    const selectedHotspot = route.params?.hotspot || null;
    const hotspots = route.params?.hotspots?.length ? route.params.hotspots : cachedHotspots.length ? cachedHotspots : fallbackHotspots;
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState("");

    useEffect(() => {
        async function loadLocation() {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setLocationError(t("locationDenied"));
                return;
            }

            const current = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: current.coords.latitude,
                longitude: current.coords.longitude,
            });
        }

        loadLocation();
    }, []);

    useEffect(() => {
        if (selectedHotspot && mapRef.current) {
            mapRef.current.animateToRegion(toRegion(selectedHotspot), 650);
        }
    }, [selectedHotspot]);

    const distance = useMemo(() => {
        if (!selectedHotspot || !userLocation) {
            return "";
        }
        return formatDistance(getDistanceInMeters(userLocation, selectedHotspot));
    }, [selectedHotspot, userLocation]);

    const styles = StyleSheet.create({
        screen: {
            flex: 1,
        },
        map: {
            flex: 1,
        },
        panel: {
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8,
            padding: 14,
            gap: 8,
        },
        title: {
            color: colors.text,
            fontSize: 18,
            fontWeight: "900",
        },
        text: {
            color: colors.muted,
            lineHeight: 20,
        },
        row: {
            flexDirection: "row",
            gap: 8,
        },
        action: {
            flex: 1,
        },
        webFallback: {
            flex: 1,
            justifyContent: "center",
            padding: 18,
        },
    });

    if (Platform.OS === "web") {
        return (
            <ThemedScreen>
                <View style={styles.webFallback}>
                    <Text style={styles.title}>{t("mapTitle")}</Text>
                    <Text style={styles.text}>
                        react-native-maps werkt in dit project op device of emulator. Gebruik Expo Go voor de screencast.
                    </Text>
                </View>
            </ThemedScreen>
        );
    }

    return (
        <View style={styles.screen}>
            <MapView ref={mapRef} style={styles.map} initialRegion={toRegion(selectedHotspot)} showsUserLocation>
                {hotspots.map((hotspot) => (
                    <Marker
                        key={hotspot.id}
                        coordinate={{ latitude: hotspot.latitude, longitude: hotspot.longitude }}
                        title={hotspot.name}
                        description={hotspot.category}
                        pinColor={selectedHotspot?.id === hotspot.id ? colors.mapPin : colors.primary}
                        onCalloutPress={() => navigation.navigate("Detail", { hotspot })}
                    />
                ))}

                {userLocation && (
                    <Marker coordinate={userLocation} title={t("userLocation")} pinColor="#276EF1" />
                )}

                {userLocation && selectedHotspot && (
                    <Polyline
                        coordinates={[
                            userLocation,
                            { latitude: selectedHotspot.latitude, longitude: selectedHotspot.longitude },
                        ]}
                        strokeColor={colors.primary}
                        strokeWidth={4}
                    />
                )}
            </MapView>

            <View style={styles.panel}>
                <Text style={styles.title}>{selectedHotspot ? selectedHotspot.name : t("allHotspots")}</Text>
                {!!selectedHotspot && !!distance && <Text style={styles.text}>{`${t("distance")}: ${distance}`}</Text>}
                {!!selectedHotspot && <Text style={styles.text}>{t("routeHint")}</Text>}
                {!!locationError && <Text style={styles.text}>{locationError}</Text>}
                {!!selectedHotspot && (
                    <View style={styles.row}>
                        <View style={styles.action}>
                            <AppButton title={t("editLocal")} onPress={() => navigation.navigate("Detail", { hotspot: selectedHotspot })} />
                        </View>
                        <View style={styles.action}>
                            <AppButton title={t("allHotspots")} onPress={() => navigation.navigate("Home")} variant="secondary" />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
