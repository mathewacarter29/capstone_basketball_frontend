import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import EStyleSheet from "react-native-extended-stylesheet";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import Button from "../common/Button";
import BackArrow from "../common/BackArrow";
import { DataStore } from "aws-amplify";
import "@azure/core-asynciterator-polyfill";
import {
  Player,
  Game,
  Location,
  GamePlayer,
  Rsvp,
  SkillLevel,
} from "../src/models";

import { epochToLocalDate } from "../utils/TimeUtil";
import { epochToLocalTime } from "../utils/TimeUtil";
import rsvp from "../utils/rsvp";
import LoadingScreen from "../common/LoadingScreen";
import ErrorPopup from "../common/ErrorPopup";

function GameDetails({ route, navigation }) {
  const details = route.params.item;
  const thisPlayer = details.player;
  const thisGame = details.game;

  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState([]);
  const [declined, setDeclined] = useState([]);
  const [gameOrganizer, setGameOrganizer] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function getInvitedPlayers() {
    let playerids = thisGame.invited_players;
    console.log("player ids: ", playerids);

    acceptedPlayers = [];
    declinedPlayers = [];

    try {
      // let playerId = playerids[i];
      const gamePlayers = await DataStore.query(GamePlayer, (c) =>
        c.and((c) => [c.game_id.eq(thisGame.id)])
      );
      console.log("game player returned: ", gamePlayers);

      for (let i = 0; i < gamePlayers.length; i++) {
        console.log("gameplayer i", gamePlayers[i]);
        const players = await DataStore.query(Player, (c) =>
          c.id.eq(gamePlayers[i].player_id)
        );
        const player = players[0];
        console.log("Player: invited: ", player);
        if (gamePlayers[i].rsvp == Rsvp.ACCEPTED) {
          acceptedPlayers.push({
            id: player.id,
            name: player.name,
            status: "In",
          });
        } else {
          declinedPlayers.push({
            id: player.id,
            name: player.name,
            status: "Out",
          });
        }
      }
    } catch (error) {
      // console.log("error occured in finding", i, "ith game player rsvp");
      setShowError(true);
      setErrorMessage(`error occured in finding a game player rsvp`);
      setLoading(false);
      return;
    }
    return {
      accepted: acceptedPlayers,
      declined: declinedPlayers,
    };
  }

  async function getGameOrganizer() {
    if (thisPlayer.id == thisGame.organizer) {
      return thisPlayer.name;
    } else {
      try {
        const organizer = await DataStore.query(Player, thisGame.organizer);
        console.log("organizer returned: ", organizer);
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

  useEffect(() => {
    (async () => {
      setLoading(true);

      const organizerRes = await getGameOrganizer();
      // Error check API call methods
      if (typeof organizerRes === "undefined") return;
      setGameOrganizer(organizerRes);

      const invitedPlayersRes = await getInvitedPlayers();
      if (typeof invitedPlayersRes === "undefined") return;
      setAccepted(invitedPlayersRes.accepted);
      setDeclined(invitedPlayersRes.declined);

      setLoading(false);
    })();
  }, []);

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

  return (
    <View style={styles.container}>
      <BackArrow location="HomeScreen" />
      {loading && <LoadingScreen />}
      <View style={[styles.infoContainer, styles.detailsContainer]}>
        <ScrollView>
          <Text style={styles.topText}>{thisGame.name}</Text>
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
        </ScrollView>
      </View>
      <View style={[styles.infoContainer, styles.acceptedContainer]}>
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={[styles.text, styles.bold]}>Players Attending</Text>
            </>
          }
          data={[...accepted, ...declined]}
          renderItem={renderItem}
        />
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, styles.bold]}>RSVP:</Text>
        <View style={styles.line} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "lightgreen" }]}
            onPress={() => rsvp(thisGame.id, thisPlayer.id, Rsvp.ACCEPTED)}
          >
            <Text style={styles.text}>Accept</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={[styles.button, styles.redButton]}
            onPress={() => {
              setLoading(true);
              if (!rsvp(thisGame.id, thisPlayer.id, Rsvp.DECLINED)) {
                setErrorMessage("Error saving RSVP.");
                setShowError(true);
              }

              setLoading(false);
            }}
          >
            <Text style={styles.text}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isGameOwner() && (
        <View style={styles.buttonContainer}>
          <Button title="Edit Game Details" onPress={handleEdit} />
          <Button title="Delete Game" onPress={handleDelete} />
        </View>
      )}
      {showError && <ErrorPopup errorMessage={errorMessage} />}
    </View>
  );
}

const styles = EStyleSheet.create({
  topText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    margin: "0.5rem",
    marginBottom: "1rem",
    textDecorationLine: "underline",
  },
  line: {
    width: 1,
    height: "100%",
    backgroundColor: "black",
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  row: {
    width: "90%",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: "1rem",
    margin: "1rem",
  },
  redButton: {
    backgroundColor: "#FAA0A0",
    borderBottomRightRadius: "1rem",
    borderTopRightRadius: "1rem",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "lightgray",
    paddingTop: "6rem",
  },
  text: {
    fontSize: 20,
    margin: "0.5rem",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: "3%",
  },
  infoContainer: {
    borderWidth: 1,
    borderRadius: "1rem",
    margin: "1rem",
    width: "90%",
  },
  acceptedContainer: {
    height: "10rem",
  },
  nameContainer: {
    borderBottomWidth: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: "1rem",
    marginLeft: "1rem",
    marginRight: "1rem",
  },
  detailsContainer: {
    maxHeight: "17rem",
    width: "90%",
  },
});

export default GameDetails;
