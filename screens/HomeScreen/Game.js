import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
//import epochToLocalDate from "../../common/util";
//import epochToLocalTime from "../../common/util";

function epochToLocalDate(epoch) {
  const date = new Date(epoch * 1000); // Convert epoch to milliseconds
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get local month and pad with 0 if needed
  const day = ('0' + date.getDate()).slice(-2); // Get local day and pad with 0 if needed
  const year = date.getFullYear(); // Get local year
  return `${month}-${day}-${year}`;
}

 function epochToLocalTime(epoch) {
  const date = new Date(epoch * 1000); // Convert epoch to milliseconds
  const hours = date.getHours(); // Get local hours
  const minutes = ('0' + date.getMinutes()).slice(-2); // Get local minutes and pad with 0 if needed
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = ('0' + (hours % 12 || 12)).slice(-2); // Convert to 12-hour format and pad with 0 if needed
  return `${formattedHours}:${minutes} ${ampm}`;
}


function Game({ item }) {
  //console.log("item ", item);
  const navigation = useNavigation();
  function rsvp(status) {
    if (status == "in") {
      console.log(`${item.name}: RSVP Accepted`);
    } else {
      console.log(`${item.name}: RSVP Rejected`);
    }
  }

  function clickedGame() {
    console.log("navigating to game screen:", item.id);
    navigation.navigate("GameDetails", { item });
  }

 return (
    <TouchableOpacity style={styles.item} onPress={() => clickedGame()}>
      <Text style={styles.title}>{item.name}</Text>

      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Location: </Text>
        {/* {item.location} */}
      </Text>

      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Date: </Text>
        {epochToLocalDate(item.datetime)}
      </Text>

      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Time: </Text>
        {epochToLocalTime(item.datetime)}
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
            {/* <Text style={styles.text}>Accepted: {item.in.length}</Text> */}
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={[styles.button, styles.redButton]}
            onPress={() => rsvp("out")}
          >
            {/* <Text style={styles.text}>Rejected: {item.out.length}</Text> */}
          </TouchableOpacity>
        </View>
      </View>
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
