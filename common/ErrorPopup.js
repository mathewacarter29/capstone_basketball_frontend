import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View } from "react-native";
import { Text } from "@ui-kitten/components";

function ErrorPopup(props) {
  return (
    <View style={styles.errorBackground}>
      <Text style={[styles.text, styles.errorText]} status="warning">
        {props.errorMessage}
      </Text>
    </View>
  );
}

const styles = EStyleSheet.create({
  errorBackground: {
    backgroundColor: "#DB6F5C",
    width: "80%",
    borderRadius: "1rem",
    textAlign: "center",
    margin: "1rem",
    padding: ".5rem",
  },
  errorText: {
    textAlign: "center",
    color: "#7A181F",
  },
});
export default ErrorPopup;
