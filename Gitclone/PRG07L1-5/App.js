import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";

import ThemeProvider, { ThemeContext } from "./src/context/ThemeContext";
import HomeScreen from "./src/HomeScreen";
import SettingsScreen from "./src/SettingsScreen";
import NotesListScreen from "./src/NotesListScreen";
import NoteDetailScreen from "./src/NoteDetailScreen";
import MapScreen from "./src/MapScreen"

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { darkMode } = useContext(ThemeContext);

    return (
        <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Notes" component={NotesListScreen} />
                <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
                <Stack.Screen name="MapScreen" component={MapScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppNavigator />
        </ThemeProvider>
    );
}