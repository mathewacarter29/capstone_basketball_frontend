import { React, useState } from "react";
import { View, TextInput, Text } from "react-native";
import Button from "../common/Button";
import EStyleSheet from "react-native-extended-stylesheet";

function EmailVerification() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Verify your account</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Enter your email address"
        onChangeText={(text) => setEmail(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={code}
        placeholder="Enter your verifaction code"
        onChangeText={(text) => setCode(text)}
      ></TextInput>
      <Button title="Verify"></Button>
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    backgroundColor: "lightgray",
    alignItems: "center",
    paddingTop: "7rem",
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

export default EmailVerification;
