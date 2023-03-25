import { React, useState } from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import {
  Keyboard,
  View,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import Button from "../common/Button";
import LoadingScreen from "../common/LoadingScreen";
import { Auth } from "aws-amplify";

function LogIn({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    Keyboard.dismiss();
    const loginData = {
      username: username,
      password: password,
    };
    setLoading(true);
    // using amplify API call to validate user
    try {
      const response = await Auth.signIn(
        loginData.username,
        loginData.password
      );
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
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.scroll_container}
      >
        {loading && <LoadingScreen />}
        <View style={styles.container}>
          <Text style={styles.text}>Welcome Back!</Text>
          <Image source={require("../assets/basketballPlayerArms.png")} />
          <TextInput
            style={styles.input}
            value={username}
            placeholder="Enter your email"
            onChangeText={(text) => setUsername(text)}
          ></TextInput>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter your password"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          ></TextInput>
          <Button title="Log In" onPress={() => login()} />
          <Button
            title="Go Back"
            onPress={() => navigation.navigate("GetStarted")}
          />
          {showError && (
            <View style={styles.errorBackground}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, backgroundColor: "lightgray" }}></View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = EStyleSheet.create({
  scroll_container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  container: {
    backgroundColor: "lightgray",
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
  input: {
    height: "3rem",
    width: "80%",
    borderRadius: "1rem",
    backgroundColor: "white",
    margin: "1rem",
    color: "#333",
    padding: "1rem",
    shadowColor: "#171717",
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
  },
  errorBackground: {
    backgroundColor: "#FAA0A0",
    width: "80%",
    borderRadius: "1rem",
    textAlign: "center",
    margin: "1rem",
    padding: ".5rem",
  },
  errorText: {
    color: "red",
  },
});

export default LogIn;
