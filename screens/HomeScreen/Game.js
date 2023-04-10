import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import rsvp from "../../utils/rsvp";
import {epochToLocalDate} from '../../utils/TimeUtil';
import {epochToLocalTime} from '../../utils/TimeUtil';

function Game({ item }) {
  const navigation = useNavigation();
  console.log("item: ", item);
  const thisGame = item.game;
  const thisPlayer = item.player;

  function clickedGame() {
    console.log("navigating to game screen:", item.id);
    navigation.navigate("GameDetails", { item });
  }

  return (
    <TouchableOpacity style={styles.item} onPress={() => clickedGame()}>
      <Text style={styles.title}>{thisGame.name}</Text>

      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Location: </Text>
        {thisGame.location}
      </Text>

      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Date: </Text>
        {epochToLocalDate(thisGame.datetime)}
      </Text>

      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Time: </Text>
        {epochToLocalTime(thisGame.datetime)}
      </Text>

      {thisPlayer.id != thisGame.organizer && <View style={styles.row}>
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
            onPress={() => rsvp("in", thisGame)}
          >
            <Text style={styles.text}>Accept</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={[styles.button, styles.redButton]}
            onPress={() => rsvp("out", thisGame)}
          >
            <Text style={styles.text}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>}
    </TouchableOpacity>
  );
}

const styles = EStyleSheet.create({
  text: {
    fontSize: 18,
    margin: "0.25rem",
  },
  item: {
    backgroundColor: "orange",
    marginTop: "1rem",
    padding: "0.5rem",
    borderRadius: "1rem",
    shadowColor: "#171717",
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
  },
  title: {
    fontSize: 32,
    margin: "0.25rem",
  },
  row: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: "1rem",
  },
  bold: {
    fontWeight: "bold",
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
  redButton: {
    backgroundColor: "#FAA0A0",
    borderBottomRightRadius: "1rem",
    borderTopRightRadius: "1rem",
  },
});

export default Game;
