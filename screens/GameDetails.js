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
  const thisPlayer = details.player;
  const thisGame = details.game;

  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState([]);
  const [declined, setDeclined] = useState([]);


  const [gameOrganizer, setGameOrganizer] = useState([]);

  async function getInvitedPlayers() {
    setLoading(true);
    let playerids = thisGame.invited_players;
    console.log("player ids: ", playerids);

    acceptedPlayers = [];
    declinedPlayers = [];


    for (let i = 0; i < playerids.length; i++) {

      try {
        let playerId = playerids[i];
        const gamePlayer = await DataStore.query(GamePlayer, (c) => c.and(c => 
          [c.player_id.eq(playerId), c.game_id.eq(thisGame.id)]));
        console.log("game player returned: ", gamePlayer);
        const player = await DataStore.query(Player, (c) => c.id.eq(playerId));
        console.log("player returned: ", player);
        if (gamePlayer[0].rsvp == Rsvp.ACCEPTED) {
          acceptedPlayers.push({ id: player[0].id, name: player[0].name, status: "In" });
        }
        else {
          declinedPlayers.push({ id: player[0].id, name: player[0].name, status: "Out" });
        }
      }

      catch (error) {
        console.log("error occured in finding", i, "ith game player rsvp");
      }
      
    }
    return {
      accepted: acceptedPlayers,
      declined: declinedPlayers
    }
  }

  async function getGameOrganizer() {
    if (thisPlayer.id == thisGame.organizer) {
      return thisPlayer.name;
    } 
    
    else {
      try {
        const organizer = await DataStore.query(Player, thisGame.organizer);
        console.log("organizer returned: ", organizer);
        return organizer.name;
      } 
      
      catch (error) {
        console.log("error getting organizer");
        return;
      }
    }
  }
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
  
        const organizerRes = await getGameOrganizer();
        setGameOrganizer(organizerRes);
  
        const invitedPlayersRes = await getInvitedPlayers();
        setAccepted(invitedPlayersRes.accepted);
        setDeclined(invitedPlayersRes.declined);
  
        setLoading(false);
      } catch (error) {
        console.log("Error fetching data: ", error);
        setLoading(false);
      }
    }
  
    fetchData();
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
    navigation.navigate(("UpdateGame"), {
        game: thisGame,
      });
  }
 
  async function handleDelete() {
    setLoading(true);
    try {
      const toDelete = await DataStore.query(Game, thisGame.id);
      DataStore.delete(toDelete);
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
      <View style={styles.infoContainer}>
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
            onPress={() => rsvp(thisGame.id, thisPlayer.id, Rsvp.ACCEPTED)}
          >
            <Text style={styles.text}>Accept</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={[styles.button, styles.redButton]}
            onPress={() => rsvp(thisGame.id, thisPlayer.id, Rsvp.DECLINED)}
          >
            <Text style={styles.text}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View> :
      <View style={styles.buttonContainer}>
        <Button title="Edit Game Details" onPress={handleEdit} />
        <Button title="Delete Game" onPress={handleDelete} />
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