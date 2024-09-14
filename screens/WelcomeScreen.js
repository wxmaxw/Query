import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Button from "../components/Button";

import colors from "../constants/colors";
import sizes from "../constants/sizes";
import {setItem} from "../store/async-storage";
import {queryClient} from "../util/http";

const screens = [
    {
        illustration: require("../assets/illustrations/welcome0.png"),
        title: "Lorem ipsum dolor sit amet",
        text: "Pellentesque vel neque molestie eros bibendum viverra sed iaculis est. Vestibulum eget venenatis nunc.",
    },
    {
        illustration: require("../assets/illustrations/welcome1.png"),
        title: "Consectetur adipiscing elit",
        text: "Duis ultrices mollis mollis. Phasellus in nibh maximus est pretium auctor vel id diam.",
    },
    {
        illustration: require("../assets/illustrations/welcome2.png"),
        title: "Vestibulum sed nisl a elit lobortis gravida",
        text: "Cras rhoncus massa nec metus tincidunt, condimentum hendrerit libero commodo. Nulla vel tempus enim. Integer lobortis ornare mattis.",
    },
];

export default function WelcomeScreen() {
    const [screen, setScreen] = useState(0);

    return(
        <View style={styles.container}>
            <Image style={styles.container} source={screens[screen].illustration} resizeMode="contain" />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{screens[screen].title}</Text>
                <Text style={styles.text}>{screens[screen].text}</Text>
                <Text style={styles.text}>{screen + 1}</Text>
            </View>
            <View style={styles.actions}>
                {screen === screens.length -1 ? (
                    <View>
                        <Button
                            style={styles.button}
                            mode= "primary"
                            onPress={() => {
                                setItem("notFirstTime", "true");
                                queryClient.invalidateQueries({queryKey: ["isNotFirstTime"]});
                            }}
                        >
                            Giriş Yap
                        </Button>
                        <Button
                            style={[styles.button, { backgroundColor: "#47c99f" }]}
                            mode='primary'
                            onPress={() => {
                                setItem("notFirstTime", "true");
                                queryClient.invalidateQueries({ queryKey: ["isNotFirstTime"] });
                            }}
                        >
                            Kayıt Ol
                        </Button>
                    </View>
                ):(
                    <Button
                    mode='text'
                    style={{ alignSelf: "center" }}
                    textStyle={styles.nextButtonText}
                    onPress={() => setScreen((prev) => prev + 1)}
                >
                    Atla
                </Button>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 60,
        backgroundColor: "#f3f6f9",
    },
    illustration: {
        width: 320,
        height: 320,
        alignSelf: "center",
    },
    textContainer: {
        marginHorizontal: 40,
        gap: 16,
    },
    title: {
        fontFamily: "exo-bold",
        color: "#384357",
        textAlign: "center",
        fontSize: sizes.titleLarge,
    },
    text: {
        fontFamily: "exo",
        color: "#646d77",
        textAlign: "center",
        fontSize: sizes.textLarge,
    },
    actions: {
        marginTop: "auto",
    },
    nextButtonText: {
        fontFamily: "exo",
        color: "#5c69ff",
        fontSize: sizes.titleMedium,
    },
    button: {
        marginVertical: 8,
        ...colors.shadow,
    },
});
