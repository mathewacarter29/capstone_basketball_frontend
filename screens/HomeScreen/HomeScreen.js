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
import Container from "../../common/Container";

function HomeScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [userGames, setUserGames] = useState([]);
  const [playerGames, setPlayerGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thisPlayer, setThisPlayer] = useState([]);
  
  
  async function getPlayerGames(allGames) {

    const authObj = await Auth.currentUserInfo();
    // console.log("Auth Object returned: ", authObj);
    const userEmail = authObj.attributes.email;
  
    // get Player object from email
    const players = await DataStore.query(Player, (p) =>
      p.email.eq(userEmail)
    );
    const player = players[0];
    setThisPlayer(player);
    // console.log("Player returned: ", player);

    // console.log("Player id: ", player.id);
  
    // query GamePlayer to find games player is invited to or created
    const gamePlayers = await DataStore.query(GamePlayer, (gp) =>
      gp.player_id.eq(player.id)
    );
    //console.log("Game players: ", gamePlayers);
    const userGameIds = gamePlayers.map((gamePlayer) => {
      return gamePlayer.id
    });
    console.log("ALL GAMES: ", allGames);
    //console.log("user game ids: ", userGameIds);
    const userGames = allGames.filter((game) => {          
      return userGameIds.includes(game.id);
    });
     console.log("userGames: ", userGames);
  
     setPlayerGames(userGames);
  
  }

  useEffect(() => {
    /**
     * This keeps `Games` fresh.
     * if another user makes a change to the game details, 
     * we will get that change reflected here with our subscriber
     */
    const subscriber = DataStore.observeQuery(Game, (c) =>
      c.datetime.gt(Math.floor(Date.now() / 1000))
    ).subscribe(({ items }) => {
      console.log("items:" ,  items);
      setGames(items);
      setUserGames(getPlayerGames(items));
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, []);

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
        onPress={() => navigation.navigate("CreateGame", {thisPlayer})}
      >
        <Image
          style={styles.image}
          source={require("../../assets/plus_icon.png")}
        />
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <GameFeed data={{games: games, thisPlayer: thisPlayer}} />
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
