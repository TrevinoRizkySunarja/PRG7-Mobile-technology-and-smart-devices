import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

import Producten from "./src/Producten.js";
import Winkelmand from "./src/Winkelmand.js";
import {createContext} from "react";



const Tab = createBottomTabNavigator();

function AppNav() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: { position: "absolute" },
                useBottomTabHeight: "30px",
                tabBarBackground: () => (
                    <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
                ),
            }}
        >
            <Tab.Screen name="Product" component={Producten} />
            <Tab.Screen name="Winkelmand" component={Winkelmand}
            options={{
                tabBarLabel: "Shopping cart",
                tabBarBadge: cartItems.length > 0 ? cartItems.length : null,
                tabBarIcon: ({color, size}) => <AntDesign name="shopping-cart" size={size} color={color}

                />
            }
        </Tab.Navigator>
    );
}

export const NavContext = createContext(null)
export default function App() {
    return <AppNav />;
}