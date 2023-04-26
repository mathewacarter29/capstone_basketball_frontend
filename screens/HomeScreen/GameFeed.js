import React from "react";
import { FlatList, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Game from "./Game";
import { Text } from "@ui-kitten/components";

function GameFeed(props) {
  return (
    <View style={styles.container}>
      {props.data.games.length != 0 ? (
        <FlatList
          data={props.data.games}
          renderItem={({ item }) => (
            <Game
              setLoading={props.setLoading}
              item={{ game: item, player: props.data.thisPlayer }}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: "5%" }} category="h2">
          No games currently scheduled
        </Text>
      )}
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: "1",
    alignItems: "start",
    borderRadius: ".5rem",
    marginLeft: "1%",
    marginRight: "1%",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default GameFeed;
