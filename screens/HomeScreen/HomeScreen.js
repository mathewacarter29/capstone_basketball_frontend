import { React, useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import LoadingScreen from "../../common/LoadingScreen";

import GameFeed from "./GameFeed";
import Button from "../../common/Button";

import { Auth } from "aws-amplify";
import { DataStore } from "aws-amplify";
import { Player, Game, Location, GamePlayer, Rsvp } from "../../src/models";
import "@azure/core-asynciterator-polyfill";

//const [loading, setLoading] = useState(false);
let userGames;
// let DATA = [];

const DATA = [
  {
    id: "1",
    name: "First Game",
    organizer: "Mat",
    location: "The Village Basketball Courts",
    date: "6/30/2023",
    time: "12:00 PM",
    in: ["Abir", "Mat", "Peyton", "Rishi", "Parker"],
    out: ["Seyam", "David"],
    description: "This is a test description to see if the field will show up",
  },
  {
    id: "2",
    name: "Second Game",
    organizer: "Peyton",
    location: "McCommas",
    date: "6/29/2023",
    time: "10:00 AM",
    in: ["Abir", "Mat", "Peyton"],
    out: ["Seyam", "David", "Rishi", "Parker"],
  },
  {
    id: "3",
    name: "Third Game",
    organizer: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
  {
    id: "4",
    name: "Forth Game",
    organizer: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
  {
    id: "5",
    name: "Fifth Game",
    organizer: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
];

function HomeScreen({ navigation }) {
  const [data, dataSet] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   //this function will get all games this user is assoicated with to populate their game feed screen
  //   //*still in progress
  //   // TODO: to get all games, just make a query with the model name as the arg: DataStore.query(Game)
  //   async function getPlayerGames() {
  //     setLoading(true);
  //     // from auth lib get user details
  //     // get player object
  //     // query player by email
  //     let userEmail = "test@gmail.com";
  //     const authObj = await Auth.currentUserInfo();
  //     console.log("Auth Object returned: ", authObj);
  //     // const userEmail = authObj.attributes.email;

  //     // get Player object from email
  //     const players = await DataStore.query(Player, (p) =>
  //       p.email.eq(userEmail)
  //     );
  //     const player = players[0];
  //     console.log("Player returned: ", player);
  //     // query GamePlayer to find games player is invited to or created
  //     const gamePlayers = await DataStore.query(GamePlayer, (gp) =>
  //       gp.player_id.eq(player.id)
  //     );
  //     //const userGames = [];
  //     let startDate = new Date();

  //     for (let i = 0; i < gamePlayers.length; i++) {
  //       let game_id = gamePlayers[i].game_id;
  //       //use this game_id to get the corresponding game
  //       userGames = await DataStore.query(Game, (c) => c.id.eq(game_id));
  //       //userGames.push(Game);
  //       //as each game is retrieved, add it to the data array
  //       //DATA[i] = {id: userGames[i].id}
  //     }
  //     dataSet(userGames);
  //     setLoading(false);
  //   }
  //   getPlayerGames();
  // }, []);
  // if (!data) {
  //   return null;
  // }

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Image
          style={styles.image}
          source={require("../../assets/profile_icon.png")}
        />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateGame")}
      >
        <Image
          style={styles.image}
          source={require("../../assets/plus_icon.png")}
        />
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <GameFeed data={DATA} />
      </View>
    </View>
  );
}

const styles = EStyleSheet.create({
  wrapper: {
    height: "80%",
  },
  container: {
    flex: "1",
    backgroundColor: "lightgray",
    alignItems: "center",
  },
  topText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: "1rem",
  },
  profileButton: {
    position: "absolute",
    right: "4%",
    top: "6%",
    alignItems: "center",
  },
  createButton: {
    position: "absolute",
    left: "4%",
    top: "6%",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 52,
  },
  innerContainer: {
    height: "78%",
    marginTop: "7.5rem",
  },
});

export default HomeScreen;
