import { React, useState } from "react";
import { View, SafeAreaView } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import {
  Button,
  ButtonGroup,
  Divider,
  TopNavigation,
  Icon,
  TopNavigationAction,
  Text,
} from "@ui-kitten/components";

import LoadingScreen from "../../common/LoadingScreen";
import GameFeed from "./GameFeed";
import MapScreen from "./MapScreen";
import "@azure/core-asynciterator-polyfill";

const DATA = [
  {
    id: "1",
    name: "First Game",
    organizer: "Mat",
    location: "The Village Basketball Courts",
    date: "6/30/2023",
    time: "12:00 PM",
    in: [
      "Abir",
      "Mat",
      "Peyton",
      "Rishi",
      "Parker",
      "Parker",
      "Parker",
      "Parker",
    ],
    out: ["Seyam", "David"],
    description: "This is a test description to see if the field will show up",
  },
  {
    id: "2",
    name: "Second Game",
    organizer: "Peyton",
    location: "McCommas",
    date: "6/29/2023",
    time: "10:00 AM",
    in: ["Abir"],
    out: ["Seyam", "David", "Rishi", "Parker"],
  },
  {
    id: "3",
    name: "Third Game",
    organizer: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
  {
    id: "4",
    name: "Forth Game",
    organizer: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
  {
    id: "5",
    name: "Fifth Game",
    organizer: "Parker",
    location: "The Bubble",
    date: "8/1/2023",
    time: "3:00 PM",
    in: ["Abir", "Mat", "Peyton", "Seyam", "David", "Rishi", "Parker"],
    out: [],
  },
];

const CreateIcon = (props) => <Icon {...props} name="plus-square-outline" />;
const ProfileIcon = (props) => <Icon {...props} name="person-outline" />;

export const HomeScreen = ({ navigation }) => {
  const [data, dataSet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [middleView, setMiddleView] = useState("Game Feed");

  const navigateProfile = () => {
    navigation.navigate("Profile");
  };

  const navigateCreateGame = () => {
    navigation.navigate("CreateGame");
  };

  const renderCreateAction = () => (
    <TopNavigationAction icon={CreateIcon} onPress={navigateCreateGame} />
  );
  const renderProfileAction = () => (
    <TopNavigationAction icon={ProfileIcon} onPress={navigateProfile} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        alignment="center"
        title={middleView}
        accessoryLeft={renderCreateAction}
        accessoryRight={renderProfileAction}
      />

      <Divider />

      {loading && <LoadingScreen />}

      {/* RENDER LOCATION / FEED*/}
      <View style={styles.innerContainer}>
        {middleView == "Game Feed" && <GameFeed data={DATA} />}
        {middleView == "Map View" && <MapScreen />}
      </View>

      <ButtonGroup style={{ justifyContent: "center", margin: "5%" }}>
        <Button
          onPress={() => setMiddleView("Map View")}
          style={[middleView == "Map View" ? styles.selected : styles.nav]}
        >
          <Text>Map View</Text>
        </Button>
        <Button
          onPress={() => setMiddleView("Game Feed")}
          style={[middleView == "Game Feed" ? styles.selected : styles.nav]}
        >
          <Text>Game Feed</Text>
        </Button>
      </ButtonGroup>
    </SafeAreaView>
  );
};

const styles = EStyleSheet.create({
  innerContainer: {
    height: "83%",
    marginTop: ".5rem",
  },
  nav: {
    flex: 1,
    justifyContent: "center",
  },
  selected: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#9A4924",
  },
});

export default HomeScreen;
