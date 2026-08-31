import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";

import AppButton from "./components/AppButton";
import HotspotCard from "./components/HotspotCard";
import ThemedScreen from "./components/ThemedScreen";
import { useApp } from "./context/AppContext";
import { loadHotspots } from "./services/hotspotService";

export default function HomeScreen({ navigation }) {
    const { colors, cachedHotspots, saveHotspotCache, t } = useApp();
    const [hotspots, setHotspots] = useState([]);
    const [source, setSource] = useState("online");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        const result = await loadHotspots(cachedHotspots);
        setHotspots(result.hotspots);
        setSource(result.source);
        if (result.source === "online") {
            await saveHotspotCache(result.hotspots);
        }
    }, [cachedHotspots, saveHotspotCache]);

    useEffect(() => {
        async function initialLoad() {
            setLoading(true);
            await load();
            setLoading(false);
        }

        initialLoad();
    }, []);

    const refresh = async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    };

    const sourceLabel = source === "online" ? t("onlineData") : source === "cache" ? t("cachedData") : t("fallbackData");

    const styles = StyleSheet.create({
        header: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            marginBottom: 14,
        },
        title: {
            color: colors.text,
            fontSize: 26,
            fontWeight: "900",
        },
        intro: {
            color: colors.muted,
            lineHeight: 21,
            marginTop: 8,
        },
        source: {
            color: source === "online" ? colors.primary : colors.warning,
            fontWeight: "800",
            marginTop: 10,
        },
        actions: {
            flexDirection: "row",
            gap: 8,
            marginTop: 12,
        },
        action: {
            flex: 1,
        },
        center: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        loadingText: {
            color: colors.text,
            marginTop: 12,
        },
    });

    if (loading) {
        return (
            <ThemedScreen>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>{t("onlineData")}...</Text>
                </View>
            </ThemedScreen>
        );
    }

    return (
        <ThemedScreen>
            <FlatList
                data={hotspots}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.title}>{t("appTitle")}</Text>
                        <Text style={styles.intro}>{t("listIntro")}</Text>
                        <Text style={styles.source}>{sourceLabel}</Text>
                        <Text style={styles.intro}>{t("sourceDescription")}</Text>
                        <View style={styles.actions}>
                            <View style={styles.action}>
                                <AppButton title={t("allHotspots")} onPress={() => navigation.navigate("Map", { hotspots })} />
                            </View>
                            <View style={styles.action}>
                                <AppButton title={t("openSettings")} onPress={() => navigation.navigate("Settings")} variant="secondary" />
                            </View>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <HotspotCard
                        hotspot={item}
                        onOpenMap={() => navigation.navigate("Map", { hotspot: item, hotspots })}
                        onOpenDetail={() => navigation.navigate("Detail", { hotspot: item })}
                    />
                )}
            />
        </ThemedScreen>
    );
}
