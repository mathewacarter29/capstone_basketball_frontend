import React from 'react';
import { SafeAreaView, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import Game from "./Game";

const DATA = [
  {
    id: '1',
    title: 'First Game',
    creator: "Mat",
    location: "The Village Basketball Courts",
    date: "6/30/2023",
    time: "12:00 PM",
    in: ["Abir", "Mat", "Peyton", "Rishi", "Parker"],
    out: ["Seyam", "David"],
  },
  {
    id: '2',
    title: 'Second Game',
    creator: "Peyton",
    location: "McCommas",
    date: "6/29/2023",
    time: "10:00 AM",
    in: ["Abir", "Mat", "Peyton"],
    out: ["Seyam", "David", "Rishi", "Parker"],
  },
  {
    id: '3',
    title: 'Third Game',
    creator: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
];


function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >

          <Image
            style={styles.image}
            source={require("../../assets/profile_icon.png")}
          />

          <Text style={styles.text}>Home Screen</Text>
        </TouchableOpacity>
          


      <Text style={styles.topText}>
        Game Feed
      </Text>



      <FlatList
        data={DATA}
        renderItem={({item}) => <Game item={item}  />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    alignItems: "center",

  },
  topText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: "1rem",
  },
  button: {
    position: "absolute",
    right: "8%",
    top: "13%",
  },
  image: {
    width: 50,
    height: 52,
  },
});

export default HomeScreen;