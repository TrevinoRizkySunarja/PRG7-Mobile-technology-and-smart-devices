import { useCart } from "./context/context"
import {useNavigation} from "@react-navigation/native";
import {useEffect} from "react";

export default function Cart() {
    const {winkelmandItems} = useCart();
    const {cartItems, setCartItems} = useCart();

    const navigation = useNavigation();

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    useEffect(() => {
    console.log()
    }, []);

    function Winkelmand() {

    }
}
export default Winkelmand