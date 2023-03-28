import { React, useState, useEffect } from "react";

import { View, Image, TouchableOpacity } from "react-native";
import Container from "../../common/Container";
import EStyleSheet from "react-native-extended-stylesheet";
import GameList from "./GameList";
import Game from "./Game";

function HomeScreen({ navigation }) {
  const [games, setGames] = useState({
    gameId: "0",
    creator: "",
    location: "",
    date: "",
    time: "",
    in: [],
    out: [],
  });
  const [loading, setLoading] = useState(true);

  const DUMMY_GAMES = [
    {
      gameId: 1,
      creator: "Mat",
      location: "The Village Basketball Courts",
      // we will probably have to change the date format to epoch time for sorting?
      date: "6/30/2023",
      time: "12:00 PM",
      in: ["Abir", "Mat", "Peyton", "Rishi", "Parker"],
      out: ["Seyam", "David"],
    },
    {
      gameId: 2,
      creator: "Peyton",
      location: "McCommas",
      // we will probably have to change the date format to epoch time for sorting?
      date: "6/29/2023",
      time: "10:00 AM",
      in: ["Abir", "Mat", "Peyton"],
      out: ["Seyam", "David", "Rishi", "Parker"],
    },
    {
      gameId: 3,
      creator: "Parker",
      location: "The Bubble",
      // we will probably have to change the date format to epoch time for sorting?
      date: "8/1/2023",
      time: "3:00 PM",
      in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
      out: [],
    },
  ];

  // This will get all game data from the database - now we use dummy data
  useEffect(() => {
    // will need a loading screen for API call
    // get games from the database and add them to games array
    let tempGames = [];
    DUMMY_GAMES.forEach((g, index) => {
      const gameObj = (
        <Game
          key={index}
          creator={g.creator}
          location={g.location}
          date={g.date}
          time={g.time}
          in={g.in}
          out={g.out}
        />
      );
      // we will probably need to do some validating of games when we get them
      tempGames.push(gameObj);
    });
    setGames(tempGames);
    setLoading(false);
  }, []);

  return (
    <Container>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            style={styles.image}
            source={require("../../assets/profile_icon.png")}
          />
        </TouchableOpacity>
        {!loading && (
          <View style={styles.content}>
            <GameList games={games}></GameList>
          </View>
        )}
      </View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: "6rem",
    flex: 1,
  },
  image: {
    width: 50,
    height: 52,
  },
  button: {
    position: "absolute",
    right: "8%",
    top: "5%",
  },
  content: {
    height: "85%",
    width: "85%",
  },
});

export default HomeScreen;
