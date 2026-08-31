import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useApp } from "../context/AppContext";
import AppButton from "./AppButton";

export default function HotspotCard({ hotspot, onOpenMap, onOpenDetail }) {
    const { colors, localData, settings, t } = useApp();
    const stored = localData[hotspot.id] || {};
    const compact = settings.layout === "compact";

    const styles = StyleSheet.create({
        card: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8,
            padding: compact ? 12 : 16,
            marginBottom: compact ? 8 : 12,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
        },
        title: {
            flex: 1,
            color: colors.text,
            fontSize: compact ? 16 : 19,
            fontWeight: "800",
        },
        category: {
            color: colors.primary,
            fontWeight: "700",
            marginTop: 4,
        },
        description: {
            color: colors.muted,
            marginTop: compact ? 6 : 10,
            lineHeight: 20,
        },
        meta: {
            color: colors.text,
            marginTop: 8,
            fontWeight: "600",
        },
        actions: {
            flexDirection: "row",
            gap: 8,
            marginTop: 12,
        },
        action: {
            flex: 1,
        },
        favorite: {
            color: stored.favorite ? colors.warning : colors.muted,
            fontSize: 13,
            fontWeight: "900",
        },
        photo: {
            width: "100%",
            aspectRatio: 16 / 9,
            borderRadius: 8,
            marginTop: 10,
            backgroundColor: colors.surfaceMuted,
        },
    });

    return (
        <Pressable style={styles.card} onPress={onOpenMap}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{hotspot.name}</Text>
                    <Text style={styles.category}>{hotspot.category}</Text>
                </View>
                <Text style={styles.favorite}>{stored.favorite ? "FAV" : ""}</Text>
            </View>
            {!!stored.photoUri && !compact && <Image source={{ uri: stored.photoUri }} style={styles.photo} resizeMode="cover" />}
            {!compact && <Text style={styles.description}>{hotspot.description}</Text>}
            <Text style={styles.meta}>
                {t("note")}: {stored.note ? stored.note : t("noNote")}
            </Text>
            {!!stored.rating && <Text style={styles.meta}>{`${t("rating")}: ${stored.rating}/5`}</Text>}
            <View style={styles.actions}>
                <View style={styles.action}>
                    <AppButton title={t("showMap")} onPress={onOpenMap} />
                </View>
                <View style={styles.action}>
                    <AppButton title={t("editLocal")} onPress={onOpenDetail} variant="secondary" />
                </View>
            </View>
        </Pressable>
    );
}
