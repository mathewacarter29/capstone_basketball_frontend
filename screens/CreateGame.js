import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Button from "../common/Button";
import TextInput from "../common/TextInput";
import Container from "../common/Container";
import RNPickerSelect from "react-native-picker-select";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { MultiSelect } from "react-native-element-dropdown";
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

function CreateGame({ navigation }) {
  const [thisPlayer, setThisPlayer] = useState("");
  const [toInvite, setToInvite] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameLocation, setLocation] = useState("");
  const [gameSkillLevel, setSkillLevel] = useState();
  const [chosenDate, setChosenDate] = useState(new Date());
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedPlayers, setSelected] = useState([]);

  //get all locations to populate the location picker
  async function getLocations() {
    setLoading(true);
    try {
      const allLocations = await DataStore.query(Location);
      //map the name to an array
      const formatLocations = allLocations.map(({ name: value }) => ({
        value,
        label: value,
      }));
      setLocations(formatLocations);
    } catch (error) {
      //if locations don't load for some reason then we should probably display an error message and route back
      console.log(error.message);
    }
    setLoading(false);
  }

  async function getPlayers() {
    setLoading(true);
    let toInvite = [];
    try {
      const allPlayers = await DataStore.query(Player, (p) => p.email.ne(thisPlayer.email));
      allPlayers.map((element) => {
        toInvite.push({label: element.name, value: element.id});
      });
      console.log("to invite: ", toInvite);
      setToInvite(toInvite);
    } catch (error) {
      console.log("Error occurred in getting all players: " + error.message);
    }
  }
  useEffect(() => {
    getPlayer();
    getPlayers();
    getLocations();
  }, []);

  //on change function to set user selected date
  const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || chosenDate;
    setChosenDate(currentDate);
  };

  //gets current user
  async function getPlayer() {
    try {
      const response = await Auth.currentUserInfo();
      const player = await DataStore.query(Player, (p) => p.email.eq(response.attributes.email));
      console.log("This player returned: ", player[0]);
      setThisPlayer(player[0]);

    } catch (error) {
      setShowError(true);
      setErrorMessage(`Error getting player: ${error.message}`);
      console.log("Error getting player: ", error.message);
    }
  }
  //gets the location for the game based on what the user specified
  async function getLocation(locationName) {
    try {
      const location = await DataStore.query(Location, (l) =>
        l.name.eq(locationName)
      );
      return location[0];
    } catch (error) {
      setShowError(true);
      setErrorMessage(`Error getting location: ${error.message}`);
      console.log("Error getting location: ", error.message);
    }
  }

  //saves a name game or returns an error
  async function storeGame() {

    //convert chosen date to epoch timestamp in seconds
    epochNow = Math.floor(Date.now() / 1000);
    epochDate = Math.floor(chosenDate.getTime() / 1000);
    //check if specified datetime is in the past
    if (epochDate <= epochNow) {
      setShowError(true);
      setErrorMessage("Please select a valid future date and time");
      return;
    }
    
    //form field validation
    try {
      const game = await DataStore.save(
        new Game({
          name: gameName ? gameName : "Pickup game at " + location.name,
          description: gameDescription,
          location: gameLocation,
          datetime: epochDate,
          skill_level: gameSkillLevel ? gameSkillLevel : SkillLevel.ANY,
          organizer: thisPlayer.id,
          invited_players: selectedPlayers,
        })
      );
      console.log("Game created: ", game);
      return game;
    } catch (error) {
      setShowError(true);
      setErrorMessage(`Error saving game: ${error.message}`);
      console.log("Error saving game", error.message);
      return;
    }
  }

  //saves game player that represents each and every game and player association
  async function storeGamePlayers(gameId) {
    setLoading(true);
  
    for (let i = 0; i < selectedPlayers.length; i++) {
      try {
        const gamePlayer = await DataStore.save(
          new GamePlayer({
            player_id: selectedPlayers[i],
            game_id: gameId,
            rsvp: Rsvp.PENDING,
            invited: true,
          })
        );
      } catch (error) {
        setLoading(false);
        setShowError(true);
        console.log("error: ", error.message, "storing player: ", selectedPlayers[i]);
      }
    }
    setLoading(false);
  }

  //function to create the game
  async function create() {
    //if no location is selected display error message
    if (gameLocation == "") {
      setShowError(true);
      setErrorMessage("Please select a location");
      return;
    }
    
    // START making API calls
    setLoading(true);

    let newGame = await storeGame();
    if (newGame == null || newGame == undefined) {
      setLoading(false);
      setErrorMessage("Error creating game.")
      setShowError(true);
      return;
    }
    console.log("New created game: ", newGame);

    let gamePlayersStored = await storeGamePlayers(newGame.id);
    console.log("Game Players Stored: ", gamePlayersStored);
    
    setShowError(false);
    navigation.navigate("HomeScreen");
  }


  return (
    // This is the create event form
    <Container goBackTo="HomeScreen" loadingState={loading}>
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
          items={locations}
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
        <MultiSelect
          style={multiSelectStyles.dropdown}
          placeholderStyle={multiSelectStyles.placeholderStyle}
          selectedTextStyle={multiSelectStyles.selectedTextStyle}
          inputSearchStyle={multiSelectStyles.inputSearchStyle}
          iconStyle={multiSelectStyles.iconStyle}
          search
          data={toInvite}
          labelField="label"
          valueField="value"
          placeholder="Invite players"
          searchPlaceholder="Search..."
          value={selectedPlayers}
          onChange={(item) => {
            setSelected(item);
          }}
          selectedStyle={multiSelectStyles.selectedStyle}
        />
        <Text style={styles.otherText}>Enter date and time for the game</Text>
        <RNDateTimePicker
          mode="datetime"
          style={styles.datetimepicker}
          value={chosenDate}
          onChange={changeSelectedDate}
        />
        <Button title="Create Game" onPress={create} />
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

const multiSelectStyles = EStyleSheet.create({
  dropdown: {
    height: "3rem",
    width: "80%",
    borderRadius: "1rem",
    backgroundColor: "white",
    margin: "1rem",
    marginLeft: "1.25 rem",
    color: "#333",
    padding: "rem",
    shadowColor: "#171717",
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});

export default CreateGame;
