import { ActivityIndicator,Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "./Icon";

import colors from "../constants/colors";
import sizes from "../constants/sizes";

export default function Button(props){
    return(
        //{...props} props içindeki tüm özellikleri pressable bileşenine yayar. örneğin onPRess gibi eventlar yada başka stiller gönderildiyse, bunlar aktarılır
        <Pressable disabled={props.isLoading} {...props} style={[containerStyles[props.mode], props.style]}>
            {props.isLoading && <ActivityIndicator size="large"/>}
            {!props.isLoading && (
                <>
                    {props.mode === "icon" && <View style={{width:26}}/>}
                    <Text style={[textStyles[props.mode], props.textStyle]}>{props.children}</Text>
                    {props.mode === "icon" && <Icon size={26} name={props.icon}/>}
                </>
            )}
        </Pressable>
    );
}

const containerStyles = StyleSheet.create({
    primary: {
        backgroundColor: colors.primary800,
        justifyContent: "center",
        alignItems: "center",
        height: 56,
        borderRadius: 10,
        marginHorizontal: 40,
        marginVertical: 40,
    },
    secondary: {
        backgroundColor: colors.secondary500,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 10,
    },
    text: {},
    icon: {
        width: 240,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginVertical: 24,
        borderRadius: 12,
        backgroundColor: "#1dc9a0",
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        ...colors.shadow,
    },
});

const textStyles = StyleSheet.create({
    primary: {
        fontFamily: "exo-bold",
        color: "white",
        fontSize: sizes.titleSmall,
    },
    secondary: {
        fontFamily: "exo-bold",
        color: "white",
        fontSize: sizes.titleSmall,
    },
    text: {
        fontFamily: "exo",
        color: colors.primary800,
        fontSize: sizes.textMedium,
    },
    icon: {
        fontFamily: "exo-bold",
        color: "white",
        fontSize: sizes.titleMedium,
    },
});
