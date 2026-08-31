import { Alert, Image, ScrollView, Share, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useMemo, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

import AppButton from "./components/AppButton";
import SegmentedControl from "./components/SegmentedControl";
import ThemedScreen from "./components/ThemedScreen";
import { useApp } from "./context/AppContext";

export default function HotspotDetailScreen({ route, navigation }) {
    const hotspot = route.params?.hotspot;
    const { colors, localData, saveLocalData, deleteLocalData, toggleFavorite, t } = useApp();
    const stored = localData[hotspot?.id] || {};
    const [note, setNote] = useState(stored.note || "");
    const [rating, setRating] = useState(String(stored.rating || "3"));
    const [visited, setVisited] = useState(Boolean(stored.visited));
    const [photoUri, setPhotoUri] = useState(stored.photoUri || "");

    const shareText = useMemo(() => {
        if (!hotspot) {
            return "";
        }

        return [
            `${hotspot.name}`,
            `${hotspot.category}`,
            hotspot.description,
            `${t("note")}: ${note || t("noNote")}`,
            `${t("rating")}: ${rating}/5`,
            `${t("visited")}: ${visited ? "ja" : "nee"}`,
            `${t("photo")}: ${photoUri || "-"}`,
            `https://www.google.com/maps/search/?api=1&query=${hotspot.latitude},${hotspot.longitude}`,
        ].join("\n");
    }, [hotspot, note, rating, visited, photoUri, t]);

    const styles = StyleSheet.create({
        container: {
            paddingBottom: 28,
            gap: 14,
        },
        card: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            gap: 10,
        },
        title: {
            color: colors.text,
            fontSize: 26,
            fontWeight: "900",
        },
        category: {
            color: colors.primary,
            fontWeight: "800",
        },
        text: {
            color: colors.muted,
            lineHeight: 21,
        },
        label: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "800",
        },
        input: {
            minHeight: 118,
            borderRadius: 8,
            borderColor: colors.border,
            borderWidth: 1,
            backgroundColor: colors.surfaceMuted,
            color: colors.text,
            padding: 12,
            textAlignVertical: "top",
            fontSize: 16,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
        },
        actions: {
            gap: 10,
        },
        photo: {
            width: "100%",
            aspectRatio: 4 / 3,
            borderRadius: 8,
            backgroundColor: colors.surfaceMuted,
        },
        photoActions: {
            flexDirection: "row",
            gap: 8,
        },
        photoAction: {
            flex: 1,
        },
    });

    if (!hotspot) {
        return (
            <ThemedScreen>
                <Text style={styles.text}>Geen hotspot geselecteerd.</Text>
            </ThemedScreen>
        );
    }

    const save = async () => {
        await saveLocalData(hotspot.id, {
            note: note.trim(),
            rating: Number(rating),
            visited,
            favorite: stored.favorite || false,
            photoUri,
        });
        Alert.alert(t("saved"));
    };

    const deleteStoredPhotoFile = async (uri) => {
        if (!uri || !uri.startsWith(FileSystem.documentDirectory)) {
            return;
        }

        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
            await FileSystem.deleteAsync(uri, { idempotent: true });
        }
    };

    const pickPhoto = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(t("photoPermission"));
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (result.canceled || !result.assets?.[0]?.uri) {
            return;
        }

        const directory = `${FileSystem.documentDirectory}hotspot-photos/`;
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

        const originalUri = result.assets[0].uri;
        const cleanUri = originalUri.split("?")[0];
        const extension = cleanUri.includes(".") ? cleanUri.split(".").pop() : "jpg";
        const destination = `${directory}${hotspot.id}-${Date.now()}.${extension}`;

        await FileSystem.copyAsync({ from: originalUri, to: destination });
        await deleteStoredPhotoFile(photoUri);
        setPhotoUri(destination);
        await saveLocalData(hotspot.id, { photoUri: destination });
    };

    const removePhoto = async () => {
        await deleteStoredPhotoFile(photoUri);
        setPhotoUri("");
        await saveLocalData(hotspot.id, { photoUri: "" });
    };

    const remove = () => {
        Alert.alert(t("delete"), t("confirmDelete"), [
            { text: t("cancel"), style: "cancel" },
            {
                text: t("delete"),
                style: "destructive",
                onPress: async () => {
                    await deleteStoredPhotoFile(photoUri);
                    await deleteLocalData(hotspot.id);
                    Alert.alert(t("deleted"));
                    navigation.goBack();
                },
            },
        ]);
    };

    const share = async () => {
        await Share.share({ title: hotspot.name, message: shareText });
    };

    return (
        <ThemedScreen>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>{hotspot.name}</Text>
                    <Text style={styles.category}>{hotspot.category}</Text>
                    <Text style={styles.text}>{hotspot.description}</Text>
                    <Text style={styles.text}>{hotspot.source}</Text>
                    <AppButton title={t("showMap")} onPress={() => navigation.navigate("Tabs", { screen: "Map", params: { hotspot } })} />
                </View>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>{t("favorite")}</Text>
                        <Switch value={Boolean(stored.favorite)} onValueChange={() => toggleFavorite(hotspot.id)} />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>{t("visited")}</Text>
                        <Switch value={visited} onValueChange={setVisited} />
                    </View>
                    <Text style={styles.label}>{t("rating")}</Text>
                    <SegmentedControl
                        value={rating}
                        onChange={setRating}
                        options={["1", "2", "3", "4", "5"].map((value) => ({ value, label: value }))}
                    />
                    <Text style={styles.label}>{t("note")}</Text>
                    <TextInput
                        style={styles.input}
                        value={note}
                        onChangeText={setNote}
                        placeholder={t("notePlaceholder")}
                        placeholderTextColor={colors.muted}
                        multiline
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>{t("photo")}</Text>
                    {!!photoUri && <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />}
                    <View style={styles.photoActions}>
                        <View style={styles.photoAction}>
                            <AppButton title={photoUri ? t("replacePhoto") : t("addPhoto")} onPress={pickPhoto} />
                        </View>
                        {!!photoUri && (
                            <View style={styles.photoAction}>
                                <AppButton title={t("removePhoto")} onPress={removePhoto} variant="secondary" />
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.actions}>
                    <AppButton title={t("save")} onPress={save} />
                    <AppButton title={t("share")} onPress={share} variant="secondary" />
                    <AppButton title={t("delete")} onPress={remove} variant="danger" />
                </View>
            </ScrollView>
        </ThemedScreen>
    );
}
