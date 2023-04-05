import React, {useState} from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text } from "react-native";
import Container from "../common/Container";
import Button from "../common/Button";
import { DataStore, Auth } from "aws-amplify";
import LoadingScreen from "../common/LoadingScreen";
import { Game, Player } from "../src/models";

function epochToLocalDate(epoch) {
    const date = new Date(epoch * 1000); // Convert epoch to milliseconds
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get local month and pad with 0 if needed
    const day = ('0' + date.getDate()).slice(-2); // Get local day and pad with 0 if needed
    const year = date.getFullYear(); // Get local year
    return `${month}-${day}-${year}`;
  }
  
   function epochToLocalTime(epoch) {
    const date = new Date(epoch * 1000); // Convert epoch to milliseconds
    const hours = date.getHours(); // Get local hours
    const minutes = ('0' + date.getMinutes()).slice(-2); // Get local minutes and pad with 0 if needed
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = ('0' + (hours % 12 || 12)).slice(-2); // Convert to 12-hour format and pad with 0 if needed
    return `${formattedHours}:${minutes} ${ampm}`;
  }

function GameDetails({ route, navigation }) {
  const [loading, setLoading] = useState(false);

  console.log("route params, ", route.params.item);
  const details = route.params.item;
  console.log("details: ", details);
  const DUMMY_USERNAME = "Abir Rahaman";

    //gets current user
    async function getPlayer() {
        try {
          const response = await Auth.currentUserInfo();
          const player = await DataStore.query(Player, (p) =>
            p.email.eq(response.attributes.email)
          );
          return player[0];
        } catch (error) {
          setShowError(true);
          setErrorMessage(`Error getting player: ${error.message}`);
          console.log("Error getting player: ", error.message);
        }
      }

  async function isGameOwner() {
    // Use a dummy username until actual organizer names are used
    // We would need DUMMY_USERNAME to be the name of the current user
    const player = await getPlayer();
    return player.id == details.organizer;
  }

  function showDescription() {
    return details.description != "" && details.description != undefined;
  }

  function handleEdit() {
    navigation.navigate(("UpdateGame"), {
        game: route.params.item,
      });
  }
 
  async function handleDelete() {

    //setLoading(true);

    const toDelete = await DataStore.query(Game, details.id);
    DataStore.delete(toDelete);

    //setLoading(false);
    navigation.navigate("HomeScreen");
  }
  return (
    <Container goBackTo="HomeScreen">
    {loading && <LoadingScreen />}
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.topText}>Game details for {details.name}</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Date: </Text>
            {epochToLocalDate(details.datetime)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Location: </Text>
            {/* {details.location} */}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Time: </Text>
            {epochToLocalTime(details.datetime)}
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
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Edit Game Details" disabled={!isGameOwner()} onPress={handleEdit} />
          <Button title="Delete Game" disabled={!isGameOwner()} onPress={handleDelete} />
        </View>
      </View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  topText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    margin: "0.5rem",
    marginBottom: "3rem",
  },
  container: {
    flex: 1,
    marginTop: "7.5rem",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 20,
    margin: "0.5rem",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-end",
    marginBottom: "2rem",
  },
});

export default GameDetails;
