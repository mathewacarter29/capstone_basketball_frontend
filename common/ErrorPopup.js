import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text } from "react-native";

function ErrorPopup(props) {
  return (
    <View style={styles.errorBackground}>
      <Text style={styles.errorText}>{props.errorMessage}</Text>
    </View>
  );
}

const styles = EStyleSheet.create({
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
export default ErrorPopup;
