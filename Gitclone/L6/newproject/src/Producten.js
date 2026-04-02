import {View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";

function CreateScreen() {

    const array = [
        {name: "Banaan", price: 1.20 },
        {name: "Appel", price: 1.50 },
        {name: "Perzik", price: 1.75},
        {name: "Mandarijn", price:1.80},
        {name: "Water", price: 2.00}
    ]

        return(
            <View style={styles.div}>
                {/*<FlatList*/}
                {/*    data={array}*/}
                {/*    renderItem={({  item, index })} => {*/}
                {/*        console.log("item is", {name})*/}
                {/*}*/}
                {/*        return(*/}
                {/*            <View style={{flexDirection:"row"}}>*/}

                {/*                    return(*/}
                {/*                        <View>*/}
                {/*                            <Pressable>*/}
                {/*                            <Text> {item} </Text>*/}
                {/*                            </Pressable>*/}
                {/*                        </View>*/}
                {/*                    )*/}

                {/*            </View>*/}

                {/*/>*/}
                {/*</FlatList>*/}

             <Text>Store</Text>
                <Flatlist
                    data={cartItems}
                    renderItem{({item})} => (
                <Pressable>

                </Pressable>
                </Flatlist>
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
};