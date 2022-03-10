import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, SafeAreaView } from "react-native";
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
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
const MainStack = createStackNavigator();
import { Firebase, onMessageListener } from "./config/firebase/firebase";

export default function App() {
  const [dimensions, setDimensions] = useState({ window, screen });
  const [width, setWidth] = useState(window.width);
  const statusbarHeight = StatusBar.statusbarHeight || 0;

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
    if (!store.getState().business)
      store.dispatch({
        type: "FETCH_BUSINESS",
        payload: {
          request: {
            url: `api/business/fetchByName`,
            method: "POST",
            data: {
              name: "Demo Business",
            },
          },
        },
      });
  }, [store.getState().business]);

  String.prototype.capitalize = function () {
    return this ? this.charAt(0).toUpperCase() + this.slice(1) : this;
  };

  let windowHeight = dimensions.window.height;
  let deviceHeight = dimensions.screen.height;
  let bottomNavBarHeight = deviceHeight - windowHeight;
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
                    windowHeight +
                    statusbarHeight +
                    (Platform.OS === "android" ? bottomNavBarHeight : 0) -
                    (Platform.OS === "android" && bottomNavBarHeight > 0
                      ? 50
                      : 0),
                  maxHeight:
                    windowHeight +
                    statusbarHeight +
                    (Platform.OS === "android" ? bottomNavBarHeight : 0) -
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
