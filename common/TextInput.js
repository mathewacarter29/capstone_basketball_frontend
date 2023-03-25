import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { TextInput as Input } from "react-native";

function TextInput(props) {
  return <Input style={styles.input} {...props}></Input>;
}

const styles = EStyleSheet.create({
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
});

export default TextInput;
