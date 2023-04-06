import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text, ScrollView, FlatList } from "react-native";
import Container from "../common/Container";
import Button from "../common/Button";
import BackArrow from "../common/BackArrow";

function GameDetails({ route, navigation }) {
  const details = route.params.item;
  const accepted = details.in.map((playerName, index) => {
    return { id: index, name: playerName };
  });
  const DUMMY_USERNAME = "Parker";

  function isGameOwner() {
    // Use a dummy username until actual organizer names are used
    // We would need DUMMY_USERNAME to be the name of the current user
    return DUMMY_USERNAME == details.organizer;
  }

  function showDescription() {
    return details.description != "" && details.description != undefined;
  }

  const renderItem = ({ item }) => {
    return (
      <View style={{ borderWidth: 1 }}>
        <Text style={styles.text}>{item.name}</Text>
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
          {details.date}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Location: </Text>
          {details.location}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Time: </Text>
          {details.time}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Organizer: </Text>
          {details.organizer}
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
          data={accepted}
          renderItem={({ item }) => (
            <View style={{ borderBottomWidth: 1 }}>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Edit Game Details" disabled={!isGameOwner()} />
        <Button title="Delete Game" disabled={!isGameOwner()} />
      </View>
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
});

export default GameDetails;
