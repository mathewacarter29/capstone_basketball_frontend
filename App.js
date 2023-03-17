import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import SignIn from "./screens/SignIn/SignIn";
import EStyleSheet from "react-native-extended-stylesheet";

export default function App() {
  return (
    <View style={styles.container}>
      <SignIn />
    </View>
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
