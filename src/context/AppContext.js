import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { translations } from "../data/translations";

const SETTINGS_KEY = "hotspot_settings_v1";
const LOCAL_DATA_KEY = "hotspot_local_data_v1";
const HOTSPOT_CACHE_KEY = "hotspot_cache_v1";

const defaultSettings = {
    theme: "light",
    layout: "cards",
    language: "nl",
};

const palettes = {
    light: {
        background: "#F7F4EE",
        surface: "#FFFFFF",
        surfaceMuted: "#ECE5DA",
        text: "#1F2933",
        muted: "#667085",
        primary: "#166A5B",
        primaryText: "#FFFFFF",
        border: "#D9D1C3",
        danger: "#A83232",
        warning: "#A15C00",
        mapPin: "#C2410C",
    },
    dark: {
        background: "#121416",
        surface: "#1E2328",
        surfaceMuted: "#2B3137",
        text: "#F4F0E8",
        muted: "#BAC2CC",
        primary: "#63C7B2",
        primaryText: "#0C1715",
        border: "#3A424B",
        danger: "#FF8B8B",
        warning: "#F6B95B",
        mapPin: "#FF7849",
    },
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [ready, setReady] = useState(false);
    const [settings, setSettings] = useState(defaultSettings);
    const [localData, setLocalDataState] = useState({});
    const [cachedHotspots, setCachedHotspotsState] = useState([]);

    useEffect(() => {
        async function loadStoredData() {
            try {
                const [storedSettings, storedLocalData, storedHotspots] = await Promise.all([
                    AsyncStorage.getItem(SETTINGS_KEY),
                    AsyncStorage.getItem(LOCAL_DATA_KEY),
                    AsyncStorage.getItem(HOTSPOT_CACHE_KEY),
                ]);

                if (storedSettings) {
                    setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
                }
                if (storedLocalData) {
                    setLocalDataState(JSON.parse(storedLocalData));
                }
                if (storedHotspots) {
                    setCachedHotspotsState(JSON.parse(storedHotspots));
                }
            } catch (error) {
                console.log("Storage load failed", error);
            } finally {
                setReady(true);
            }
        }

        loadStoredData();
    }, []);

    const colors = palettes[settings.theme] || palettes.light;

    const t = (key) => {
        const dictionary = translations[settings.language] || translations.nl;
        return dictionary[key] || translations.nl[key] || key;
    };

    const updateSettings = async (patch) => {
        const nextSettings = { ...settings, ...patch };
        setSettings(nextSettings);
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
    };

    const saveLocalData = async (hotspotId, patch) => {
        const current = localData[hotspotId] || {};
        const nextData = {
            ...localData,
            [hotspotId]: {
                ...current,
                ...patch,
                updatedAt: new Date().toISOString(),
            },
        };
        setLocalDataState(nextData);
        await AsyncStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(nextData));
    };

    const deleteLocalData = async (hotspotId) => {
        const nextData = { ...localData };
        delete nextData[hotspotId];
        setLocalDataState(nextData);
        await AsyncStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(nextData));
    };

    const toggleFavorite = async (hotspotId) => {
        await saveLocalData(hotspotId, { favorite: !localData[hotspotId]?.favorite });
    };

    const saveHotspotCache = async (hotspots) => {
        setCachedHotspotsState(hotspots);
        await AsyncStorage.setItem(HOTSPOT_CACHE_KEY, JSON.stringify(hotspots));
    };

    const value = useMemo(
        () => ({
            ready,
            settings,
            colors,
            localData,
            cachedHotspots,
            t,
            updateSettings,
            saveLocalData,
            deleteLocalData,
            toggleFavorite,
            saveHotspotCache,
        }),
        [ready, settings, colors, localData, cachedHotspots]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used inside AppProvider");
    }
    return context;
}
