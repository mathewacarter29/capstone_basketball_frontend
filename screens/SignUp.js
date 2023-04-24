import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import { Player, SkillLevel } from "../src/models";
import { Auth } from "aws-amplify";
import { DataStore } from "aws-amplify";
import "@azure/core-asynciterator-polyfill";

import ErrorPopup from "../common/ErrorPopup";
import TextInput from "../common/TextInput";

import {
  Text,
  Button,
  TopNavigation,
  Icon,
  TopNavigationAction,
} from "@ui-kitten/components";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

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

  const navigateGetStarted = () => {
    navigation.navigate("GetStarted");
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateGetStarted} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment="center"
        title="Sign Up"
        accessoryLeft={renderBackAction}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ textAlign: "center", margin: "2%" }} category="h1">
            Lets play some Basketball!
          </Text>

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

          <Button onPress={() => signup()} style={{ margin: "2%" }}>
            Sign Up!
          </Button>

          <Text
            style={styles.clickableText}
            onPress={() => navigation.navigate("EmailVerification")}
          >
            I was sent a verification code - verify my account
          </Text>

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
  clickableText: {
    color: "darkorange",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});

export default SignIn;
