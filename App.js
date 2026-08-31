import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

import { AppProvider, useApp } from "./src/context/AppContext";
import AppButton from "./src/components/AppButton";
import HomeScreen from "./src/HomeScreen";
import SettingsScreen from "./src/SettingsScreen";
import HotspotDetailScreen from "./src/HotspotDetailScreen";
import MapScreen from "./src/MapScreen";
import { registerBackgroundProximity } from "./src/services/backgroundProximity";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BiometricGate({ children }) {
    const { colors, t } = useApp();
    const [checking, setChecking] = useState(true);
    const [unlocked, setUnlocked] = useState(Platform.OS === "web");
    const [message, setMessage] = useState("");

    const authenticate = async () => {
        setChecking(true);
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                setMessage(t("biometricUnavailable"));
                setUnlocked(true);
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: t("biometricPrompt"),
                fallbackLabel: t("biometricFallback"),
                cancelLabel: t("cancel"),
            });

            setUnlocked(result.success);
            setMessage(result.success ? "" : t("biometricFailed"));
        } catch (error) {
            console.log("Biometric authentication failed", error);
            setMessage(t("biometricUnavailable"));
            setUnlocked(true);
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        authenticate();
    }, []);

    useEffect(() => {
        if (!checking && unlocked) {
            registerBackgroundProximity().catch((error) => {
                console.log("Background proximity registration failed", error);
            });
        }
    }, [checking, unlocked]);

    const styles = StyleSheet.create({
        lockScreen: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: 22,
            backgroundColor: colors.background,
        },
        title: {
            color: colors.text,
            fontSize: 24,
            fontWeight: "900",
            textAlign: "center",
        },
        text: {
            color: colors.muted,
            lineHeight: 21,
            textAlign: "center",
        },
    });

    if (checking) {
        return (
            <View style={styles.lockScreen}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.text}>{t("biometricChecking")}</Text>
            </View>
        );
    }

    if (!unlocked) {
        return (
            <View style={styles.lockScreen}>
                <Text style={styles.title}>{t("biometricTitle")}</Text>
                <Text style={styles.text}>{message || t("biometricFailed")}</Text>
                <AppButton title={t("biometricRetry")} onPress={authenticate} />
            </View>
        );
    }

    return children;
}

function MainTabs() {
    const { colors, t } = useApp();

    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: t("tabHome") }} />
            <Tab.Screen name="Map" component={MapScreen} options={{ title: t("tabMap") }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t("tabSettings") }} />
        </Tab.Navigator>
    );
}

function AppNavigator() {
    const { settings, ready, colors, t } = useApp();

    if (!ready) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const navigationTheme = {
        ...(settings.theme === "dark" ? DarkTheme : DefaultTheme),
        colors: {
            ...(settings.theme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            primary: colors.primary,
            border: colors.border,
        },
    };

    return (
        <BiometricGate>
            <NavigationContainer theme={navigationTheme}>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: { backgroundColor: colors.surface },
                        headerTintColor: colors.text,
                        contentStyle: { backgroundColor: colors.background },
                    }}
                >
                    <Stack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="Detail" component={HotspotDetailScreen} options={{ title: t("detailTitle") }} />
                </Stack.Navigator>
            </NavigationContainer>
        </BiometricGate>
    );
}

export default function App() {
    return (
        <AppProvider>
            <AppNavigator />
        </AppProvider>
    );
}
