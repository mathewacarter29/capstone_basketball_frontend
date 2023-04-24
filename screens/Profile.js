import EStyleSheet from "react-native-extended-stylesheet";
import Container from "../common/Container";
import { SafeAreaView, View, Image } from "react-native";
import { Auth } from "aws-amplify";
import { React, useState, useEffect } from "react";

import {
  Text,
  Button,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function Profile({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function getProfileData() {
    setLoading(true);
    try {
      response = await Auth.currentUserInfo();
      setName(response.attributes.name);
      setEmail(response.attributes.email);
    } catch (e) {
      // we dont do anything with exceptions right now
    }
    setLoading(false);
  }

  async function logOut() {
    setLoading(true);
    try {
      response = await Auth.signOut({ global: true });
      navigation.navigate("GetStarted");
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfileData();
  }, []);

  const navigateBack = () => {
    navigation.navigate("HomeScreen");
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <Container loadingState={loading}>
      <TopNavigation
        alignment="center"
        title="Profile"
        accessoryLeft={renderBackAction}
        style={styles.topNav}
      />

      <View style={styles.container}>
        <Text style={styles.text} category="h1">
          {" "}
          {name}{" "}
        </Text>

        <Image source={require("../assets/profile_icon.png")} />

        <Text style={styles.text}>
          <Text style={{ fontWeight: "bold" }}>Email: </Text>
          {email}
        </Text>

        <Button onPress={() => logOut()}>Log Out</Button>
      </View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: "1rem",
    justifyContent: "center",
  },
  text: {
    margin: "1rem",
    textAlign: "center",
  },
  topNav: {
    marginTop: "3rem"
  }
});

export default Profile;
