import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
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

import {epochToLocalDate} from '../utils/TimeUtil';
import {epochToLocalTime} from '../utils/TimeUtil';
import rsvp from "../utils/rsvp";

function GameDetails({ route, navigation }) {
  const details = route.params.item;
  const [accepted, setAccepted] = useState([]);
  const [declined, setDeclined] = useState([]);
  const [thisPlayer, setThisPlayer] = useState([]);

  console.log("details: ", details);

  //gets current user
  async function getPlayer() {
    try {
      const response = await Auth.currentUserInfo();
      const player = await DataStore.query(Player, (p) => p.email.eq(response.attributes.email));
      console.log("This player returned: ", player[0]);
      setThisPlayer(player[0]);

    } catch (error) {
      console.log("Error getting player: ", error.message);
    }
  }

  async function getInvitedPlayers() {
    let playerids = details.invited_players;
    console.log("player ids: ", playerids);

    acceptedPlayers = [];
    declinedPlayers = [];
    for (let i = 0; i < playerids.length; i++) {
      let playerId = playerids[i];
      console.log("player id in while loop: ", playerids)
      const gamePlayer = await DataStore.query(GamePlayer, (c) => c.and(c => [c.player_id.eq(playerId), c.game_id.eq(details.id)]));
      console.log("game player returned: ", gamePlayer);
      const player = await DataStore.query(Player, (c) => c.id.eq(playerId));
      console.log("player returned: ", player);
      if (gamePlayer[0].rsvp == Rsvp.ACCEPTED) {
        accepted.push(player[0].name);
      }
      else {
        declined.push(player[0].name);
      }
    }

    setAccepted(acceptedPlayers);
    setDeclined(declinedPlayers);
  }



  useEffect(() => {
    getPlayer();
    getInvitedPlayers();
  }, []);


  // const declined = details.out.map((playerName, index) => {
  //   return { id: index + accepted.length, name: playerName, status: "Out" };
  // });


  function isGameOwner() {
    // Use a dummy username until actual organizer names are used
    // We would need DUMMY_USERNAME to be the name of the current user
    return thisPlayer.id == details.organizer;
  }

  function showDescription() {
    return details.description != "" && details.description != undefined;
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.nameContainer}>
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

  return (
    <View style={styles.container}>
      <BackArrow location="HomeScreen" />
      <View style={styles.infoContainer}>
        <Text style={styles.topText}>{details.name}</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Date: </Text>
          {epochToLocalDate(details.datetime)}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Location: </Text>
          {details.location}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Time: </Text>
          {epochToLocalTime(details.datetime)}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Organizer: </Text>
          {thisPlayer.name}
        </Text>
        {showDescription() && (
          <Text style={styles.text}>
            <Text style={styles.bold}>Description: </Text>
            {details.description}
          </Text>
        )}
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
          keyExtractor={(item) => item.id}
        />
      </View>
      {!isGameOwner() ? <View style={styles.row}>
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
            onPress={() => rsvp("in", details)}
          >
            <Text style={styles.text}>Accept</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={[styles.button, styles.redButton]}
            onPress={() => rsvp("out", details)}
          >
            <Text style={styles.text}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View> :
      <View style={styles.buttonContainer}>
        <Button title="Edit Game Details"  />
        <Button title="Delete Game"  />
      </View>}
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
    bottom: "5%",
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
});

export default GameDetails;