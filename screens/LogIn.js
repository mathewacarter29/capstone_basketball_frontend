import { React, useState } from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { Keyboard, View, Text, Image } from "react-native";
import Button from "../common/Button";
import LoadingScreen from "../common/LoadingScreen";
import { Auth } from "aws-amplify";
import ErrorPopup from "../common/ErrorPopup";
import TextInput from "../common/TextInput";
import Container from "../common/Container";
import { DataStore } from "aws-amplify";
import { Player, Location } from "../src/models";
import "@azure/core-asynciterator-polyfill";
import BackArrow from "../common/BackArrow";

function LogIn({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (username == "") {
      setShowError(true);
      setErrorMessage("Enter valid email address");
      return;
    }
    Keyboard.dismiss();
    const loginData = {
      username: username,
      password: password,
    };

    setLoading(true);

    // const players = await DataStore.query(Player);
    // using amplify API call to validate user
    try {
      response = await Auth.signIn(loginData.username, loginData.password);
    } catch (e) {
      setLoading(false);
      setShowError(true);
      setErrorMessage("Log in failed - please try again");
      return;
    }
    // if we make it here, we have a correct username and password

    setShowError(false);
    setLoading(false);
    // navigate to the main screen below
    console.log(`Logged in as ${username}`);

    navigation.navigate("HomeScreen");
  }

  return (
    <Container>
      {loading && <LoadingScreen />}
      <View style={styles.container}>
        <Text style={styles.text}>Welcome Back!</Text>
        <Image source={require("../assets/basketballPlayerArms.png")} />
        <TextInput
          value={username}
          placeholder="Enter your email"
          onChangeText={(text) => setUsername(text)}
        ></TextInput>
        <TextInput
          value={password}
          placeholder="Enter your password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        ></TextInput>
        <Button title="Log In" onPress={() => login()} />
        <BackArrow navigation={navigation} location="GetStarted"/>
        {showError && <ErrorPopup errorMessage={errorMessage} />}
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

export default LogIn;
