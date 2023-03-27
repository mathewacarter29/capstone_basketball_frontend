import EStyleSheet from "react-native-extended-stylesheet";
import Container from "../common/Container";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Auth } from "aws-amplify";
import LoadingScreen from "../common/LoadingScreen";
import { React, useState, useEffect } from "react";
import Button from "../common/Button";

function Profile({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function getProfileData() {
    setLoading(true);
    try {
      response = await Auth.currentUserInfo();
      setName(response.attributes.name);
      setEmail(response.attributes.email);
    } catch (e) {
      // we dont do anything with exceptions right now
    }
    setLoading(false);
  }

  async function logOut() {
    setLoading(true);
    try {
      response = await Auth.signOut({ global: true });
      navigation.navigate("GetStarted");
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <Container>
      {loading && <LoadingScreen />}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Image source={require("../assets/back_arrow_icon.png")} />
        </TouchableOpacity>
        <Text style={styles.text}>Profile</Text>
        <Image source={require("../assets/profile_icon.png")} />
        <Text style={styles.text_info}>Name: {name}</Text>
        <Text style={styles.text_info}>Email: {email}</Text>
        <Button title="Log Out" onPress={() => logOut()} />
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
    left: "7%",
    top: "12%",
  },
  text_info: {
    margin: ".5rem",
    fontSize: 20,
    width: "80%",
  },
});

export default Profile;
