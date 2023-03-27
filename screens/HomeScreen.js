import {React, useState} from "react";

import { View, Text, Image, TouchableOpacity } from "react-native";
import Container from "../common/Container";
import EStyleSheet from "react-native-extended-stylesheet";


function HomeScreen({ navigation, route }) {

    return(
        <Container>
            <View style={styles.profile}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile", route.params)}>
                    <Image
                        style={styles.image}
                        source={require("../assets/profile_icon.png")} />
                </TouchableOpacity>
            </View>
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
    profile: {
        width: "100%",
        justifyContent: "flex-end",
    },
    image: {
        marginTop: "3rem",
        marginLeft: "20rem",
        width: 50,
        height: 52,
    },
});

export default HomeScreen;