import { React, useEffect, useState } from "react";
import { Text, TouchableOpacity, Image, View, ScrollView } from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";
import LoadingScreen from "../../common/LoadingScreen";

import GameFeed from "./GameFeed";
import MapScreen from "./MapScreen";

import { Auth } from "aws-amplify";
import { DataStore } from "aws-amplify";
import { Player, Game, Location, GamePlayer, Rsvp } from "../../src/models";
import "@azure/core-asynciterator-polyfill";
import Container from "../../common/Container";

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
    in: [
      "Abir",
      "Mat",
      "Peyton",
      "Rishi",
      "Parker",
      "Parker",
      "Parker",
      "Parker",
    ],
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
    in: ["Abir"],
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

  const [data, dataSet] = useState([]);
  const [loading, setLoading] = useState(false);

  const [middleView, setMiddleView] = useState("GameFeed");

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}

      {/*PROFILE ICON*/}
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

      {/*CREATE GAME*/}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateGame")}
      >
        <Image
          style={styles.image}
          source={require("../../assets/plus_icon.png")}
        />
      </TouchableOpacity>

      {/* RENDER LOCATION / FEED*/}
      <View style={styles.innerContainer}>
        {middleView == "GameFeed" && <GameFeed data={DATA} />}
        {middleView == "MapScreen" && <MapScreen />}
      </View>

      {/* BOTTOM NAV BUTTONS */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            middleView == "MapScreen"
              ? styles.selectedNavButton
              : styles.navButton,
            styles.leftNavButton,
          ]}
          onPress={() => {
            setMiddleView("MapScreen");
          }}
        >
          <Text
            style={[
              styles.topText,
              middleView == "MapScreen" ? { color: "lightgray" } : null,
            ]}
          >
            Map View
          </Text>
        </TouchableOpacity>
        <View style={styles.line} />

        <TouchableOpacity
          style={[
            middleView == "GameFeed"
              ? styles.selectedNavButton
              : styles.navButton,
            ,
            styles.rightNavButton,
          ]}
          onPress={() => {
            setMiddleView("GameFeed");
          }}
        >
          <Text
            style={[
              styles.topText,
              middleView == "GameFeed" ? { color: "lightgray" } : null,
            ]}
          >
            {" "}
            Game Feed{" "}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: "1",
  },
  line: {
    width: 1,
    height: "100%",
    backgroundColor: "black",
  },
  profileButton: {
    position: "absolute",
    right: "4%",
    top: "4%",
    alignItems: "center",
  },
  createButton: {
    position: "absolute",
    left: "4%",
    top: "4%",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 52,
  },
  innerContainer: {
    height: "75%",
    marginTop: "6.5rem",
  },
  row: {
    flexDirection: "row",
    borderRadius: "1rem",
    justifyContent: "space-around",
    marginTop: "1rem",
    marginLeft: "2%",
    marginRight: "2%",
    height: "5rem",
    borderWidth: 1,
  },
  topText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: ".5rem",
    paddingTop: ".5rem",
  },
  navButton: {
    backgroundColor: "orange",
    flex: 1,
    justifyContent: "center",
  },
  leftNavButton: {
    borderBottomLeftRadius: "1rem",
    borderTopLeftRadius: "1rem",
  },
  rightNavButton: {
    borderBottomRightRadius: "1rem",
    borderTopRightRadius: "1rem",
  },
  selectedNavButton: {
    backgroundColor: "#b06820",
    flex: 1,
    justifyContent: "center",
  },
});

export default HomeScreen;
