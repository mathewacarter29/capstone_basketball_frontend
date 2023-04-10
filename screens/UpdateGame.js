import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import EStyleSheet, { value } from "react-native-extended-stylesheet";
import Button from "../common/Button";
import LoadingScreen from "../common/LoadingScreen";
import TextInput from "../common/TextInput";
import Container from "../common/Container";
import RNPickerSelect from "react-native-picker-select";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { DataStore, Auth } from "aws-amplify";
import {
  Player,
  Game,
  Location,
  GamePlayer,
  Rsvp,
  SkillLevel,
} from "../src/models";
import ErrorPopup from "../common/ErrorPopup";
import "@azure/core-asynciterator-polyfill";

function UpdateGame({ route, navigation }) {
  const game  = route.params.game;
  const player = route.params.player;
  console.log("update game: ", game);
  console.log("route params update", route.params)
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState(game.name);
  const [gameDescription, setGameDescription] = useState(game.description);
  const [gameLocation, setLocation] = useState("");
  const [gameSkillLevel, setSkillLevel] = useState(game.skill_level);
  const [chosenDate, setChosenDate] = useState(new Date());
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //on change function to set user selected date
  const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || chosenDate;
    setChosenDate(currentDate);
  };

 
  //function to update the game
  async function update() {

    epochDate = Math.floor(chosenDate.getTime() / 1000);
    setLoading(true);
    try {
      const updatedGame = await DataStore.save(
        Game.copyOf(game, updated => {
          updated.name = gameName,
          updated.description = gameDescription,
          updated.skill_level = gameSkillLevel,
          updated.datetime = epochDate
        })
      );
      setLoading(false);
      // navigation.navigate("GameDetails", {game: item , player: player});
      let item = {
        game: updatedGame,
        player: player
      }
      
      navigation.navigate("GameDetails", { item });

    } catch (error) {
      setErrorMessage("Error updating game details");
      setShowError(true);
      setLoading(false);
      console.log("Error updating game details");
    }
    
  }

  return (
    // This is the create event form
    <Container>
      {loading && <LoadingScreen />}
      <View style={styles.container}>
        <Text style={styles.text}>Update Your Game</Text>
        <TextInput
          value={gameName}
          placeholder="Enter a name for the game"
          onChangeText={(text) => setGameName(text)}
        ></TextInput>
        <TextInput
          value={gameDescription}
          placeholder="Enter a description for the game"
          onChangeText={(text) => setGameDescription(text)}
        ></TextInput>
        <RNPickerSelect
          value={gameLocation}
          onValueChange={(value) => setLocation(value)}
          placeholder={{ label: "Please select a location", value: null }}
          items={[
            { label: "McComas Hall", value: "McComas Hall" },
            { label: "Lee Courts", value: "Lee Courts" },
            { label: "Old Blacksburg HS", value: "Old Blacksburg HS" },
            { label: "Cassell Colisuem", value: "Cassell Coliseum" },
          ]}
          style={customPickerStyles}
        />
        <RNPickerSelect
          value={gameSkillLevel}
          onValueChange={(value) => setSkillLevel(value)}
          placeholder={{ label: "Please select a skill level", value: null }}
          items={[
            { label: "Beginner", value: SkillLevel.BEGINNER },
            { label: "Intermediate", value: SkillLevel.INTERMEDIATE },
            { label: "Experienced", value: SkillLevel.EXPERIENCED },
            { label: "Any", value: SkillLevel.ANY },
          ]}
          style={customPickerStyles}
        />
        <Text style={styles.otherText}>Enter date and time for the game</Text>
        <RNDateTimePicker
          mode="datetime"
          style={styles.datetimepicker}
          value={chosenDate}
          onChange={changeSelectedDate}
        />
        <Button title="Update Game" onPress={() => update()} />
        {showError && <ErrorPopup errorMessage={errorMessage} />}
      </View>
      <View style={{ flex: 1, backgroundColor: "lightgray" }}></View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: "5rem",
    justifyContent: "flex-end",
  },
  text: {
    margin: "1rem",
    fontSize: 30,
    width: "80%",
    textAlign: "center",
  },
  otherText: {
    margin: "1rem",
    fontSize: 20,
  },
  clickableText: {
    color: "darkorange",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  datetimepicker: {
    flex: 1,
    margin: "1rem",
  },
});

const customPickerStyles = EStyleSheet.create({
  inputIOS: {
    height: "3rem",
    width: "80%",
    borderRadius: "1rem",
    backgroundColor: "white",
    margin: "1rem",
    marginLeft: "2.5rem",
    color: "#333",
    padding: "rem",
    shadowColor: "#171717",
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default UpdateGame;
