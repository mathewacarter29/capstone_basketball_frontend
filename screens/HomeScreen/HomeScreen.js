import { React, useState, useEffect } from "react";
import EStyleSheet from "react-native-extended-stylesheet";

import { 
  View, 
  SafeAreaView,
  Switch
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
  const [games, setGames] = useState([]);
  const [userGames, setUserGames] = useState([]);
  // const [playerGames, setPlayerGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thisPlayer, setThisPlayer] = useState([]);
  const [middleView, setMiddleView] = useState("Game Feed");
  const [switchVal, setSwitchVal] = useState(false);

  const toggleSwitch = () => {
    setSwitchVal(previousState => !previousState)
    switchVal ? setMiddleView("Game Feed") : setMiddleView("Your Games")
  }

  async function getPlayerGames(allGames) {
    // NEED TRY CATCH AROUND ALL API CALLS
    try {
      const authObj = await Auth.currentUserInfo();
      const userEmail = authObj.attributes.email;
      // get Player object from email
      const players = await DataStore.query(Player, (p) =>
        p.email.eq(userEmail)
      );
      //console.log(players);
      const player = players[0];
      //console.log("player: ", player);
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
    // TRY CATCH AROUND API CALLS

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
      {(middleView == "Game Feed" || middleView == "Your Games") && 
      <View style={styles.switchHolder}>
        <Text style={{marginTop:"3%", marginRight:"2%", fontWeight: "bold"}}>
          Your Games
        </Text>
        <Switch 
          trackColor={{false: '#767577', true: '#9A4924'}}
          thumbColor={switchVal ? 'orange' : '#f4f3f4'}
          style={{marginRight: "5%", marginTop: "2%"}}
          onValueChange={toggleSwitch}
          value={switchVal}
          />
      </View> }

      <Divider />

      {loading && <LoadingScreen />}

      {/* RENDER LOCATION / FEED*/}
      <View style={[middleView == "Map View" ? styles.innerContainerMap : styles.innerContainerFeed]}>
        {middleView == "Map View" && <MapScreen />}
        {middleView == "Game Feed" && 
          <GameFeed setLoading={setLoading} data={{ games: games, thisPlayer: thisPlayer }} /> 
        }
        {middleView == "Your Games" && 
          <GameFeed setLoading={setLoading} data={{ games: userGames, thisPlayer: thisPlayer }} /> 
        }
      </View>

      <ButtonGroup style={{ justifyContent: "center", margin: "5%", height: "7%" }}>
        <Button
          onPress={() => setMiddleView("Map View")}
          style={[middleView == "Map View" ? styles.selected : styles.nav]}
        >
          <Text>Map View</Text>
        </Button>
        <Button
          onPress={() => {
            setMiddleView("Game Feed")
            setSwitchVal(false)}
          }
          style={[middleView == "Game Feed" ? styles.selected : styles.nav]}
        >
          <Text>Game Feed</Text>
        </Button>
      </ButtonGroup>
    </SafeAreaView>
  );
};

const styles = EStyleSheet.create({
  innerContainerFeed: {
    height: "77%",
    marginTop: ".5rem",
  },
  innerContainerMap: {
    height: "82%",
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
  switchHolder: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default HomeScreen;
