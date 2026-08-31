import { SafeAreaView, StyleSheet } from "react-native";

import { useApp } from "../context/AppContext";

export default function ThemedScreen({ children, padded = true }) {
    const { colors } = useApp();
    const styles = StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: colors.background,
            padding: padded ? 16 : 0,
        },
    });

    return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>;
}
