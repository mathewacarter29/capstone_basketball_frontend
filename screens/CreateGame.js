import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import EStyleSheet, { value } from "react-native-extended-stylesheet";
import Button from "../common/Button";
import LoadingScreen from "../common/LoadingScreen";
import TextInput from "../common/TextInput";
import Container from "../common/Container";
import RNPickerSelect from "react-native-picker-select";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { DataStore, Auth } from "aws-amplify";
import {Player, Game, Location, GamePlayer, Rsvp} from "../src/models";
import ErrorPopup from "../common/ErrorPopup";
import '@azure/core-asynciterator-polyfill';

function CreateGame({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [ gameName, setGameName] = useState("");
    const [ gameDescription, setGameDescription] = useState("");
    const [ gameLocation, setLocation] = useState("");
    const [ gameSkillLevel, setSkillLevel] = useState("");
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

//on change function to set user selected date 
const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || chosenDate;
    setChosenDate(currentDate);
}

//helper function to get everyone but the organizer to test inviting players
async function getAllPlayers() {
  let userEmail = "Test@gmail.com";
  const allPlayers = await DataStore.query(Player, (p) => p.email.ne(userEmail) );
  return allPlayers;
}

//gets current user
async function getPlayer(){
    response = await Auth.currentUserInfo();
    const player = await DataStore.query(Player, (p) => p.email.eq(response.attributes.email));
    return player[0];
}
//gets the location for the game based on what the user specified 
async function getLocation(locationName) {
  const location = await DataStore.query(Location, (l) => l.name.eq(locationName));
  return location;
}

//saves a name game or returns an error
async function storeGame(gameName, gameDescription, epochDate, gameSkillLevel, organizer, location) {

    //form field validation
    // if game name is blank default name is generated
    if([gameName].includes("")){
        gameName = "Pickup game at " + location[0].name;
    }
    //if no game description is provided then set empty string
    if([gameDescription].includes("")){
        gameDescription = "";
    }
    //if no location is selected display error message
    if([gameLocation].includes("")){
        setShowError(true);
        setErrorMessage("Please select a location");
        return;
    }
    //if gameskilllevel is not specified set to ANY as default
    if([gameSkillLevel].includes("")){
        gameSkillLevel = "ANY";
    }
    //check if specified datetime is in the past 
    epochNow = Math.floor(Date.now() / 1000);
    if(epochDate <= epochNow){
        setShowError(true);
        setErrorMessage("Please select a valid future date and time");
        return;
    }
    setShowError(false);
    navigation.navigate("HomeScreen")
    try {
    const game = await DataStore.save(
      new Game({
        name: gameName,
        description: gameDescription,
        location: (await location),
        datetime: epochDate,
        skill_level: gameSkillLevel,
        organizer: (await organizer).id, 
        location_id: location.id
      })
    );
    return game;
  }

  catch (error) {
    console.log('Error saving game', error);
    return null;
  }

}

//saves game player that represents each and every game and player association
async function storeGamePlayers(gameId, invitedPlayers) {

    for (let i = 0; i < (await invitedPlayers).length; i++) {
      try {
        const gamePlayer = await DataStore.save(
          new GamePlayer({
            player_id: invitedPlayers[i].id,
            game_id: gameId,
            rsvp: Rsvp.PENDING,
            invited: true
          })
        )
      }
      catch (error) {
        console.log("error: ", error, "storing player: ", invitedPlayers[i]);
      }
    }
}

//function to create the game
async function create(){
    setLoading(true);
    //convert chosen date to epoch timestamp in seconds
    epochDate = Math.floor(chosenDate.getTime() / 1000);

    const organizer = await getPlayer();
    console.log("organizer: ", organizer);
    const location = await getLocation(gameLocation);
    //todo: this should eventually be list of players that organizer invites, for now it is just all players in the db
    const invitedPlayers = await getAllPlayers();
    invitedPlayers.push(organizer); // add organizer to invited players so that they get added in GamePlayer

    let newGame = await storeGame(gameName, gameDescription, epochDate, gameSkillLevel, organizer, location);

    if (newGame == null) {
      console.log("Error creating game");
      return;
    }

    await storeGamePlayers(newGame.id, invitedPlayers);
    setLoading(false);
}

return (
    // This is the create event form
    <Container>
      {loading && <LoadingScreen />}
      <View style={styles.container}>
        <Text style={styles.text}>Let's create a game!</Text>
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
                { label: "Beginner", value: "BEGINNER" },
                { label: "Intermediate", value: "INTERMEDIATE" },
                { label: "Experienced", value: "EXPERIENCED" },
                { label: "Any", value: "ANY" },
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
        {showError && <ErrorPopup errorMessage={errorMessage} />}
        <Button title="Create Game" onPress={() => create() } />
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
  }
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
      borderColor: 'blue',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });

export default CreateGame;
