import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Button from "../common/Button";
import LoadingScreen from "../common/LoadingScreen";
import ErrorPopup from "../common/ErrorPopup";
import TextInput from "../common/TextInput";
import Container from "../common/Container";
import { API } from "aws-amplify";
import RNPickerSelect from "react-native-picker-select";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DataStore } from "aws-amplify";
import { Game } from "../src/models";
import {Location} from "../src/models";
import '@azure/core-asynciterator-polyfill';
import { SDK } from 'aws-sdk';
import { name } from "./LogIn";


function CreateGame({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [ gameName, setName] = useState("");
    const [ gameDescription, setGameDescription] = useState("");
    const [chosenDate, setChosenDate] = useState(new Date());
    const [ gameLocation, setLocation] = useState("");
    const [ gameMinSize, setMinSize] = useState("");
    const [ gameSkillLevel, setSkillLevel] = useState("");


async function getLocation(locationName) {
  const locations = await DataStore.query(Location, (l) => l.nam.eq(locationName));
  return locations[0];
}

async function create(){
    console.log(chosenDate);
    const location = getLocation(gameLocation);
    //const isoDate = chosenDate.toISOString(); // Convert it to an ISO datetime string
    //const awsDateTime = new SDK().util.date.iso8601(isoDate); // Convert it to an AWSDateTime object
    
    // try {
    //     const game = await DataStore.save(
    //       new Game({
    //         name: gameName,
    //         description: gameDescription,
    //         location: location,
    //         datetime: chosenDate.toISOString(),
    //         min_size: parseInt(gameMinSize),
    //         skill_level: parseInt(gameSkillLevel),
    //         player_ids: ["1","2","3"],
    //         //player_ids: [{"id":1}, {"id":2}],
    //         organizer: "organizer", //populate automatically with the name of the user creating the game 
    //         locationID: "location1" 
    //       })
    //     );
    //     console.log('Game saved successfully!', game);
    //   } catch (error) {
    //     console.log('Error saving game', error);
    //   }
}

return (
    // This is gonna be the sign up form
    <Container>
      {loading && <LoadingScreen />}
      <View style={styles.container}>
        <Text style={styles.text}>Let's create a game!</Text>
        <TextInput
          value={gameName}
          placeholder="Enter a name for the game"
          onChangeText={(text) => setName(text)}
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
            value={chosenDate} onDateChange={setChosenDate}/>
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
