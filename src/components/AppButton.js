import { Pressable, StyleSheet, Text } from "react-native";

import { useApp } from "../context/AppContext";

export default function AppButton({ title, onPress, variant = "primary", disabled = false }) {
    const { colors } = useApp();
    const isSecondary = variant === "secondary";
    const isDanger = variant === "danger";

    const styles = StyleSheet.create({
        button: {
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: isSecondary ? colors.surfaceMuted : isDanger ? colors.danger : colors.primary,
            opacity: disabled ? 0.5 : 1,
        },
        text: {
            color: isSecondary ? colors.text : colors.primaryText,
            fontSize: 15,
            fontWeight: "700",
        },
    });

    return (
        <Pressable style={styles.button} onPress={disabled ? undefined : onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}
