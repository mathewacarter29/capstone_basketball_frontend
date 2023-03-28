import { React, useEffect, useState } from "react";
import { Text, View } from "react-native";
import Container from "../../common/Container";
import EStyleSheet from "react-native-extended-stylesheet";
import Game from "./Game";

function GameList(props) {
  return (
    <Container>
      <View style={styles.container}>
        <Text>Game List</Text>
        {props.games}
      </View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  container: {
    backgroundColor: "rgba(100, 100, 100, 1)",
    flex: 1,
    alignItems: "center",
  },
});

export default GameList;
