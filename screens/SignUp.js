import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Button from "../common/Button";
import { Auth } from "aws-amplify";
import LoadingScreen from "../common/LoadingScreen";

function SignIn({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signup() {
    // make sure no fields are empty
    if ([phone, email, phone, password, confirm].includes("")) {
      setShowError(true);
      setErrorMessage("Please fill out all fields");
      return;
    }
    // validate email address
    if (!/\w+\@\w+(\.com|\.edu)/.test(email)) {
      setShowError(true);
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Make sure that the phone number is valid (all numbers)
    if (isNaN(phone)) {
      setShowError(true);
      setErrorMessage("Enter a valid phone number");
      return;
    }
    if (phone.length != 10) {
      setShowError(true);
      setErrorMessage("Phone number should be 10 digits long");
      return;
    }

    // Make sure the passwords match
    if (password !== confirm) {
      setShowError(true);
      setErrorMessage("Passwords do not match - please re-enter");
      return;
    }
    try {
      setLoading(true);
      const { user } = await Auth.signUp({
        username: email,
        password: password,
        attributes: { phone_number: `+1${phone}`, name },
        autoSignIn: { enabled: true }, // enables auto sign in after user is confirmed
      });
    } catch (e) {
      setLoading(false);
      setShowError(true);
      setErrorMessage(e.message);
      return;
    }
    setLoading(false);
    setShowError(false);
    navigation.navigate("EmailVerification", { email: email });
  }

  return (
    // This is gonna be the sign up form
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.scroll_container}
      >
        {loading && <LoadingScreen />}
        <ScrollView style={{ backgroundColor: "lightgray" }}>
          <View style={styles.container}>
            <Text style={styles.text}>
              Let's help you play some basketball!
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              placeholder="Enter your full name"
              onChangeText={(text) => setName(text)}
            ></TextInput>
            <TextInput
              style={styles.input}
              value={email}
              placeholder="Enter your email"
              onChangeText={(text) => setEmail(text)}
            ></TextInput>
            <TextInput
              style={styles.input}
              value={phone}
              keyboardType="numeric"
              placeholder="Enter your phone number"
              onChangeText={(text) => setPhone(text)}
            ></TextInput>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Enter your password"
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            ></TextInput>
            <TextInput
              style={styles.input}
              value={confirm}
              placeholder="Confirm your password"
              onChangeText={(text) => setConfirm(text)}
              secureTextEntry
            ></TextInput>
            <Button onPress={() => signup()} title="Sign Up!" />
            <Button
              onPress={() => navigation.navigate("GetStarted")}
              title="Go Back"
            />
            {showError && (
              <View style={styles.errorBackground}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
            <Text
              style={styles.clickableText}
              onPress={() => navigation.navigate("EmailVerification")}
            >
              I was sent a verification code - verify my account
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "lightgray" }}></View>
        </ScrollView>
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
    paddingTop: "5rem",
    justifyContent: "flex-end",
  },
  text: {
    margin: "1rem",
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
  clickableText: {
    color: "darkorange",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});

export default SignIn;
