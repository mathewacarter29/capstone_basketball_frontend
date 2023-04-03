import React, { useState } from "react";
import { View, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Button from "../common/Button";
import { Auth } from "aws-amplify";
import LoadingScreen from "../common/LoadingScreen";
import ErrorPopup from "../common/ErrorPopup";
import TextInput from "../common/TextInput";
import Container from "../common/Container";
import "@azure/core-asynciterator-polyfill";
import { Player, SkillLevel } from "../src/models";
import { DataStore } from "aws-amplify";

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
      const player = await DataStore.save(
        new Player({
          name: name,
          email: email,
          phone_number: phone,
          skill_level: SkillLevel.ANY,
          instagram: "String",
          twitter: "String",
          bio: "String",
        })
      );
      console.log("Player saved successfully!", player);
    } catch (error) {
      setLoading(false);
      setShowError(true);
      setErrorMessage(error.message);
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
    <Container>
      {loading && <LoadingScreen />}
      <View style={styles.container}>
        <Text style={styles.text}>Let's help you play some basketball!</Text>
        <TextInput
          value={name}
          placeholder="Enter your full name"
          onChangeText={(text) => setName(text)}
        ></TextInput>
        <TextInput
          value={email}
          placeholder="Enter your email"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          value={phone}
          keyboardType="numeric"
          placeholder="Enter your phone number"
          onChangeText={(text) => setPhone(text)}
        ></TextInput>
        <TextInput
          value={password}
          placeholder="Enter your password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        ></TextInput>
        <TextInput
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
        <Text
          style={styles.clickableText}
          onPress={() => navigation.navigate("EmailVerification")}
        >
          I was sent a verification code - verify my account
        </Text>
        {showError && <ErrorPopup errorMessage={errorMessage} />}
      </View>
      <View style={{ flex: 1, backgroundColor: "lightgray" }}></View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  container: {
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
  clickableText: {
    color: "darkorange",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});

export default SignIn;
