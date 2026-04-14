import { View, Text, Button, StyleSheet } from "react-native";
import { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "./context/ThemeContext";

function CreateScreen(name, age, darkMode, navigation) {
    const styles = getStyles(darkMode);

    return (
        <View style={styles.container}>
            {name && age ? (
                <Text style={styles.text}>Hallo {name}, jij bent {age} jaar oud.</Text>
            ) : (
                <Text style={styles.text}>Nog niet alle gegevens zijn bekend.</Text>
            )}

            <View style={{ height: 20 }} />

            <Button title="Settings" onPress={() => navigation.navigate("Settings")} />
            <View style={{ height: 10 }} />
            <Button title="Notes" onPress={() => navigation.navigate("Notes")} />
            <Button title="MapView" onPress={() => navigation.navigate("MapScreen")} />
        </View>
    );
}

export default function HomeScreen({ route, navigation }) {
    const { darkMode } = useContext(ThemeContext);
    const [name, setName] = useState(null);
    const [age, setAge] = useState(null);


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
    }, [route?.params]);

    useEffect(() => {
        if (route?.params) {
            if (route.params.name) setName(route.params.name);
            if (route.params.age) setAge(route.params.age);
        }
    }, [route?.params]);

    return CreateScreen(name, age, darkMode, navigation);
}

const getStyles = (dark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: dark ? "#111" : "#fff",
        },
        text: {
            fontSize: 22,
            color: dark ? "#fff" : "#000",
            textAlign: "center",
        },
    });