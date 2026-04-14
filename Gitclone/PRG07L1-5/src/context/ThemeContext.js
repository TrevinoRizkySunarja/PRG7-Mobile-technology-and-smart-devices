import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const saved = await AsyncStorage.getItem("darkMode");
                if (saved !== null) setDarkMode(JSON.parse(saved));
            } catch (err) {
                console.log("Error loading theme:", err);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const newValue = !darkMode;
            setDarkMode(newValue);
            await AsyncStorage.setItem("darkMode", JSON.stringify(newValue));
        } catch (err) {
            console.log("Error saving theme:", err);
        }
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}