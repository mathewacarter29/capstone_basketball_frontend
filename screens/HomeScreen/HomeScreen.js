import { React, useState, useEffect } from "react";
import EStyleSheet from "react-native-extended-stylesheet";

import { 
  View, 
  SafeAreaView 
} from "react-native";
import {
  Button,
  ButtonGroup,
  Divider,
  TopNavigation,
  Icon,
  TopNavigationAction,
  Text,
} from "@ui-kitten/components";
import { 
  Player, 
  Game, 
  Location,
  GamePlayer, 
  Rsvp 
} from "../../src/models";

import LoadingScreen from "../../common/LoadingScreen";
import GameFeed from "./GameFeed";
import MapScreen from "./MapScreen";

import "@azure/core-asynciterator-polyfill";
import { SortDirection } from "@aws-amplify/datastore";
import { DataStore } from "aws-amplify";
import { Auth } from "aws-amplify";

const CreateIcon = (props) => <Icon {...props} name="plus-square-outline" />;
const ProfileIcon = (props) => <Icon {...props} name="person-outline" />;


function HomeScreen({ navigation }) {

  // all games
  const [games, setGames] = useState([]);

  // games that user created, or rsvp'd
  const [userGames, setUserGames] = useState([]);

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
        return gamePlayer.game_id;
      });
      const userGames = allGames.filter((game) => {
        return userGameIds.includes(game.id);
      });

      setUserGames(userGames);
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
    setLoading(true);
    // LOAD WHILE PERFORMING API CALLS
    const subscriber = DataStore.observeQuery(
      Game,
      (c) => c.datetime.gt(Math.floor(Date.now() / 1000)),
      {
        sort: (s) => s.datetime(SortDirection.ASCENDING),
      }
    ).subscribe(({ items }) => {
      setGames(items);
      setUserGames(getPlayerGames(items));
    });

    setLoading(false);

    return () => {
      subscriber.unsubscribe();
    };
  }, []);

  const [middleView, setMiddleView] = useState("Game Feed");

  const navigateProfile = () => {
    navigation.navigate("Profile");
  };

  const navigateCreateGame = () => {
    navigation.navigate("CreateGame", {thisPlayer});
  };

  const renderCreateAction = () => (
    <TopNavigationAction icon={CreateIcon} onPress={navigateCreateGame} />
  );
  const renderProfileAction = () => (
    <TopNavigationAction icon={ProfileIcon} onPress={navigateProfile} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        alignment="center"
        title={middleView}
        accessoryLeft={renderCreateAction}
        accessoryRight={renderProfileAction}
      />

      <Divider />

      {loading && <LoadingScreen />}

      {/* RENDER LOCATION / FEED*/}
      <View style={styles.innerContainer}>
        {middleView == "Game Feed" ? 
          <GameFeed data={{ games: games, thisPlayer: thisPlayer }} /> 
          :
          <GameFeed data={{ games: userGames, thisPlayer: thisPlayer }} /> 
        }
        {middleView == "Map View" && <MapScreen />}
      </View>

      <ButtonGroup style={{ justifyContent: "center", margin: "5%" }}>
        <Button
          onPress={() => setMiddleView("Map View")}
          style={[middleView == "Map View" ? styles.selected : styles.nav]}
        >
          <Text>Map View</Text>
        </Button>
        <Button
          onPress={() => setMiddleView("Game Feed")}
          style={[middleView == "Game Feed" ? styles.selected : styles.nav]}
        >
          <Text>Game Feed</Text>
        </Button>
        <Button
          onPress={() => setMiddleView("Your Games")}
          style={[middleView == "Your Games" ? styles.selected : styles.nav]}
        >
          <Text>Your Games</Text>
        </Button>
      </ButtonGroup>
    </SafeAreaView>
  );
};

const styles = EStyleSheet.create({
  innerContainer: {
    height: "83%",
    marginTop: ".5rem",
  },
  nav: {
    flex: 1,
    justifyContent: "center",
  },
  selected: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#9A4924",
  },
});

export default HomeScreen;
