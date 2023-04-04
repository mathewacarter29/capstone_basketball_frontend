import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text } from "react-native";
import Container from "../common/Container";
import Button from "../common/Button";

function GameDetails({ route, navigation }) {
  const details = route.params.item;
  const DUMMY_USERNAME = "Parker";

  function isGameOwner() {
    // Use a dummy username until actual organizer names are used
    // We would need DUMMY_USERNAME to be the name of the current user
    return DUMMY_USERNAME == details.organizer;
  }

  function showDescription() {
    return details.description != "" && details.description != undefined;
  }

  return (
    <Container goBackTo="HomeScreen">
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.topText}>Game details for {details.name}</Text>
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
        <View style={styles.buttonContainer}>
          <Button title="Edit Game Details" disabled={!isGameOwner()} />
          <Button title="Delete Game" disabled={!isGameOwner()} />
        </View>
      </View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  topText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    margin: "0.5rem",
    marginBottom: "3rem",
  },
  container: {
    flex: 1,
    marginTop: "7.5rem",
    alignItems: "center",
    justifyContent: "space-between",
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
    justifyContent: "flex-end",
    marginBottom: "2rem",
  },
});

export default GameDetails;
