import EStyleSheet from "react-native-extended-stylesheet";
import Container from "../common/Container";
import { View, Text, Image } from "react-native";
import { Auth } from "aws-amplify";
import { React, useState, useEffect } from "react";
import Button from "../common/Button";

import { Storage } from 'aws-amplify';
import { TouchableOpacity, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';


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

  const pickImage = () => {
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
  
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const userId = 'your-user-id'; // Replace with the actual user ID
        const result = await uploadProfilePicture(response.uri, userId);
        console.log('Image uploaded:', result);
      }
    });
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
        onPress={pickImage}
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
