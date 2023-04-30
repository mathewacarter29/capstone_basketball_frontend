import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// navigation screens
import GetStarted from "./GetStarted";
import LogIn from "./LogIn";
import HomeScreen from "./HomeScreen/HomeScreen";
import GameDetails from "./GameDetails";
import Profile from "./Profile";
import CreateGame from "./CreateGame";
import SignUp from "./SignUp";
import EmailVerification from "./EmailVerification";
import UpdateGame from "./UpdateGame";
import MapFeed from "./HomeScreen/MapFeed";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="GameDetails" component={GameDetails} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="CreateGame" component={CreateGame} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
      <Stack.Screen name="UpdateGame" component={UpdateGame} />
      <Stack.Screen name="MapFeed" component={MapFeed} />
    </Stack.Navigator>
  </NavigationContainer>
);
