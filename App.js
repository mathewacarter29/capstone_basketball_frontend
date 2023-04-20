import EStyleSheet from "react-native-extended-stylesheet";
import GetStarted from "./screens/GetStarted";
import { Amplify } from "aws-amplify";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./utils/rootNavigation";
import { useState, useEffect, useRef } from "react";
import config from "./src/aws-exports";
import * as rootNavigation from "./utils/rootNavigation";
import * as Notifications from "expo-notifications";

// navigation screens
import EmailVerification from "./screens/EmailVerification";
import LogIn from "./screens/LogIn";
import SignUp from "./screens/SignUp";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import Profile from "./screens/Profile";
import CreateGame from "./screens/CreateGame";
import GameDetails from "./screens/GameDetails";
import UpdateGame from "./screens/UpdateGame";

Amplify.configure(config);
const Stack = createNativeStackNavigator();

//notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  //notification listeners and responders
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        title = response.notification.request.content.title;
        //check what the notification is for
        if (title === "Game Invitation") {
          item = response.notification.request.content.data.item;
          //navigate to game
          rootNavigation.navigate("GameDetails", { item });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  });

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="GetStarted"
          component={GetStarted}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateGame"
          component={CreateGame}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GameDetails"
          component={GameDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateGame"
          component={UpdateGame}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

EStyleSheet.build();
