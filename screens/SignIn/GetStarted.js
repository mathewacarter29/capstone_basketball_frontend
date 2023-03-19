import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

function GetStarted() {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/basketballPlayer.png")}></Image>
      <Text style={styles.topText}>
        Plan your next basketball game with CampusCourts
      </Text>
      <Text style={styles.bottomText}>
        An easy way to plan pickup basketball games and join a whole new
        community
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = EStyleSheet.create({
  topText: {
    margin: "1rem",
    fontSize: 30,
    width: "80%",
    textAlign: "center",
    fontWeight: "bold",
  },
  bottomText: {
    margin: "1rem",
    fontSize: 20,
    width: "80%",
    textAlign: "center",
  },
  container: {
    backgroundColor: "lightgray",
    alignItems: "center",
    paddingTop: "10rem",
    height: "100%",
    width: "100%",
  },
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

export default GetStarted;
