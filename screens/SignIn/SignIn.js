import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

function SignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function signup() {
    if ([phone, email, phone, password, confirm].includes("")) {
      setShowError(true);
      setErrorMessage("Please fill out all fields");
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
        placeholder="Enter your phone number"
        onChangeText={(text) => setPhone(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter your password"
        onChangeText={(text) => setPassword(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={confirm}
        placeholder="Confirm your password"
        onChangeText={(text) => setConfirm(text)}
      ></TextInput>
      <TouchableOpacity onPress={() => signup()} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up!</Text>
      </TouchableOpacity>
      {showError && (
        <View style={styles.errorBackground}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "lightgray",
    width: "100%",
    alignItems: "center",
    paddingTop: "10rem",
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
    border: "solid",
    borderRadius: "1rem",
    backgroundColor: "white",
    margin: "1rem",
    color: "#333",
    padding: "10px",
    shadowColor: "#171717",
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
  },
  button: {
    width: "80%",
    height: "3rem",
    backgroundColor: "orange",
    textAlign: "center",
    justifyContent: "center",
    margin: "1rem",
    borderRadius: "1rem",
    shadowColor: "#171717",
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
  },
  buttonText: {
    margin: "1rem",
    fontSize: 30,
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
