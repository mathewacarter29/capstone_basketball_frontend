import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, ScrollView, SafeAreaView } from "react-native";
import rsvp from "../utils/rsvp";
import {
  Text,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Card,
  List,
  Divider,
  Button,
  ButtonGroup,
} from "@ui-kitten/components";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function GameDetails({ route, navigation }) {
  const details = route.params.item;
  const accepted = details.in.map((playerName, index) => {
    return { id: index, name: playerName, status: "In" };
  });
  const declined = details.out.map((playerName, index) => {
    return { id: index + accepted.length, name: playerName, status: "Out" };
  });
  const DUMMY_USERNAME = "Parker";

  function isGameOwner() {
    // Use a dummy username until actual organizer names are used
    // We would need DUMMY_USERNAME to be the name of the current user
    return DUMMY_USERNAME == details.organizer;
  }

  function showDescription() {
    return details.description != "" && details.description != undefined;
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.nameContainer}>
        <Text style={styles.text}>{item.name}</Text>
        <Text
          style={[
            styles.text,
            item.status == "In" ? { color: "green" } : { color: "red" },
          ]}
        >
          {item.status}
        </Text>
      </View>
    );
  };

  const navigateBack = () => {
    navigation.navigate("HomeScreen");
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView>
      <TopNavigation
        alignment="center"
        title="Game Details"
        accessoryLeft={renderBackAction}
      />

      <ScrollView style={styles.container}>
        <Card>
          <Text style={styles.topText} category="h1">
            {details.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Date: </Text>
            {details.date}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Location: </Text>
            {details.location}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Time: </Text>
            {details.time}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Organizer: </Text>
            {details.organizer}
          </Text>
          {showDescription() && (
            <Text style={styles.text}>
              <Text style={styles.bold}>Description: </Text>
              {details.description}
            </Text>
          )}
        </Card>
      </ScrollView>

      <View style={{ maxHeight: "33%" }}>
        <Text style={styles.topText} category="h5">
          {" "}
          Attending Players{" "}
        </Text>
        <List
          data={[...accepted, ...declined]}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        ></List>
      </View>

      <ButtonGroup style={{ justifyContent: "center", marginTop: "5%" }}>
        <Button
          style={{ backgroundColor: "#3D9B2C" }}
          onPress={() => rsvp("in", details)}
        >
          Accept
        </Button>

        <Button
          style={{ backgroundColor: "#B74840" }}
          onPress={() => rsvp("out", details)}
        >
          Reject
        </Button>
      </ButtonGroup>

      {isGameOwner() && (
        <View>
          <Button style={{ margin: "2%" }}>Edit Game Details</Button>
          <Button style={{ margin: "2%" }}>Delete Game</Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
  text: {
    margin: "0.5rem",
  },
  topText: {
    margin: "0.5rem",
    textAlign: "center",
  },
  container: {
    margin: "1rem",
    maxHeight: "33%",
  },
  bold: {
    fontWeight: "bold",
  },
  nameContainer: {
    borderBottomWidth: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: "1rem",
    marginLeft: "1rem",
    marginRight: "1rem",
  },
});

export default GameDetails;
