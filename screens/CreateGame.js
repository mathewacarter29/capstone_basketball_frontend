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
import { DataStore } from "aws-amplify";
import { Game } from "../src/models";
import '@azure/core-asynciterator-polyfill';
import { SDK } from 'aws-sdk';


function CreateGame({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [ gameName, setName] = useState("");
    const [chosenDate, setChosenDate] = useState(new Date());
    const [ gameLocation, setLocation] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

// useEffect(() => {
//     const fetchGames = async () => {
//         const res = await API.graphql({query: listGames})
//         console.log(res)
//     }
//     fetchGames()
// }, [])

// async function handleSubmit(){
//     try{
//         setLoading(true);
//         await API.graphql({
//             query: createGame,
//             variables: {
//                 input: {
//                     name: gameName,
//                     datetime: dateTime,
//                     location: gameLocation,
//                 },
//             },
//         })

//     } catch(e){
//         setLoading(false);
//         setShowError(true);
//         setErrorMessage(e.message);
//         return;
//     }
//     setLoading(false);
//     setShowError(false);
// }
async function handleSubmit(){
    const isoDate = chosenDate.toISOString(); // Convert it to an ISO datetime string
    const awsDateTime = new SDK().util.date.iso8601(isoDate); // Convert it to an AWSDateTime object
    try {
        const game = await DataStore.save(
          new Game({
            name: gameName,
            location: gameLocation,
            datetime: awsDateTime,
          })
        );
        console.log('Post saved successfully!', game);
      } catch (error) {
        console.log('Error saving game', error);
      }
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
       <RNDateTimePicker 
       style={{flex: 1}}
       value={chosenDate} onDateChange={setChosenDate}/>
       <RNPickerSelect
            value={gameLocation}
            onValueChange={(value) => setLocation(value)}
            //onValueChange={(value) => console.log(value)}
            placeholder={{ label: "Please select a location", value: null }}
            items={[
                { label: "McComas Gym", value: "McComas Gym" },
                { label: "Village Courts", value: "Village Courts" },
                { label: "Cassell Colisuem", value: "Cassell Coliseum" },
            ]}
            style={customPickerStyles}
        />
        <Button onPress={() => handleSubmit()} title="Create Game" />
      </View>
      <View style={{ flex: 1, backgroundColor: "lightgray" }}></View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: "10rem",
    justifyContent: "flex-end",
  },
  text: {
    margin: "1rem",
    fontSize: 30,
    width: "80%",
    textAlign: "center",
  },
  clickableText: {
    color: "darkorange",
    fontSize: 15,
    textDecorationLine: "underline",
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
      borderColor: 'blue',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });

export default CreateGame;
