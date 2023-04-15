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

function HomeScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [userGames, setUserGames] = useState([]);
  const [playerGames, setPlayerGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thisPlayer, setThisPlayer] = useState([]);

  async function getPlayerGames(allGames) {
    // NEED TRY CATCH AROUND ALL API CALLS
    try {
      const authObj = await Auth.currentUserInfo();
      const userEmail = authObj.attributes.email;

      // get Player object from email
      const players = await DataStore.query(Player, (p) =>
        p.email.eq(userEmail)
      );
      const player = players[0];
      setThisPlayer(player);

      // query GamePlayer to find games player is invited to or created
      const gamePlayers = await DataStore.query(GamePlayer, (gp) =>
        gp.player_id.eq(player.id)
      );
      const userGameIds = gamePlayers.map((gamePlayer) => {
        return gamePlayer.id;
      });
      const userGames = allGames.filter((game) => {
        return userGameIds.includes(game.id);
      });

      setPlayerGames(userGames);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  useEffect(() => {
    /**
     * This keeps `Games` fresh.
     * if another user makes a change to the game details,
     * we will get that change reflected here with our subscriber
     */
    // TRY CATCH AROUND API CALLS

    setLoading(true);
    // LOAD WHILE PERFORMING API CALLS
    const subscriber = DataStore.observeQuery(Game, (c) =>
      c.datetime.gt(Math.floor(Date.now() / 1000))
    ).subscribe(({ items }) => {
      setGames(items);
      setUserGames(getPlayerGames(items));
    });

    setLoading(false);

    return () => {
      subscriber.unsubscribe();
    };
  }, []);

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
        onPress={() => navigation.navigate("CreateGame", { thisPlayer })}
      >
        <Image
          style={styles.image}
          source={require("../../assets/plus_icon.png")}
        />
      </TouchableOpacity>

      {/* RENDER LOCATION / FEED*/}
      <View style={styles.innerContainer}>
        {middleView == "GameFeed" && (
          <GameFeed data={{ games: games, thisPlayer: thisPlayer }} />
        )}
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
            Game Feed
          </Text>
        </TouchableOpacity>
        {/* <GameFeed data={{ games: games, thisPlayer: thisPlayer }} /> */}
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
    zIndex: 1,
  },
  createButton: {
    position: "absolute",
    left: "4%",
    top: "5%",
    alignItems: "center",
    zIndex: 1,
  },
  image: {
    width: 50,
    height: 52,
  },
  innerContainer: {
    height: "82%",
    marginTop: "3.5rem",
  },
  row: {
    flexDirection: "row",
    borderRadius: "1rem",
    justifyContent: "space-around",
    marginTop: "1rem",
    marginLeft: "2%",
    marginRight: "2%",
    height: "4rem",
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
