import { Pressable, StyleSheet, Text, View } from "react-native";

import { useApp } from "../context/AppContext";

export default function SegmentedControl({ options, value, onChange }) {
    const { colors } = useApp();

    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            backgroundColor: colors.surfaceMuted,
            borderRadius: 8,
            padding: 4,
            gap: 4,
        },
        option: {
            flex: 1,
            minHeight: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            paddingHorizontal: 8,
        },
        active: {
            backgroundColor: colors.primary,
        },
        label: {
            color: colors.text,
            fontWeight: "700",
            textAlign: "center",
        },
        activeLabel: {
            color: colors.primaryText,
        },
    });

    return (
        <View style={styles.container}>
            {options.map((option) => {
                const active = option.value === value;
                return (
                    <Pressable
                        key={option.value}
                        style={[styles.option, active && styles.active]}
                        onPress={() => onChange(option.value)}
                    >
                        <Text style={[styles.label, active && styles.activeLabel]}>{option.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
