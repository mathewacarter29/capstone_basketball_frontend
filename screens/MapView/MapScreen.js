import React from "react";
import {
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";

import MapView from 'react-native-maps';
import {PROVIDER_GOOGLE, Marker }  from 'react-native-maps';
import EStyleSheet from "react-native-extended-stylesheet";

this.state = {
    markers: [
        {
            id: "1",
            title: "McComas",
            latitude : 37.220828,
            longitude : -80.422655,
    
        },
        {
            id: "2",
            title: "Bubble",
            latitude : 37.215838,
            longitude : -80.418904,
        }
      ]
};



function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Profile")}
        >
            <Image
            style={styles.image}
            source={require("../../assets/profile_icon.png")}
            />

            <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>


        <View style={styles.innerContainer}>

            <Text style={styles.topText}>Courts Map</Text>
            
            <MapView style={styles.map} 
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
                    coordinate={{latitude: 37.220828 , longitude: -80.422655}}
                />
                {/* Bubble */}
                <Marker
                    coordinate={{latitude: 37.215838 , longitude: -80.418904}}
                />
                {/* Oak Lane Court */}
                <Marker
                    coordinate={{latitude: 37.227031 , longitude: -80.437552}}
                />
                {/* Blacksburg Rec Center */} 
                <Marker
                    coordinate={{latitude: 37.243998 , longitude: -80.411862}}
                />
                {/* Pritchard Courts */}
                <Marker
                    coordinate={{latitude: 37.224828 , longitude: -80.418849}}
                />

            </MapView>
        </View>

        <View style={styles.row} >
            <TouchableOpacity>
                <Text> Map View </Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text> Game View </Text>
            </TouchableOpacity>
        </View>

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
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: ".25rem",
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
    height: "70%",
    marginTop: "6.5rem",
  },
  map: {
    marginLeft: '2%',
    marginRight: '2%',
    height: '100%',
    borderRadius: "1rem",
  },
  row: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: "1rem",
    marginTop: "3rem",
    marginLeft: '2%',
    marginRight: '2%',
    justifyContent: 'space-evenly',
  },
});

export default HomeScreen;


