import React, { useEffect, useState } from "react";
import EStyleSheet from "react-native-extended-stylesheet";

import { DataStore } from "aws-amplify";
import "@azure/core-asynciterator-polyfill";

import rsvp from "../utils/rsvp";
import { epochToLocalDate } from "../utils/TimeUtil";
import { epochToLocalTime } from "../utils/TimeUtil";
import LoadingScreen from "../common/LoadingScreen";
import ErrorPopup from "../common/ErrorPopup";
import { useFocusEffect } from "@react-navigation/native";

import {
  Player,
  Game,
  Location,
  GamePlayer,
  Rsvp,
  SkillLevel,
} from "../src/models";
import { ScrollView, SafeAreaView, View } from "react-native";
import {
  Text,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Card,
  List,
  Divider,
  Button,
  ButtonGroup,
} from "@ui-kitten/components";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
function GameDetails({ route, navigation }) {
  const details = route.params.item;
  const thisPlayer = details.player;
  const thisGame = details.game;

  const [loading, setLoading] = useState(false);
  // const [statuses, setStatuses] = useState({ accepted: [], declined: [] });
  const [statuses, setStatuses] = useState([]);
  const [gameOrganizer, setGameOrganizer] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function getInvitedPlayers() {
    let playerids = thisGame.invited_players;
    playerStatuses = [];

    try {
      // let playerId = playerids[i];
      const gamePlayers = await DataStore.query(GamePlayer, (c) =>
        c.game_id.eq(thisGame.id)
      );

      for (let i = 0; i < gamePlayers.length; i++) {
        const players = await DataStore.query(Player, (c) =>
          c.id.eq(gamePlayers[i].player_id)
        );

        if (players == null || players == undefined || players.length == 0) {
          continue;
        }
        const player = players[0];

        if (gamePlayers[i].rsvp == Rsvp.ACCEPTED) {
          playerStatuses.push({
            id: player.id,
            name: player.name,
            status: "In",
          });
        } else {
          playerStatuses.push({
            id: player.id,
            name: player.name,
            status: "Out",
          });
        }
      }
    } catch (error) {
      setShowError(true);
      setErrorMessage(`error occured in finding a game player rsvp`);
      setLoading(false);
      return;
    }
    return playerStatuses;
  }

  async function getGameOrganizer() {
    if (thisPlayer.id == thisGame.organizer) {
      return thisPlayer.name;
    } else {
      try {
        const organizer = await DataStore.query(Player, thisGame.organizer);
        return organizer.name;
      } catch (error) {
        console.log("error getting organizer");
        setErrorMessage("Error retrieving game organizer");
        setShowError(true);
        setLoading(false);
        return;
      }
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);

        const organizerRes = await getGameOrganizer();
        if (typeof organizerRes === "undefined") return;
        setGameOrganizer(organizerRes);

        const invitedPlayersRes = await getInvitedPlayers();
        if (typeof invitedPlayersRes === "undefined") return;

        setStatuses(invitedPlayersRes);
        setLoading(false);
      };

      fetchData();

      return () => {};
    }, []) // Empty array ensures the effect only re-runs when the screen is focused
  );

  function isGameOwner() {
    // Use a dummy username until actual organizer names are used
    // We would need DUMMY_USERNAME to be the name of the current user
    return thisPlayer.id == thisGame.organizer;
  }

  function showDescription() {
    return thisGame.description != "" && thisGame.description != undefined;
  }

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.nameContainer}>
        <Text style={styles.text}>{item.name}</Text>
        <Text
          style={[
            styles.text,
            item.status == "In" ? { color: "green" } : { color: "red" },
          ]}
        >
          {item.status}
        </Text>
      </View>
    );
  };

  function handleEdit() {
    navigation.navigate("UpdateGame", {
      game: thisGame,
      player: thisPlayer,
    });
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await DataStore.delete(Game, thisGame.id);
      await DataStore.delete(GamePlayer, (gp) => gp.game_id.eq(thisGame.id));
      setLoading(false);
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.log("error occurred in deleting game");
      setLoading(false);
    }
  }

  const navigateBack = () => {
    if (typeof route.params.mapFeedRouteParams === "undefined") {
      navigation.navigate("HomeScreen");
    } else {
      navigation.navigate("MapFeed", route.params.mapFeedRouteParams);
    }
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "flex-start" }}>
      <TopNavigation
        alignment="center"
        title="Game Details"
        accessoryLeft={renderBackAction}
      />
      {loading && <LoadingScreen />}
      <ScrollView style={styles.container}>
        <Card>
          <Text style={styles.topText} category="h3">
            {thisGame.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Date: </Text>
            {epochToLocalDate(thisGame.datetime)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Location: </Text>
            {thisGame.location}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Time: </Text>
            {epochToLocalTime(thisGame.datetime)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Organizer: </Text>
            {loading ? "Loading..." : gameOrganizer}
          </Text>
          {showDescription() && (
            <Text style={styles.text}>
              <Text style={styles.bold}>Description: </Text>
              {thisGame.description}
            </Text>
          )}
        </Card>
      </ScrollView>

      <View style={{ maxHeight: "25%" }}>
        <Text style={styles.topText} category="h6">
          Attending Players
        </Text>
        <List
          data={statuses}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        ></List>
      </View>

      <ButtonGroup style={{ justifyContent: "center", marginTop: "5%" }}>
        <Button
          style={{ backgroundColor: "#3D9B2C", width: "40%" }}
          onPress={async () => {
            setLoading(true);
            //let success = await rsvp(thisGame.id, thisPlayer.id, Rsvp.ACCEPTED)
            if (await rsvp(thisGame.id, thisPlayer.id, Rsvp.ACCEPTED)) {
              const invitedPlayersRes = await getInvitedPlayers();
              setStatuses(invitedPlayersRes);
            } else {
              setErrorMessage("Error saving RSVP.");
              setShowError(true);
            }
            setLoading(false);
            setShowError(false);
          }}
        >
          Accept
        </Button>

        <Button
          style={{ backgroundColor: "#B74840", width: "40%" }}
          onPress={async () => {
            setLoading(true);
            if (!(await rsvp(thisGame.id, thisPlayer.id, Rsvp.DECLINED))) {
              setErrorMessage("Error saving RSVP.");
              setShowError(true);
            } else {
              const invitedPlayersRes = await getInvitedPlayers();
              setStatuses(invitedPlayersRes);
            }
            setShowError(false);
            setLoading(false);
          }}
        >
          Reject
        </Button>
      </ButtonGroup>

      {isGameOwner() && (
        <View>
          <Button style={{ margin: "2%" }} onPress={handleEdit}>
            Edit Game Details
          </Button>
          <Button style={{ margin: "2%" }} onPress={handleDelete}>
            Delete Game
          </Button>
        </View>
      )}
      {showError && <ErrorPopup errorMessage={errorMessage} />}
    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
  text: {
    margin: "0.5rem",
  },
  topText: {
    margin: "0.2rem",
    textAlign: "center",
  },
  container: {
    margin: "1rem",
    maxHeight: "40%",
    flexGrow: "0",
  },
  bold: {
    fontWeight: "bold",
  },
  nameContainer: {
    borderBottomWidth: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: "1rem",
    marginLeft: "1rem",
    marginRight: "1rem",
  },
});

export default GameDetails;
