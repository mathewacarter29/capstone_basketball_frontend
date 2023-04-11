import React from "react";
import { Text, TouchableOpacity, Image, View } from "react-native";

import MapView from "react-native-maps";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import EStyleSheet from "react-native-extended-stylesheet";

function showCourtFeed(props) {
  console.log(props);
}

function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.topText}>Map View</Text>
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
        {/* McComas */}
        <Marker
          coordinate={{ latitude: 37.220828, longitude: -80.422655 }}
          onPress={() => showCourtFeed("McComas ")}
        />
        {/* Bubble */}
        <Marker
          coordinate={{ latitude: 37.215838, longitude: -80.418904 }}
          onPress={() => showCourtFeed("Bubble")}
        />
        {/* Oak Lane Court */}
        <Marker
          coordinate={{ latitude: 37.227031, longitude: -80.437552 }}
          onPress={() => showCourtFeed("pressed oaklane")}
        />
        {/* Blacksburg Rec Center */}
        <Marker
          coordinate={{ latitude: 37.243998, longitude: -80.411862 }}
          onPress={() => showCourtFeed("bb rec center")}
        />
        {/* Pritchard Courts */}
        <Marker
          coordinate={{ latitude: 37.224828, longitude: -80.418849 }}
          onPress={() => showCourtFeed("Pritchard Courts")}
        />
      </MapView>
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
  topText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: "1rem",
  },
});

export default MapScreen;
