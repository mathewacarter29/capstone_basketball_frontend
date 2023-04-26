// style
import EStyleSheet from "react-native-extended-stylesheet";

// amplify
import { Amplify } from "aws-amplify";
import config from "./src/aws-exports";

// ui kitten
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { default as theme } from "./custom-theme.json";

// navigator
import { AppNavigator } from "./screens/Navigator.component";

Amplify.configure(config);

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <AppNavigator />
      </ApplicationProvider>
    </>
  );
}

EStyleSheet.build();
