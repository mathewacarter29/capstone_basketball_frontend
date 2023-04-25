import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import EStyleSheet from "react-native-extended-stylesheet";
import RNPickerSelect from "react-native-picker-select";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { MultiSelect } from "react-native-element-dropdown";
import { DataStore, Auth } from "aws-amplify";
import { SafeAreaView, View, ScrollView} from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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


function CreateGame({ route, navigation }) {
  const thisPlayer = route.params.thisPlayer;
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
    try {
      const allLocations = await DataStore.query(Location);
      //map the name to an array
      const formatLocations = allLocations.map(({ name: value }) => ({
        value,
        label: value,
      }));
      setLocations(formatLocations);
      return true;
    } catch (error) {
      setErrorMessage("Error retrieving locations");
      setShowError(true);
      //if locations don't load for some reason then we should probably display an error message and route back
      console.log(error.message);
      setLoading(false);
      return false;
    }
  }

  async function getPlayers() {
    let toInvite = [];
    try {
      const allPlayers = await DataStore.query(Player);
      // const allPlayers = await DataStore.query(Player, (p) =>
      //   p.email.ne(thisPlayer.email)
      allPlayers.map((element) => {
        toInvite.push({ label: element.name, value: element.id });
      });
      setToInvite(toInvite);
      return true;
    } catch (error) {
      setLoading(false);
      setErrorMessage("Invited invalid player");
      setShowError(true);
      console.log("Error occurred in getting all players: " + error.message);
      return false;
    }
  }

  useEffect(() => {
    // This needs to be async so we can wait for results before rendering
    (async () => {
      setLoading(true);
      await getPlayers();
      await getLocations();

      setLoading(false);
    })();
  }, []);

  //on change function to set user selected date
  const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || chosenDate;
    setChosenDate(currentDate);
  };

  //saves a name game or returns an error
  async function storeGame() {
    //form field validation
    try {
      const game = await DataStore.save(
        new Game({
          name: gameName ? gameName : "Pickup game at " + gameLocation,
          description: gameDescription,
          location: gameLocation,
          datetime: Math.floor(chosenDate.getTime() / 1000),
          skill_level: gameSkillLevel ? gameSkillLevel : SkillLevel.ANY,
          organizer: thisPlayer.id,
          invited_players: selectedPlayers,
        })
      );
      return game;
    } catch (error) {
      setShowError(true);
      setErrorMessage(`Error saving game: ${error.message}`);
      console.log("Error saving game", error.message);
      setLoading(false);
      return;
    }
  }

  //method to send push notificatons for   game invitations
  async function sendGameInvitationNotification(expoPushToken, invitedGame) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Game Invitation",
      body: "You have been invited to a game!",
      data: { item: { game: invitedGame, player: thisPlayer } },
    };
    //console.log(message);
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  //saves game player that represents each and every game and player association
  async function storeGamePlayers(gameId) {
    try {
      const gamePlayer = await DataStore.save(
        new GamePlayer({
          player_id: thisPlayer.id,
          game_id: gameId,
          rsvp: Rsvp.ACCEPTED,
          invited: true,
        })
      );
    } catch (error) {
      setLoading(false);
      setShowError(true);
      console.log("Error storing game organizer");
      setErrorMessage(`Error storing game organizer`);
      return false;
    }
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
        //send invitation notifications now
        //query player table to get the invited player and grab their expo token
        const recepient = await DataStore.query(Player, selectedPlayers[i]);
        //also send game information for routing
        const invitedGame = await DataStore.query(Game, gameId);
        sendGameInvitationNotification(
          recepient.expo_notification_token,
          invitedGame
        );
      } catch (error) {
        setLoading(false);
        setShowError(true);
        console.log(
          "error: ",
          error.message,
          "storing player: ",
          selectedPlayers[i]
        );
        setErrorMessage(`Error storing player: ${selectedPlayers[i]}`);
        return false;
      }
    }
    return true;
  }

  //function to create the game
  async function create() {
    //console.log(thisPlayer);
    // do input validation BEFORE API calls
    //if no location is selected display error message
    if (gameLocation == "") {
      setShowError(true);
      setErrorMessage("Please select a location");
      return;
    }

    //convert chosen date to epoch timestamp in seconds
    epochNow = Math.floor(Date.now() / 1000);
    epochDate = Math.floor(chosenDate.getTime() / 1000);
    //check if specified datetime is in the past
    if (epochDate <= epochNow) {
      setShowError(true);
      setErrorMessage("Please select a valid future date and time");
      return;
    }

    // START making API calls
    setLoading(true);

    let newGame = await storeGame();
    // NEED validation on if API calls go through before moving on to other API calls
    if (typeof newGame == "undefined") return;

    if (!(await storeGamePlayers(newGame.id))) return;

    setShowError(false);
    setLoading(false);
    navigation.navigate("HomeScreen");
  }

  const navigateBack = () => {
    navigation.navigate("HomeScreen");
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView>
      <TopNavigation
        style={styles.topBar}
        alignment="center"
        title="Create Game"
        accessoryLeft={renderBackAction}
      />

      <ScrollView contentContainerStyle={styles.container}>
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

        <Text
          style={{fontSize: 26, textAlign: "center" }}
          category="p1"
        >
          Game Date and Time
        </Text>

        <RNDateTimePicker
          mode="datetime"
          style={styles.datetimepicker}
          value={chosenDate}
          onChange={changeSelectedDate}
        />
        <Button onPress={create}>Create Game</Button>
        {showError && <ErrorPopup errorMessage={errorMessage} />}
      </ScrollView>
    </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
  topBar: {
    marginTop: "1rem"
  },
  container: {
    alignItems: "center",
    paddingTop: "1rem",
    justifyContent: "flex-end",
  },
  text: {
    margin: ".2rem",
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
