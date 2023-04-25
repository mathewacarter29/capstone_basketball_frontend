import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Alert } from "react-native";
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

function Game({ item, setLoading }) {
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

        <ButtonGroup
          style={{ justifyContent: "center", margin: "5%", width: "90%" }}
        >
          <Button
            style={{ backgroundColor: "#3D9B2C", width: "40%" }}
            onPress={async () => {
              setLoading(true)
              await rsvp(thisGame.id, thisPlayer.id, Rsvp.ACCEPTED)
              setLoading(false)
              const alertMessage = thisGame.name + " is happening at " + thisGame.location + " at " + epochToLocalDate(thisGame.datetime) + " " + epochToLocalTime(thisGame.datetime);

              Alert.alert(
                thisGame.name + " accepted",
                alertMessage,
                [
                  {
                    text: 'Cancel',
                    onPress: null,
                    style: 'cancel',
                  },
                ],
                {
                  cancelable: true,
                  onDismiss: () =>
                    console.log("dismissed"),
                },
              );
            }}
          >
            Accept
          </Button>

          <Button
            style={{ backgroundColor: "#B74840", width: "40%" }}
            onPress={async () => {
              setLoading(true)
              await rsvp(thisGame.id, thisPlayer.id, Rsvp.DECLINED)
              setLoading(false)
              const alertMessage = "You declined " + thisGame.name;
              Alert.alert(
                thisGame.name + " declined",
                alertMessage,
                [
                  {
                    text: 'Cancel',
                    onPress: null,
                    style: 'cancel',
                  },
                ],
                {
                  cancelable: true,
                  onDismiss: () =>
                    console.log("dismissed"),
                },
              );
            }}
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
