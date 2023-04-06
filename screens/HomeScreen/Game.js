import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text, TouchableOpacity } from "react-native";
import Button from "../../common/Button";

function Game({ item }) {
  //console.log("item ", item);
  function rsvp(status) {
    if (status == "in") {
      console.log(`${item.name}: RSVP Accepted`);
    } else {
      console.log(`${item.name}: RSVP Rejected`);
    }
  }

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>

      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Location: </Text>
        {item.location}
      </Text>

      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Date: </Text>
        {item.date}
      </Text>

      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Time: </Text>
        {item.time}
      </Text>

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
            onPress={() => rsvp("in")}
          >
            <Text style={styles.text}>Accepted: {item.in.length}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={[styles.button, styles.redButton]}
            onPress={() => rsvp("out")}
          >
            <Text style={styles.text}>Rejected: {item.out.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = EStyleSheet.create({
  text: {
    fontSize: 18,
    margin: "0.25rem",
  },
  item: {
    backgroundColor: "#ef9031",
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
