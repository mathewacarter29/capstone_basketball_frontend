import EStyleSheet from "react-native-extended-stylesheet";
import Container from "../common/Container";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Auth } from "aws-amplify"
import LoadingScreen from "../common/LoadingScreen";
import { React, useState, useEffect } from "react";




function Profile({ navigation}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    
    async function getProfileData() {
        setLoading(true);
        try {
            response = await Auth.currentUserInfo()
            setName(response.attributes.name)
            setEmail(response.attributes.email)
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            return;
        }
    }

    useEffect( () => {
        getProfileData()
    }, [])

    return (
        <Container>
            {loading && <LoadingScreen/>}
            <View style={styles.container}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.navigate("HomeScreen")}>
                    <Image
                        style={styles.image}
                        source={require("../assets/back_arrow_icon.png")} />
                </TouchableOpacity>
                <Text style={styles.text}>Profile</Text>
                <Image source={require("../assets/profile_icon.png")} />
            </View>
            <View style={styles.first_info}>
                <Text style={styles.text_info}>Name: {name}</Text>
                <Text style={styles.text_info}>Email: {email}</Text>
            </View>

        </Container>
        );
}

const styles = EStyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: "1rem",
        justifyContent: "center",
    },
    text: {
        margin: "1rem",
        marginTop: "6rem",
        fontSize: 30,
        width: "80%",
        textAlign: "center",
    },
    back: {
        position: "absolute",
        left: "0%",
        top: "0%",
    },
    image: {
        marginTop: "3rem",
        marginLeft: "2rem",
    },
    first_info: {
        marginLeft: "2rem",
        marginTop: "2rem",
        width: "100%",
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
    },
    text_info: {
        margin: ".5rem",
        fontSize: 20,
        width: "100%",
    },
})

export default Profile;

