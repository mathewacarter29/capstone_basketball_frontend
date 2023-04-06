import EStyleSheet from "react-native-extended-stylesheet";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function BackArrow(props) {
  navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.back}
      onPress={() => navigation.navigate(props.location)}
    >
      <Image source={require("../assets/back_arrow_icon.png")} />
    </TouchableOpacity>
  );
}

const styles = EStyleSheet.create({
  back: {
    position: "absolute",
    left: "4%",
    top: "6%",
    zIndex: 1,
  },
});

export default BackArrow;
