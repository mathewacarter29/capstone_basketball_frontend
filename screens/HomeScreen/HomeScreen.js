import React, {useState} from "react";
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
} from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";
import GameFeed from "./GameFeed";
import MapScreen from "../MapView/MapScreen"


const DATA = [
  {
    id: "1",
    title: "First Game",
    creator: "Mat",
    location: "The Village Basketball Courts",
    date: "6/30/2023",
    time: "12:00 PM",
    in: ["Abir", "Mat", "Peyton", "Rishi", "Parker"],
    out: ["Seyam", "David"],
  },
  {
    id: "2",
    title: "Second Game",
    creator: "Peyton",
    location: "McCommas",
    date: "6/29/2023",
    time: "10:00 AM",
    in: ["Abir", "Mat", "Peyton"],
    out: ["Seyam", "David", "Rishi", "Parker"],
  },
  {
    id: "3",
    title: "Third Game",
    creator: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
  {
    id: "4",
    title: "Forth Game",
    creator: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
  {
    id: "5",
    title: "Fifth Game",
    creator: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
];

function ShowContent(props) {
  if(props.number == 0){
    return <MapScreen/>
  }
  else{
    return <GameFeed data={DATA} />
  }
  
  
};

function HomeScreen({ navigation }) {

  const [mapView, setMapView] = useState(0);

  return (
    <View style={styles.container}>

      {/*PROFILE ICON*/}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Image
          style={styles.image}
          source={require("../../assets/profile_icon.png")}
        />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>

        {/* RENDER LOCATION / FEED*/}
        <View style={styles.innerContainer}>

          <ShowContent number={mapView}/>
          
        </View>

      {/* BOTTOM NAV BUTTONS */}
      <View style={styles.row} >


            <TouchableOpacity onPress={() => {setMapView(0)} }>
                <Text style={styles.topText}> Map View </Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => {setMapView(1)} }>
                <Text style={styles.topText}> Game View </Text>
            </TouchableOpacity>
        </View>

    </View>
  );
}

const styles = EStyleSheet.create({
  wrapper: {
    height: "80%",
  },
  container: {
    flex: "1",
  },
  button: {
    position: "absolute",
    right: "4%",
    top: "4%",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 52,
  },
  innerContainer: {
    height: "75%",
    marginTop: "6.5rem",
  },
  row: {
    backgroundColor: "#ef9031",
    flexDirection: "row",
    borderRadius: "1rem",
    marginTop: "1rem",
    marginLeft: '2%',
    marginRight: '2%',
    justifyContent: 'space-evenly',
  },
  topText: {
    color:"#2c3233",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: ".5rem",
    paddingTop: ".5rem",
  },

});

export default HomeScreen;
