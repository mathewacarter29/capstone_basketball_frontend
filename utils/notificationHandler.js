import { Notifications } from "expo";
import * as rootNavigation from "./rootNavigation";
// import * as Device from "expo-device";
// import { useNavigation } from "@react-navigation/native";
// import React from "react";
// import { Navigation } from "@react-navigation/native";

export function notificationHandler() {
  //const navigation = useNavigation();
  //console.log("navigation object in handler.js ", navigation);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      setNotification(notification);
    }
  );

  responseListener.current =
    Notifications.addNotificationResponseReceivedListener((response) => {
      title = response.notification.request.content.title;
      if (title === "Game Invitation") {
        game = response.notification.request.content.data.item;
        //navigate to game
        //navigation.navigate("GameDetails", { game });
        console.log("recognized this is a game invitation");
      }
    });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
}

//export default notificationHandler;
