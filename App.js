import SignUp from "./screens/SignUp";
import EStyleSheet from "react-native-extended-stylesheet";
import GetStarted from "./screens/GetStarted";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogIn from "./screens/LogIn";
import { Amplify, Auth } from "aws-amplify";
import config from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
// import signUpConfig from "./config/signUpConfig";

Amplify.configure(config);

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="GetStarted"
          component={GetStarted}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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

const signUpConfig = {
  header: "My Customized Sign Up",
  hideAllDefaults: true,
  signUpFields: [
    {
      label: "Full name",
      key: "name",
      required: true,
      displayOrder: 1,
      type: "string",
    },
    {
      label: "Email",
      key: "username",
      required: true,
      displayOrder: 2,
      type: "string",
    },
    {
      label: "Phone Number",
      key: "phone_number",
      required: true,
      displayOrder: 3,
      type: "string",
    },
    {
      label: "Password",
      key: "password",
      required: true,
      displayOrder: 4,
      type: "password",
    },
  ],
};

export default withAuthenticator(App, { signUpConfig });
