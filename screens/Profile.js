import EStyleSheet from "react-native-extended-stylesheet";
import Container from "../common/Container";
import { View, Text, Image, TouchableOpacity } from "react-native";




function Profile({ navigation, route }) {

    return (
        <Container>
            <View style={styles.back}>
                <TouchableOpacity onPress={() => navigation.navigate("HomeScreen", route.params)}>
                    <Image
                        style={styles.image}
                        source={require("../assets/back_arrow_icon.png")} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Profile</Text>
                <Image source={require("../assets/profile_icon.png")} />
            </View>
            <View style={styles.first_info}>
                <Text style={styles.text_info}>Name: {route.params.attributes.name}</Text>
                <Text style={styles.text_info}>Email: {route.params.attributes.email}</Text>
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
        marginTop: "0rem",
        fontSize: 30,
        width: "80%",
        textAlign: "center",
    },
    back: {
        width: "100%",
        justifyContent: "flex-end",
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

