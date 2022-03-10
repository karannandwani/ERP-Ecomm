import React, { useState } from "react";
// import { Button, TextInput, View } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  PixelRatio,
} from "react-native";
import Button from "./button/button";
import AppInputBox from "../../components/common/inputTextWithoutBorder";
// import Card from "../../components/common/cards/card";
// import AppButtom from "../../components/common/buttom/appButtom";

export const Login = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={styles.container2}>
        <Text style={styles.text}>BIZI Edge</Text>
        <AppInputBox
          placeholder={"Username"}
          placeholderTextColor={styles.placeholderColor}
          smallTextInputStyle={styles.textInput}
          labelStyle={styles.label}
          onChangeText={(e) => setUser(e)}
        ></AppInputBox>
        <AppInputBox
          placeholder={"Password"}
          placeholderTextColor={styles.placeholderColor}
          smallTextInputStyle={styles.textInput}
          labelStyle={styles.label}
          secureTextEntry={true}
          onChangeText={(e) => setPassword(e)}
          secureTextEntry={true}
        ></AppInputBox>

        <TouchableOpacity style={{ width: "60%", margin: 5 }}>
          <Text style={{ alignSelf: "flex-end" }}>Forgot Password</Text>
        </TouchableOpacity>

        <Button
          title={"Login"}
          pressFunc={() => {
            onLogin({
              email: user,
              password: password,
            });
            // navigation.navigate(routeTo)
          }}
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    flexDirection: "column",
  },
  container2: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: "100%",
  },
  text: {
    marginBottom: "6%",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    fontSize: 16,
    fontWeight: "normal",
    flex: 1,
    fontSize: 15 * PixelRatio.getFontScale(),
    width: "100%",
    maxHeight: 60,
    minHeight: 28,
    maxWidth: 400,
    margin: 5,
    outlineStyle: "none",
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  label: {
    marginLeft: 42,
  },
  placeholderColor: {
    color: "#43325D",
  },
});
