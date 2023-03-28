import { React, useState } from "react";
import Button from "../common/Button";

import { View, Text, Image, TouchableOpacity } from "react-native";
import Container from "../common/Container";
import EStyleSheet, { absoluteFill } from "react-native-extended-stylesheet";

function HomeScreen({ navigation }) {
  return (
    <Container>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            style={styles.image}
            source={require("../assets/profile_icon.png")}
          />
        </TouchableOpacity>
        <Text style={styles.text}>Home Screen</Text>
        <Image source={require("../assets/basketballPlayerArms.png")} />
      </View>
      <View style = {styles.bottomView}>         
          <Button
          title="Create Game"
          onPress={() => navigation.navigate("CreateGame")}
        /></View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: "2rem",
    justifyContent: "flex-end",
  },
  text: {
    margin: "1rem",
    marginTop: "7rem",
    fontSize: 30,
    width: "80%",
    textAlign: "center",
  },
  image: {
    width: 50,
    height: 52,
  },
  button: {
    position: "absolute",
    right: "8%",
    top: "13%",
  },
  bottomView:{
    width: '50%', 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 300,
    marginLeft: "6rem"
  },
});

export default HomeScreen;
