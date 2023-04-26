import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import MapView from "react-native-maps";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import EStyleSheet from "react-native-extended-stylesheet";
import LoadingScreen from "../../common/LoadingScreen";
import ErrorPopup from "../../common/ErrorPopup";
import { DataStore } from "aws-amplify";
import { Location } from "../../src/models";
import { Text } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";

function MapScreen(props) {
  const navigation = useNavigation();

  function showCourtFeed(courtName) {
    const params = {
      games: props.games.filter((game) => game.location == courtName),
      courtName,
      thisPlayer: props.thisPlayer,
    };
    navigation.navigate("MapFeed", params);
  }

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function getLocations() {
    try {
      const allLocations = await DataStore.query(Location);
      //map the name to an array
      const formatLocations = allLocations.map((location, index) => (
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          onPress={() => showCourtFeed(location.name)}
          key={index}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../assets/pin.png")}
              style={{ width: 23, height: 40 }}
            />
            <Text>{location.name}</Text>
          </View>
        </Marker>
      ));
      setLocations(formatLocations);
      return true;
    } catch (error) {
      setErrorMessage("Error retrieving locations");
      setShowError(true);
      //if locations don't load for some reason then we should probably display an error message and route back
      console.log(error.message);
      setLoading(false);
      return false;
    }
  }

  useEffect(() => {
    // This needs to be async so we can wait for results before rendering
    (async () => {
      setLoading(true);
      if (!(await getLocations())) return;
      setShowError(false);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.227702,
          longitude: -80.422125,
          latitudeDelta: 0.035,
          longitudeDelta: 0.035,
        }}
      >
        {locations}
      </MapView>
      {showError && <ErrorPopup errorMessage={errorMessage} />}
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: "1",
    borderRadius: 1,
  },
  map: {
    marginLeft: "2%",
    marginRight: "2%",
    flex: 1,
    borderRadius: "1rem",
  },
});

export default MapScreen;
