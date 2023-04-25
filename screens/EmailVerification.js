import { React, useState } from "react";
import EStyleSheet from "react-native-extended-stylesheet";

import { Auth } from "aws-amplify";

import { View, Alert, SafeAreaView, ScrollView } from "react-native";
import {
  Text,
  Button,
  TopNavigation,
  Icon,
  TopNavigationAction,
} from "@ui-kitten/components";

import ErrorPopup from "../common/ErrorPopup";
import TextInput from "../common/TextInput";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//import Button from "../common/Button";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function EmailVerification({ route, navigation }) {
  let startEmailValue = "";
  if (route.params != undefined && route.params.email != undefined) {
    startEmailValue = route.params.email;
  }
  const [email, setEmail] = useState(startEmailValue);
  const [code, setCode] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function fieldsEmpty() {
    return email == "" || code == "";
  }

  async function verify() {
    if (fieldsEmpty()) {
      setShowError(true);
      setErrorMessage("Enter all fields before verifying");
      return;
    }
    try {
      const response = await Auth.confirmSignUp(email, code);
    } catch (e) {
      setShowError(true);
      setErrorMessage(e.message);
      return;
    }
    // If we make it here, we are successful, navigate to the sign in screen
    navigation.navigate("LogIn");
  }

  async function resendCode() {
    if (email == "") {
      setShowError(true);
      setErrorMessage("Please enter username to resend verification code");
      return;
    }
    try {
      setLoading(true);
      const response = await Auth.resendSignUp(email);
    } catch (e) {
      setLoading(false);
      setShowError(true);
      setErrorMessage(e.message);
      return;
    }
    setLoading(false);
    setShowError(false);
    Alert.alert("Success", "Code was resent to your email");
  }

  const navigateGetStarted = () => {
    navigation.navigate("SignUp");
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateGetStarted} />
  );

  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAwareScrollView>
      <TopNavigation
        alignment="center"
        title="Verify Email"
        accessoryLeft={renderBackAction}
      />

      <View style={{ alignItems: "center" }}>
        <Text style={{ textAlign: "center", margin: "5%" }} category="h1">
          Verify your account
        </Text>

        <TextInput
          value={email}
          placeholder="Enter your email address"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>

        <TextInput
          value={code}
          keyboardType="numeric"
          placeholder="Enter your verifaction code"
          onChangeText={(text) => setCode(text)}
        ></TextInput>

        <Button
          onPress={() => verify()}
          style={{ margin: "2%", marginTop: "10%" }}
        >
          Verify
        </Button>

        <Button onPress={() => resendCode()} style={{ margin: "2%" }}>
          Resend Code
        </Button>

        {showError && <ErrorPopup errorMessage={errorMessage} />}
      </View>
      </KeyboardAwareScrollView>
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
  }
});

export default EmailVerification;
