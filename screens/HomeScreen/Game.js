import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import rsvp from "../../utils/rsvp";
import { Text, Card, Button, ButtonGroup } from "@ui-kitten/components";

function Game({ item }) {
  const navigation = useNavigation();

  function clickedGame() {
    console.log("navigating to game screen:", item.id);
    navigation.navigate("GameDetails", { item });
  }

  return (
    <Card style={styles.card} onPress={() => clickedGame()}>
      <Text style={styles.text} category="h4">
        {item.name}
      </Text>

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

      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <Text style={{ fontWeight: "bold" }}>RSVP:</Text>

        <ButtonGroup style={{ justifyContent: "center", margin: "5%" }}>
          <Button
            style={{ backgroundColor: "#3D9B2C" }}
            onPress={() => rsvp("in", item)}
          >
            Accepted: {item.in.length}
          </Button>

          <Button
            style={{ backgroundColor: "#B74840" }}
            onPress={() => rsvp("out", item)}
          >
            Rejected: {item.out.length}
          </Button>
        </ButtonGroup>
      </View>
    </Card>
  );
}

const styles = EStyleSheet.create({
  card: {
    flex: 1,
    margin: 2,
  },
});

export default Game;
