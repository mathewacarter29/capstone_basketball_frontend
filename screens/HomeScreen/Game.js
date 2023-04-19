import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import rsvp from "../../utils/rsvp";
import { Text, Card, Button, ButtonGroup } from "@ui-kitten/components";
import { epochToLocalDate } from "../../utils/TimeUtil";
import { epochToLocalTime } from "../../utils/TimeUtil";

import {
  Player,
  Location,
  GamePlayer,
  Rsvp,
  SkillLevel,
} from "../../src/models";

function Game({ item }) {
  const navigation = useNavigation();
  const thisGame = item.game;
  const thisPlayer = item.player;

  function clickedGame() {
    navigation.navigate("GameDetails", { item });
  }

  return (
    <Card style={styles.card} onPress={() => clickedGame()}>
      <Text style={styles.text} category="h4">
        {thisGame.name}
      </Text>

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

      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <Text style={{ fontWeight: "bold" }}>RSVP:</Text>

        <ButtonGroup style={{ justifyContent: "center", margin: "5%" }}>
          <Button
            style={{ backgroundColor: "#3D9B2C" }}
            onPress={() => rsvp(thisGame.id, thisPlayer.id, Rsvp.ACCEPTED)}
          >
            Accept
          </Button>

          <Button
            style={{ backgroundColor: "#B74840" }}
            onPress={() => rsvp(thisGame.id, thisPlayer.id, Rsvp.DECLINED)}
          >
            Reject
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
