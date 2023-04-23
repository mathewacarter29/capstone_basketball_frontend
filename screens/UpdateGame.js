import React, { useEffect, useState } from "react";
import { View, SafeAreaView } from "react-native";
import EStyleSheet, { value } from "react-native-extended-stylesheet";
import { MultiSelect } from "react-native-element-dropdown";
// import Button from "../common/Button";
import LoadingScreen from "../common/LoadingScreen";
import TextInput from "../common/TextInput";

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
import {
  Text,
  Button,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";
import ErrorPopup from "../common/ErrorPopup";
import "@azure/core-asynciterator-polyfill";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function UpdateGame({ route, navigation }) {
  const game = route.params.game;
  const player = route.params.player;
  const [toInvite, setToInvite] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState(game.name);
  const [gameDescription, setGameDescription] = useState(game.description);
  const [gameLocation, setLocation] = useState("");
  const [gameSkillLevel, setSkillLevel] = useState(game.skill_level);
  const [chosenDate, setChosenDate] = useState(new Date(game.datetime * 1000));
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedPlayers, setSelected] = useState();

  useEffect(() => {
    // This needs to be async so we can wait for results before rendering
    (async () => {
      setLoading(true);
      await getPlayers();
      await getLocations();

      setLoading(false);
    })();
  }, []);

  async function getPlayers() {
    let toInvite = [];
    try {
      const allPlayers = await DataStore.query(Player, (p) =>
        p.email.ne(player.email)
      );
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
        Game.copyOf(game, (updated) => {
          (updated.name = gameName),
            (updated.description = gameDescription),
            (updated.skill_level = gameSkillLevel),
            (updated.datetime = epochDate);
        })
      );
      setLoading(false);
      // navigation.navigate("GameDetails", {game: item , player: player});
      let item = {
        game: updatedGame,
        player: player,
      };

      navigation.navigate("GameDetails", { item });
    } catch (error) {
      setErrorMessage("Error updating game details");
      setShowError(true);
      setLoading(false);
      console.log("Error updating game details");
    }
  }

  const navigateBack = () => {
    let item = {
      game: game,
      player: player,
    };

    navigation.navigate("GameDetails", { item });
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    // This is the create event form
    <SafeAreaView>
      <TopNavigation
        alignment="center"
        title="Update Game"
        accessoryLeft={renderBackAction}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Update {gameName}</Text>
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
          placeholder="Invite more players"
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
        <Button onPress={update}>Update Game</Button>
        {showError && <ErrorPopup errorMessage={errorMessage} />}
      </View>
      <View style={{ flex: 1, backgroundColor: "lightgray" }}></View>
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

export default UpdateGame;
