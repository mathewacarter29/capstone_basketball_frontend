import React, { useState } from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import RNPickerSelect from "react-native-picker-select";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { DataStore, Auth } from "aws-amplify";
import { SafeAreaView, View } from "react-native";
import {
  Player,
  Game,
  Location,
  GamePlayer,
  Rsvp,
  SkillLevel,
} from "../src/models";
import {
  Text,
  Button,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";
import ErrorPopup from "../common/ErrorPopup";
import TextInput from "../common/TextInput";
import "@azure/core-asynciterator-polyfill";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function CreateGame({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameLocation, setLocation] = useState("");
  const [gameSkillLevel, setSkillLevel] = useState();
  const [chosenDate, setChosenDate] = useState(new Date());
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //on change function to set user selected date
  const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || chosenDate;
    setChosenDate(currentDate);
  };

  //helper function to get everyone but the organizer to test inviting players
  async function getAllPlayers() {
    let userEmail = "Test@gmail.com";
    const allPlayers = await DataStore.query(Player, (p) =>
      p.email.ne(userEmail)
    );
    return allPlayers;
  }

  //gets current user
  async function getPlayer() {
    try {
      const response = await Auth.currentUserInfo();
      const player = await DataStore.query(Player, (p) =>
        p.email.eq(response.attributes.email)
      );
      return player[0];
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
  async function storeGame(gameInfo) {
    //form field validation
    try {
      const game = await DataStore.save(
        new Game({
          name: gameInfo.name,
          description: gameInfo.description,
          location: gameInfo.location,
          datetime: gameInfo.date,
          skill_level: gameInfo.skillLevel,
          organizer: gameInfo.organizer.id,
          location_id: gameInfo.location.id,
        })
      );
      return game;
    } catch (error) {
      setShowError(true);
      setErrorMessage(`Error saving game: ${error.message}`);
      console.log("Error saving game", error.message);
      return;
    }
  }

  //saves game player that represents each and every game and player association
  async function storeGamePlayers(gameId, invitedPlayers) {
    setLoading(true);
    for (let i = 0; i < (await invitedPlayers).length; i++) {
      try {
        const gamePlayer = await DataStore.save(
          new GamePlayer({
            player_id: invitedPlayers[i].id,
            game_id: gameId,
            rsvp: Rsvp.PENDING,
            invited: true,
          })
        );
      } catch (error) {
        setLoading(false);
        console.log("error: ", error, "storing player: ", invitedPlayers[i]);
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
    //convert chosen date to epoch timestamp in seconds
    epochDate = Math.floor(chosenDate.getTime() / 1000);
    //check if specified datetime is in the past
    epochNow = Math.floor(Date.now() / 1000);
    if (epochDate <= epochNow) {
      setShowError(true);
      setErrorMessage("Please select a valid future date and time");
      return;
    }

    // START making API calls
    setLoading(true);
    const location = await getLocation(gameLocation);
    // if location is null, there was an error getting the location. Error logged in getLocation()
    if (!location) {
      setLoading(false);
      return;
    }
    const organizer = await getPlayer();
    // If there is no organizer, there was a problem and an error was logged
    if (!organizer) {
      setLoading(false);
      return;
    }
    //todo: this should eventually be list of players that organizer invites, for now it is just all players in the db
    // const invitedPlayers = await getAllPlayers();
    // invitedPlayers.push(organizer); // add organizer to invited players so that they get added in GamePlayer

    const gameInfo = {
      // if gamename is empty, set it
      name: gameName ? gameName : "Pickup game at " + location.name,
      description: gameDescription,
      date: epochDate,
      // if the skill level is undefined, set it to ANY
      skillLevel: gameSkillLevel ? gameSkillLevel : SkillLevel.ANY,
      organizer: organizer,
      location: location,
    };
    let newGame = await storeGame(gameInfo);
    if (newGame == null) {
      setLoading(false);
      return;
    }
    setShowError(false);

    //await storeGamePlayers(newGame.id, invitedPlayers);
    navigation.navigate("HomeScreen");
  }

  const navigateBack = () => {
    navigation.navigate("HomeScreen");
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView>
      <TopNavigation
        alignment="center"
        title="Create Game"
        accessoryLeft={renderBackAction}
      />

      <View style={styles.container}>
        <Text style={styles.text} category="h1">
          Let's create a game!
        </Text>

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

        <Text
          style={{ margin: "5%", fontSize: 26, textAlign: "center" }}
          category="p1"
        >
          Enter date and time for the game
        </Text>

        <RNDateTimePicker
          mode="datetime"
          style={styles.datetimepicker}
          value={chosenDate}
          onChange={changeSelectedDate}
        />

        <Button onPress={() => create()}>Create Game</Button>
        {showError && <ErrorPopup errorMessage={errorMessage} />}
      </View>
    </SafeAreaView>
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
    fontSize: 30,
    textAlign: "center",
  },
  datetimepicker: {
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

export default CreateGame;
