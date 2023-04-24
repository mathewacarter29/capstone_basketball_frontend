import { React, useState } from "react";
import EStyleSheet from "react-native-extended-stylesheet";

import { Auth } from "aws-amplify";
import "@azure/core-asynciterator-polyfill";

import ErrorPopup from "../common/ErrorPopup";
import TextInput from "../common/TextInput";

import { Keyboard, Image, SafeAreaView, ScrollView, View } from "react-native";
import {
  Text,
  Button,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function LogIn({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateGetStarted = () => {
    navigation.navigate("GetStarted");
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateGetStarted} />
  );

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
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment="center"
        title="Login"
        accessoryLeft={renderBackAction}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.text, styles.title]} category="h1">
            Welcome Back!
          </Text>

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

          <Button title="Log In" onPress={() => login()}>
            Log In
          </Button>

          {showError && <ErrorPopup errorMessage={errorMessage} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    margin: "1rem",
    textAlign: "center",
  },
});

export default LogIn;