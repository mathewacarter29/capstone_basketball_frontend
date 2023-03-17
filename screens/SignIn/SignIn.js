import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

function SignIn() {
  const [name, setName] = useState("");

  return (
    // This is gonna be the sign up form
    <View style={styles.container}>
      <Text style={styles.text}>Let's help you play some basketball</Text>
      <TextInput
        style={styles.input}
        value={name}
        placeholder="Enter name"
        onChangeText={(text) => setName(text)}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "lightgray",
    width: "100%",
    alignItems: "center",
    paddingTop: "3rem",
  },
  text: {
    margin: "1rem",
    fontSize: 20,
  },
  input: {
    height: "2rem",
    width: "80%",
    border: "solid",
    borderRadius: "10px",
    backgroundColor: "white",
    margin: "1rem",
    color: "#333",
    padding: "5px",
  },
});

export default SignIn;
