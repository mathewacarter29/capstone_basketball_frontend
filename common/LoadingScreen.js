import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, ActivityIndicator } from "react-native";

function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large"></ActivityIndicator>
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(300, 300, 300, 0.8)",
    alignItems: "center",
    position: "absolute",
    top: "0%",
    zIndex: 100,
    justifyContent: "center",
  },
});

export default LoadingScreen;
