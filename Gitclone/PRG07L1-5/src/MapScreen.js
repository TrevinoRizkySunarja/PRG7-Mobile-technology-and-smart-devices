import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

function CreateScreen(schoolLocation, userLocation) {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={schoolLocation}
            >
                <Marker coordinate={schoolLocation} />

                {userLocation && (
                    <Marker coordinate={userLocation} pinColor="blue" />
                )}
            </MapView>
        </View>
    );
}

export default function MapScreen() {
    const [userLocation, setUserLocation] = useState(null);

    const schoolLocation = {
        latitude: 51.917492,
        longitude: 4.484091,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            let loc = await Location.getCurrentPositionAsync({});
            setUserLocation(loc.coords);
        };

        getLocation();
    }, []);

    return CreateScreen(schoolLocation, userLocation);
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: "100%", height: "100%" },
});