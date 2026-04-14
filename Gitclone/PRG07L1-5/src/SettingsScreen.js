import { View, Text, TextInput, Button, StyleSheet, Switch, KeyboardAvoidingView, Platform} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "./context/ThemeContext";

function CreateScreen(
    name,
    setName,
    age,
    setAge,
    darkMode,
    toggleTheme,
    saveSettings
) {
    const styles = getStyles(darkMode);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={styles.label}>Naam</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Naam"
                placeholderTextColor={darkMode ? "#888" : "#666"}
            />

            <Text style={styles.label}>Leeftijd</Text>
            <Picker
                selectedValue={age}
                onValueChange={(v) => setAge(v)}
                style={styles.picker}
            >
                {[...Array(101).keys()].map((n) => (
                    <Picker.Item key={n} label={String(n)} value={String(n)} />
                ))}
            </Picker>

            <View style={styles.row}>
                <Text style={styles.label}>Dark Mode</Text>
                <Switch value={darkMode} onValueChange={toggleTheme} />
            </View>

            <Button title="Opslaan" onPress={saveSettings} />
        </KeyboardAvoidingView>
    );
}

export default function SettingsScreen({ navigation }) {
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    const [name, setName] = useState("");
    const [age, setAge] = useState("0");

    // Load saved settings
    useEffect(() => {
        const load = async () => {
            try {
                const savedName = await AsyncStorage.getItem("name");
                const savedAge = await AsyncStorage.getItem("age");
                if (savedName) setName(savedName);
                if (savedAge) setAge(savedAge);
            } catch (err) {
                console.log("Error loading settings:", err);
            }
        };
        load();
    }, []);

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem("name", name);
            await AsyncStorage.setItem("age", age);

            navigation.popTo("Home",{name,age});
        } catch (err) {
            console.log("Error saving settings:", err);
        }
    };

    return CreateScreen(
        name,
        setName,
        age,
        setAge,
        darkMode,
        toggleTheme,
        saveSettings
    );
}

const getStyles = (dark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: dark ? "#111" : "#fff",
        },
        label: {
            fontSize: 18,
            color: dark ? "#fff" : "#000",
            marginBottom: 5,
        },
        input: {
            backgroundColor: dark ? "#222" : "#eee",
            padding: 10,
            borderRadius: 8,
            marginBottom: 20,
            color: dark ? "#fff" : "#000",
        },
        picker: {
            backgroundColor: dark ? "#222" : "#eee",
            marginBottom: 20,
        },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
        },
    });