import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import SegmentedControl from "./components/SegmentedControl";
import ThemedScreen from "./components/ThemedScreen";
import { useApp } from "./context/AppContext";

export default function SettingsScreen() {
    const { colors, settings, updateSettings, t } = useApp();

    const styles = StyleSheet.create({
        content: {
            gap: 14,
            paddingBottom: 30,
        },
        card: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            gap: 12,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
        },
        title: {
            color: colors.text,
            fontSize: 22,
            fontWeight: "900",
        },
        label: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "800",
        },
        text: {
            color: colors.muted,
            lineHeight: 21,
        },
    });

    return (
        <ThemedScreen>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.title}>{t("settingsTitle")}</Text>
                    <Text style={styles.text}>{t("sourceDescription")}</Text>
                    <Text style={styles.text}>{t("backgroundActive")}</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>{t("settingsTheme")}</Text>
                        <Switch
                            value={settings.theme === "dark"}
                            onValueChange={(enabled) => updateSettings({ theme: enabled ? "dark" : "light" })}
                        />
                    </View>
                    <SegmentedControl
                        value={settings.theme}
                        onChange={(theme) => updateSettings({ theme })}
                        options={[
                            { value: "light", label: t("light") },
                            { value: "dark", label: t("dark") },
                        ]}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>{t("settingsLayout")}</Text>
                    <SegmentedControl
                        value={settings.layout}
                        onChange={(layout) => updateSettings({ layout })}
                        options={[
                            { value: "cards", label: t("cards") },
                            { value: "compact", label: t("compact") },
                        ]}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>{t("settingsLanguage")}</Text>
                    <SegmentedControl
                        value={settings.language}
                        onChange={(language) => updateSettings({ language })}
                        options={[
                            { value: "nl", label: t("dutch") },
                            { value: "en", label: t("english") },
                            { value: "es", label: t("spanish") },
                        ]}
                    />
                </View>
            </ScrollView>
        </ThemedScreen>
    );
}
