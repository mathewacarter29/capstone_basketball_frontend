import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text } from "react-native";
import Button from "../../common/Button";
import { TouchableOpacity } from "react-native";

const Game = ({item}) => (

  <View style={styles.item}>


    <Text style={styles.title}>{item.title}</Text>

    <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Location: </Text>
        {item.location}
    </Text>

    <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Date: </Text>
        {item.date}
    </Text>

    <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Time: </Text>
        {item.time}
    </Text>


    <View style={styles.row}>

      <Text> Accepted </Text>
      <TouchableOpacity >
        <Text> 15 </Text>
      </TouchableOpacity>
      <Text> Rejected </Text>
      <TouchableOpacity >
        <Text> 7 </Text>
      </TouchableOpacity>

    </View>


    
  </View>
);



const styles = EStyleSheet.create({
  text: {
    fontSize: 18,
    margin: "0.25rem",
  },
  item: {
    backgroundColor: 'orange',
    marginTop: "1rem",
    padding: "0.5rem",
    borderRadius: "1rem",
    shadowOpacity: 0.2,
  },
  title: {
    fontSize: 32,
  },
  row: {
    flexDirection: 'row',
  },
});


export default Game;

