import EStyleSheet from "react-native-extended-stylesheet";
import { Image, TouchableOpacity } from "react-native";






function BackArrow(props) {

    return (
        <TouchableOpacity
          style={styles.back}
          onPress={() => props.navigation.navigate(props.location)}
        >
          <Image source={require("../assets/back_arrow_icon.png")} />
        </TouchableOpacity>
    )
}

const styles = EStyleSheet.create({
    back: {
        position: "absolute",
        left: "4%",
        top: "10%",
      }
})

export default BackArrow;