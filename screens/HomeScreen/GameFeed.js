import React from "react";
import { FlatList, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Game from "./Game";

function GameFeed(props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={props.data.games}
        renderItem={({ item }) => <Game setLoading={props.setLoading} item={{game: item, player: props.data.thisPlayer}} />}
        keyExtractor={(item) => item.id}
      />
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
  },
});

export default GameFeed;
