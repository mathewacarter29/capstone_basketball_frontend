import React from "react";
import { Image, SafeAreaView } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { Text, Button } from "@ui-kitten/components";

function GetStarted({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/basketballPlayer.png")}
        style={{ marginTop: "10%" }}
      ></Image>

      <Text style={[styles.text, styles.title]} category="h1">
        Plan your next basketball game with CampusCourts
      </Text>

      <Text style={[styles.text, styles.subtitle]} category="p1">
        An easy way to plan pickup basketball games and join a whole new
        community
      </Text>

      <Button
        onPress={() => navigation.navigate("LogIn")}
        title="Log In"
        style={styles.button}
      >
        Log In
      </Button>

      <Text
        style={styles.clickableText}
        onPress={() => navigation.navigate("SignUp")}
      >
        Don't have an account? Sign Up here
      </Text>
    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
  title: {
    margin: "1rem",
    textAlign: "center",
  },
  subtitle: {
    margin: "1rem",
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  clickableText: {
    color: "darkorange",
    textDecorationLine: "underline",
  },
  button: {
    margin: "1rem",
  },
});

export default GetStarted;
