import React from "react";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  View,
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import BackArrow from "./BackArrow";
import LoadingScreen from "./LoadingScreen";

function Container(props) {
  return (
    <View style={{ flex: 1 }}>
      {props.goBackTo && <BackArrow location={props.goBackTo} />}
      {props.loadingState && <LoadingScreen />}
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
    </View>
  );
}

const styles = EStyleSheet.create({
  scroll_container: {
    flex: 1,
  },
});

export default Container;
