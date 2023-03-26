import {React, useState} from "react";

import { Keyboard, View, Text, Image } from "react-native";
import Container from "../common/Container";
import EStyleSheet from "react-native-extended-stylesheet";

function HomeScreen({ navigation }) {



    return(
        <Container>
            <View style={styles.container}>
                <Text style={styles.text}>Home Screen</Text>
                <Image source={require("../assets/basketballPlayerArms.png")} />
            </View>
            <View style={{ flex: 1, backgroundColor: "lightgray" }}></View>
        </Container>
    );
}

const styles = EStyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: "2rem",
        justifyContent: "flex-end",
    },
    text: {
        margin: "1rem",
        marginTop: "7rem",
        fontSize: 30,
        width: "80%",
        textAlign: "center",
    },
});

export default HomeScreen;