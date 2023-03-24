import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Button from "../common/Button";

function SignIn({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function signup() {
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

    setShowError(false);
    const result = {
      name: name,
      email: email,
      phone: phone,
      password: password,
    };
    // This is temparary
    // we will do a database POST request here for creating a new user
    console.log(result);
  }

  return (
    // This is gonna be the sign up form
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.scroll_container}
      >
        <View style={styles.container}>
          <Text style={styles.text}>Let's help you play some basketball!</Text>
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
          <Button
            onPress={() => signup()}
            style={styles.button}
            title="Sign Up!"
          />
          <Button
            onPress={() => navigation.navigate("GetStarted")}
            title="Go Back"
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
    paddingTop: "7rem",
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
});

export default SignIn;
