import React from "react";
import { View, Text, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Button from "../common/Button";

function GetStarted({ navigation }) {
    return (
        <View style={styles.container}>
            <Image source={require("../assets/basketballPlayer.png")}></Image>
            <Text style={styles.topText}>
                Plan your next basketball game with CampusCourts
            </Text>
            <Text style={styles.bottomText}>
                An easy way to plan pickup basketball games and join a whole new
                community
            </Text>
            <Button onPress={() => navigation.navigate("LogIn")} title="Log In" />
            <Text
                style={styles.clickableText}
                onPress={() => navigation.navigate("SignUp")}
            >
                Don't have an account? Sign Up here
            </Text>
        </View>
    );
}

const styles = EStyleSheet.create({
    topText: {
        margin: "1rem",
        fontSize: 30,
        width: "80%",
        textAlign: "center",
        fontWeight: "bold",
    },
    bottomText: {
        margin: "1rem",
        fontSize: 20,
        width: "80%",
        textAlign: "center",
    },
    container: {
        backgroundColor: "lightgray",
        alignItems: "center",
        paddingTop: "10rem",
        height: "100%",
        width: "100%",
    },
    clickableText: {
        color: "darkorange",
        fontSize: 15,
        textDecorationLine: "underline",
    },
});

export default GetStarted;
