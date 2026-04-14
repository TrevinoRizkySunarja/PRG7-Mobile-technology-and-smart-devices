import {View, Text, FlatList, ActivityIndicator, Pressable, Button, StyleSheet} from "react-native";
import { useEffect, useState } from "react";

const BASE_URL = "https://notes-api.deno.dev";

function CreateScreen(loading, notes, navigation) {
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Button
                title="Nieuwe note"
                onPress={() => navigation.navigate("NoteDetail", { mode: "create" })}
            />

            <FlatList
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                style={{ marginTop: 20 }}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.item}
                        onPress={() =>
                            navigation.navigate("NoteDetail", {
                                mode: "edit",
                                id: item.id,
                            })
                        }
                    >
                        <Text style={styles.title}>{item.title}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

export default function NotesListScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);

    const loadNotes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/notes`);
            const json = await res.json();
            setNotes(json);
        } catch (err) {
            console.log("Error loading notes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadNotes);
        return unsubscribe;
    }, [navigation]);

    return CreateScreen(loading, notes, navigation);
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    item: {
        padding: 20,
        backgroundColor: "#eee",
        marginBottom: 10,
        borderRadius: 8,
    },
    title: { fontSize: 18 },
});