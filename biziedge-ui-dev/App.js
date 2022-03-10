import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  SafeAreaView,
  PermissionsAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import useCachedResources from "./hooks/useCachedResources";
import { persister, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Loader from "./components/common/loader";
import Toast from "./components/common/toast";
import EntryStack from "./navigation/entryStack";
import { DimensionContext } from "./components/dimensionContext";
import { Firebase, onMessageListener } from "./config/firebase/firebase";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
const MainStack = createStackNavigator();
import NetInfo from "@react-native-community/netinfo";

export default function App() {
  const [dimensions, setDimensions] = useState({ window, screen });
  const [width, setWidth] = useState(dimensions.window.width);
  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
    setWidth(window.width);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

  useEffect(() => {
    // async function checkPermission() {
    //   if (Platform.OS === "android") {
    //     try {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //         {
    //           title: "Storage Permission Required",
    //           message:
    //             "Application needs access to your storage to download File",
    //         }
    //       );
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         // Start downloading
    //       } else {
    //         // If permission denied then show alert
    //         Alert.alert("Error", "Storage Permission Not Granted");
    //       }
    //     } catch (err) {
    //       // To handle permission related exception
    //       console.log("++++" + err);
    //     }
    //   }
    // }
    // checkPermission();
    let unsubscribe = NetInfo.addEventListener((state) => {});
    return () => {
      unsubscribe();
    };
  }, []);

  let windowHeight = dimensions.window.height;
  let deviceHeight = dimensions.screen.height;
  let bottomNavBarHeight = deviceHeight - windowHeight;

  String.prototype.capitalize = function () {
    return this ? this.charAt(0).toUpperCase() + this.slice(1) : this;
  };

  const statusbarHeight = StatusBar.statusbarHeight || 0;
  let isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
          <DimensionContext.Provider value={dimensions}>
            <KeyboardAwareScrollView
              enableOnAndroid={false}
              nestedScrollEnabled={true}
            >
              <SafeAreaView
                key={"safeAreaView"}
                style={{
                  paddingTop: Platform.OS === "android" ? statusbarHeight : 0,
                  flex: 1,
                  minHeight:
                    Platform.OS === "web"
                      ? windowHeight
                      : windowHeight +
                        statusbarHeight +
                        bottomNavBarHeight -
                        (Platform.OS === "android" && bottomNavBarHeight > 0
                          ? 50
                          : 0),
                  maxHeight:
                    Platform.OS === "web"
                      ? windowHeight
                      : windowHeight +
                        statusbarHeight +
                        bottomNavBarHeight -
                        (Platform.OS === "android" && bottomNavBarHeight > 0
                          ? 50
                          : 0),
                }}
              >
                <NavigationContainer linking={{ enabled: true }}>
                  <MainStack.Navigator>
                    <MainStack.Screen
                      component={EntryStack}
                      options={{ headerShown: false }}
                      name="main"
                    ></MainStack.Screen>
                  </MainStack.Navigator>
                </NavigationContainer>
                <StatusBar style="auto" hidden={false} />
                <Toast></Toast>
                <Loader></Loader>
                <Firebase></Firebase>
              </SafeAreaView>
            </KeyboardAwareScrollView>
          </DimensionContext.Provider>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
