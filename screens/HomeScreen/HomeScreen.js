import React from "react";
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

import GameFeed from "./GameFeed";
import Button from "../../common/Button";

import { DataStore } from "aws-amplify";
import {Player, Game, Location, GamePlayer, Rsvp} from "../../src/models";
import '@azure/core-asynciterator-polyfill'; 


async function getPlayerGames() {

  // from auth lib get user details

  // get player object

  // query player by email

  let userEmail = "Test@gmail.com";
  const players = await DataStore.query(Player, (p) => p.email.ne(userEmail) );
  const player = players[0];

  // query GamePlayer to find games player is invited to or created
  const gamePlayers = await DataStore.query(GamePlayer, (gp) => gp.player_id.eq(player.id));

  let userGames = [];
  let startDate = new Date();

  for (let i = 0; i < gamePlayers.length; i++) {
    let game_id = gamePlayers[i].id;
    

    const games = await DataStore.query(Game, (c) => c.game_id.eq(game_id));
    userGames.push(game);
  }

    console.log("games", game[0]);

}

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
  getPlayerGames();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Image
          style={styles.image}
          source={require("../../assets/profile_icon.png")}
        />

        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <GameFeed data={DATA} />
      </View>
      <View style = {styles.bottomView}>         
          <Button
          title="Create Game"
          onPress={() => navigation.navigate("CreateGame")}
        /></View>

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
  button: {
    position: "absolute",
    right: "4%",
    top: "4%",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 52,
  },
  innerContainer: {
    height: "78%",
    marginTop: "6.5rem",
  },
});

export default HomeScreen;
