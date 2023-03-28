import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text, TouchableOpacity } from "react-native";

function Game(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Location: </Text>
        {props.location}
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Date: </Text>
        {props.date}
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Time: </Text>
        {props.time}
      </Text>

      <View style={styles.rsvpbar}>
        <Text style={[styles.text, { fontWeight: "bold" }]}> RSVP</Text>
        <View style={styles.line} />
        <View style={{ justifyContent: "space-between" }}>
          <TouchableOpacity>
            <Text style={styles.text}>{props.in.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    backgroundColor: "red",
    marginTop: "1rem",
    padding: "0.25rem",
    shadowColor: "#171717",
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 4 },
    borderRadius: "1rem",
    width: "95%",
  },
  text: {
    fontSize: 18,
    margin: "0.25rem",
  },
  rsvpbar: {
    borderWidth: "1pt",
    borderRadius: "1rem",
    marginBottom: "0.25rem",
    flexDirection: "row",
  },
  line: {
    backgroundColor: "black",
    width: 1,
    height: "100%",
  },
  rsvpButton: {
    width: "50%",
  },
});
export default Game;
