import React from "react";
import { FlatList, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Game from "./Game";

function GameFeed(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.topText}>Game Feed</Text>
      <FlatList
        data={props.data}
        renderItem={({ item }) => <Game item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: "1",
    alignItems: "center",
    borderRadius: "1rem",
    marginLeft: "2%",
    marginRight: "2%",
  },
  topText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: "1rem",
  },
});

export default GameFeed;
