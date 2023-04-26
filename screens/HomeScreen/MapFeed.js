import { React, useState, useEffect } from "react";
import EStyleSheet from "react-native-extended-stylesheet";

import { View, SafeAreaView, Switch } from "react-native";
import {
  Button,
  ButtonGroup,
  Divider,
  TopNavigation,
  Icon,
  TopNavigationAction,
  Text,
} from "@ui-kitten/components";
import { Player, Game, Location, GamePlayer, Rsvp } from "../../src/models";

import LoadingScreen from "../../common/LoadingScreen";
import GameFeed from "./GameFeed";
import MapScreen from "./MapScreen";

import "@azure/core-asynciterator-polyfill";
import { SortDirection } from "@aws-amplify/datastore";
import { DataStore } from "aws-amplify";
import { Auth } from "aws-amplify";
import { render } from "react-dom";

const CreateIcon = (props) => <Icon {...props} name="plus-square-outline" />;
const ProfileIcon = (props) => <Icon {...props} name="person-outline" />;

function MapFeed({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

  const renderBackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => navigation.navigate("HomeScreen")}
    />
  );

  const navigateProfile = () => {
    navigation.navigate("Profile");
  };

  const renderProfileAction = () => (
    <TopNavigationAction icon={ProfileIcon} onPress={navigateProfile} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        alignment="center"
        title={route.params.courtName}
        accessoryLeft={renderBackAction}
        accessoryRight={renderProfileAction}
      />

      <Divider />

      {loading && <LoadingScreen />}

      {/* RENDER LOCATION / FEED*/}
      <GameFeed
        setLoading={setLoading}
        data={{
          games: route.params.games,
          thisPlayer: route.params.thisPlayer,
        }}
      />
    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
  innerContainerFeed: {
    height: "77%",
    marginTop: ".5rem",
  },
  innerContainerMap: {
    height: "82%",
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
  switchHolder: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default MapFeed;
