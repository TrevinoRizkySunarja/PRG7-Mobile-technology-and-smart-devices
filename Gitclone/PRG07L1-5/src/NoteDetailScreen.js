import {View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Alert,} from "react-native";
import { useEffect, useState } from "react";

const BASE_URL = "https://notes-api.deno.dev";

function CreateScreen(
    mode,
    loading,
    title,
    setTitle,
    body,
    setBody,
    onSave,
    onDelete
) {
    if (loading && mode !== "create") {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Titel</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Titel"
                />

                <Text style={styles.label}>Inhoud</Text>
                <TextInput
                    style={[styles.input, styles.textarea]}
                    value={body}
                    onChangeText={setBody}
                    placeholder="Inhoud"
                    multiline
                />

                <Button
                    title={mode === "create" ? "Aanmaken" : "Opslaan"}
                    onPress={onSave}
                />

                {mode === "edit" && (
                    <View style={{ marginTop: 10 }}>
                        <Button title="Verwijderen" color="red" onPress={onDelete} />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default function NoteDetailScreen({ route, navigation }) {
    const { mode, id } = route.params || { mode: "create" };

    const [loading, setLoading] = useState(mode !== "create");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const loadNote = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/notes/${id}`);
            const json = await res.json();
            setTitle(json.title || "");
            setBody(json.body || "");
        } catch (err) {
            console.log("Error loading note:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mode !== "create") {
            loadNote();
        }
    }, []);

    const onSave = async () => {
        try {
            if (!title.trim()) {
                Alert.alert("Fout", "Titel mag niet leeg zijn.");
                return;
            }

            if (mode === "create") {
                await fetch(`${BASE_URL}/notes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, body }),
                });
            } else {
                await fetch(`${BASE_URL}/notes/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, body }),
                });
            }

            navigation.popToTop(); // <<<<<< EXACT WAT JE WIL
        } catch (err) {
            console.log("Error saving note:", err);
        }
    };

    const onDelete = async () => {
        try {
            await fetch(`${BASE_URL}/notes/${id}`, {
                method: "DELETE",
            });
            navigation.popTo("notes");
        } catch (err) {
            console.log("Error deleting note:", err);
        }
    };

    return CreateScreen(
        mode,
        loading,
        title,
        setTitle,
        body,
        setBody,
        onSave,
        onDelete
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#eee",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    textarea: {
        height: 120,
        textAlignVertical: "top",
    },
});