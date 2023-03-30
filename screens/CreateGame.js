import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import EStyleSheet, { value } from "react-native-extended-stylesheet";
import Button from "../common/Button";
import LoadingScreen from "../common/LoadingScreen";
import ErrorPopup from "../common/ErrorPopup";
import TextInput from "../common/TextInput";
import Container from "../common/Container";
import { Auth } from "aws-amplify";
import RNPickerSelect from "react-native-picker-select";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { DataStore } from "aws-amplify";
import {Player, Game, Location, GamePlayer, Rsvp} from "../src/models";
import '@azure/core-asynciterator-polyfill';

function CreateGame({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [ gameName, setGameName] = useState("");
    const [ gameDescription, setGameDescription] = useState("");
    const [ gameLocation, setLocation] = useState("");
    const [ gameMinSize, setMinSize] = useState("");
    const [ gameSkillLevel, setSkillLevel] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [chosenDate, setChosenDate] = useState(new Date());

const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || chosenDate;
    setChosenDate(currentDate);
}

async function getAllPlayers() {
  let userEmail = "Test@gmail.com";
  const allPlayers = await DataStore.query(Player, (p) => p.email.ne(userEmail) );
  console.log("All players: ", allPlayers);
  return allPlayers;
}

async function getPlayer() {
  // use auth to get use info

  // use auth info to get Player entry

  // todo: get this from auth
  let userEmail = "Test@gmail.com";
   
  const players = await DataStore.query(Player, (p) => p.email.eq(userEmail));
  console.log("Players returned from player: ", players)
  return players[0];
}


async function getLocation(locationName) {
  const locations = await DataStore.query(Location);
  // const locations = await DataStore.query(Location, (l) => l.name.eq(locationName));
  console.log("Locations returned: ", locations)
  return locations[0];
}

async function storeGame(gameName, gameDate, gameTime, gameMinSize, gameSkillLevel, organizer, location) {
  try {
    const game = await DataStore.save(
      new Game({
        name: gameName,
        description: gameDescription,
        location: (await location),
        date: gameDate,
        time: gameTime,
        min_size: parseInt(gameMinSize),
        skill_level: parseInt(gameSkillLevel),
        organizer: (await organizer).id, //populate automatically with the name of the user creating the game
        location_id: location.id
      })
    );
    console.log('Game saved successfully!', game);
    return game;
  }

  catch (error) {
    console.log('Error saving game', error);
    return null;
  }

}

async function storeGamePlayers(gameId, invitedPlayers) {


    console.log("storeGameplayer: gameId: ", gameId)
    for (let i = 0; i < (await invitedPlayers).length; i++) {
      console.log("invited player i: ", invitedPlayers[i]);
      try {
        const gamePlayer = await DataStore.save(
          new GamePlayer({
            player_id: invitedPlayers[i].id,
            game_id: gameId,
            rsvp: Rsvp.PENDING,
            invited: true
          })
        )
        console.log("Saved GamePlayer: ", gamePlayer);
      }
      catch (error) {
        console.log("error: ", error, "storing player: ", invitedPlayers[i]);
      }
    }
  }

  
async function create(gameId, invtiedPlayers){
    
    //query for email to get player id
    //const players = await DataStore.query(Player);
    //console.log("ALL Players: ", players);

    //const locations = await DataStore.query(Location);
    //console.log("All locations: ", locations);
  
    const gameDate = (chosenDate.getMonth() + 1) + '/' + chosenDate.getDate() + '/' +  chosenDate.getFullYear();
    const gameTime = chosenDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    const organizer = await getPlayer();

    // todo: this should be list of players that organizer invites
    const invitedPlayers = await getAllPlayers();
    invitedPlayers.push(organizer); // add organizer to invited players so that they get added in GamePlayer
    console.log("invited players: ", invitedPlayers)

    const location = await getLocation(gameLocation);

    let newGame = await storeGame(gameName, gameDate, gameTime, gameMinSize, gameSkillLevel, organizer, location);

    if (newGame == null) {
      console.log("Error creating game");
      return;
    }

    storeGamePlayers(newGame.id, invitedPlayers);
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
            //eventually populate items from location database 
            items={[
                { label: "McComas Hall", value: "McComas Gym" },
                { label: "Lee Courts", value: "Lee Courts" },
                { label: "Old Blacksburg HS", value: "Old Blacksburg HS" },
                { label: "Cassell Colisuem", value: "Cassell Coliseum" },
            ]}
            style={customPickerStyles}
        />
        <TextInput
          keyboardType="numeric"
          value={gameMinSize}
          placeholder="Enter a minimum size for this game"
          onChangeText={(text) => setMinSize(text)}
        ></TextInput>
        <TextInput
          keyboardType="numeric"
          value={gameSkillLevel}
          placeholder="Enter a skill level for the game" //detail regarding skill level
          onChangeText={(text) => setSkillLevel(text)}
        ></TextInput>
        <Text style={styles.otherText}>Enter date and time for the game</Text>
        <RNDateTimePicker 
            mode="datetime"
            style={styles.datetimepicker}
            value={chosenDate}
            onChange={changeSelectedDate}
        /> 
        <Button title="Create Game" onPress={() => create()} />
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
