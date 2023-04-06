import React from "react";
import { Text, TouchableOpacity, Image, View } from "react-native";

import MapView from "react-native-maps";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import EStyleSheet from "react-native-extended-stylesheet";

function MapScreen({ navigation }) {
  return (
    <View style={styles.container}>
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
          onPress={() => console.log("McComas ")}
        />
        {/* Bubble */}
        <Marker
          coordinate={{ latitude: 37.215838, longitude: -80.418904 }}
          onPress={() => console.log("Bubble")}
        />
        {/* Oak Lane Court */}
        <Marker
          coordinate={{ latitude: 37.227031, longitude: -80.437552 }}
          onPress={() => console.log("pressed oaklane")}
        />
        {/* Blacksburg Rec Center */}
        <Marker
          coordinate={{ latitude: 37.243998, longitude: -80.411862 }}
          onPress={() => console.log("Blacksburg Rec Center")}
        />
        {/* Pritchard Courts */}
        <Marker
          coordinate={{ latitude: 37.224828, longitude: -80.418849 }}
          onPress={() => console.log("Pritchard Courts")}
        />
      </MapView>
    </View>
  );
}

const styles = EStyleSheet.create({
  wrapper: {
    height: "80%",
  },
  container: {
    flex: "1",
  },
  topText: {
    color: "#2c3233",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: ".5rem",
    paddingTop: ".5rem",
  },
  button: {
    position: "absolute",
    right: "4%",
    top: "4%",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 52,
  },
  innerContainer: {
    height: "75%",
    marginTop: "6.5rem",
  },
  map: {
    marginLeft: "2%",
    marginRight: "2%",
    height: "100%",
    borderRadius: "1rem",
  },
  row: {
    backgroundColor: "#ef9031",
    flexDirection: "row",
    borderRadius: "1rem",
    marginTop: "1rem",
    marginLeft: "2%",
    marginRight: "2%",
    justifyContent: "space-evenly",
  },
});

export default MapScreen;
