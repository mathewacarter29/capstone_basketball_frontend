import React from "react";
import { TouchableOpacity, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

function Button(props) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = EStyleSheet.create({
  button: {
    width: "80%",
    height: "3rem",
    backgroundColor: "orange",
    justifyContent: "center",
    margin: "1rem",
    borderRadius: "1rem",
    shadowColor: "#171717",
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
  },
});

export default Button;
