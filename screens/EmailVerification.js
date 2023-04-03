import { React, useState } from "react";
import { View, Text, Alert } from "react-native";
import Button from "../common/Button";
import EStyleSheet from "react-native-extended-stylesheet";
import { Auth } from "aws-amplify";
import LoadingScreen from "../common/LoadingScreen";
import ErrorPopup from "../common/ErrorPopup";
import TextInput from "../common/TextInput";
import Container from "../common/Container";

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

  return (
    <Container>
      {loading && <LoadingScreen />}
      <View style={styles.container}>
        <Text style={styles.text}>Verify your account</Text>
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
        <Button title="Verify" onPress={() => verify()}></Button>
        <Button title="Resend Code" onPress={() => resendCode()}></Button>
        <Button
          title="Go Back"
          onPress={() => navigation.navigate("SignUp")}
        ></Button>
        {showError && <ErrorPopup errorMessage={errorMessage} />}
      </View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: "7rem",
    height: "100%",
  },
  text: {
    margin: "1rem",
    fontSize: 30,
    width: "80%",
    textAlign: "center",
  },
});

export default EmailVerification;
