import EStyleSheet from "react-native-extended-stylesheet";
import Container from "../common/Container";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Auth, Storage } from "aws-amplify";
import { React, useState, useEffect } from "react";
import Button from "../common/Button";



function Profile({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const userId = 'your-user-id'; // Replace with the actual user ID
    const fetchProfilePicture = async () => {
      const url = await getProfilePictureUrl(userId);
      setImageUrl(url);
    };
    getProfileData();
    fetchProfilePicture();
  }, []);

  const uploadProfilePicture = async (uri, userId) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const key = `profile_pictures/${userId}/profile-picture.jpg`;
      const result = await Storage.put(key, blob, { contentType: 'image/jpeg' });
      return result;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };

  const getProfilePictureUrl = async (userId) => {
    try {
      const key = `profile_pictures/${userId}/profile-picture.jpg`;
      const url = await Storage.get(key);
      return url;
    } catch (error) {
      console.error('Error getting profile picture:', error);
    }
  };

  async function getProfileData() {
    setLoading(true);
    try {
      response = await Auth.currentUserInfo();
      setName(response.attributes.name);
      setEmail(response.attributes.email);
    } catch (e) {
      // we dont do anything with exceptions right now
    }
    setLoading(false);
  }

  async function logOut() {
    setLoading(true);
    try {
      response = await Auth.signOut({ global: true });
      navigation.navigate("GetStarted");
    } catch (e) {
      setLoading(false);
    }
  }

  return (
    <Container goBackTo="HomeScreen" loadingState={loading}>
      <View style={styles.container}>
        <Text style={styles.text}>Profile</Text>
        <TouchableOpacity
        onPress={pickImageAsync}
        style={styles.profilePictureContainer}
      >
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.profilePicture} />
        ) : (
          <Image
            source={require('../assets/profile_icon.png')}
            style={styles.profilePicture}
          />
        )}
      </TouchableOpacity>
        <Text style={styles.text_info}>Name: {name}</Text>
        <Text style={styles.text_info}>Email: {email}</Text>
        <Button title="Log Out" onPress={() => logOut()} />
      </View>
    </Container>
  );
}

const styles = EStyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: "1rem",
    justifyContent: "center",
  },
  text: {
    margin: "1rem",
    marginTop: "6rem",
    fontSize: 30,
    width: "80%",
    textAlign: "center",
  },
  back: {
    position: "absolute",
    left: "7%",
    top: "12%",
  },
  text_info: {
    margin: ".5rem",
    fontSize: 20,
    width: "80%",
  },

  profilePictureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});

export default Profile;
