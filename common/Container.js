import React from "react";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

function Container(props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.scroll_container}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "lightgray" }}
        >
          {props.children}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = EStyleSheet.create({
  scroll_container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});

export default Container;
