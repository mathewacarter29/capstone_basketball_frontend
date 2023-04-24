import { Amplify } from "aws-amplify";
import { useState, useEffect, useRef } from "react";
import config from "./src/aws-exports";
import * as rootNavigation from "./utils/rootNavigation";
import * as Notifications from "expo-notifications";
// style
import EStyleSheet from "react-native-extended-stylesheet";
// ui kitten
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { default as theme } from "./custom-theme.json";

// navigator
import { AppNavigator } from "./screens/Navigator.component";

Amplify.configure(config);

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
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <AppNavigator />
      </ApplicationProvider>
    </>
  );
}

EStyleSheet.build();
