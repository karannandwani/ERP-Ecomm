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
  Platform,
} from "react-native";
import Button from "../../components/common/buttom/button";
import AppInputBox from "../../components/common/inputTextWithoutBorder";
// import Card from "../../components/common/cards/card";
// import AppButtom from "../../components/common/buttom/appButtom";

export const Login = ({ onLogin, onPress }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {Platform.OS === "web" ? (
        <View style={styles.container1}>
          <ImageBackground
            source={require("../../assets/main.jpg")}
            style={styles.image}
          ></ImageBackground>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.container2}>
        <Text style={styles.text}>BIZI EDGE</Text>
        <AppInputBox
          placeholder={"Username"}
          placeholderTextColor={"#43325D"}
          smallTextInputStyle={styles.textInput}
          labelStyle={styles.label}
          onChangeText={(e) => setUser(e)}
          keyboardType={"email-address"}
        ></AppInputBox>
        <AppInputBox
          iconName={hidePass ? "eyeSlash" : "eye"}
          onPressEye={() => setHidePass(!hidePass)}
          eyeIcon={true}
          placeholder={"Password"}
          placeholderTextColor={"#43325D"}
          smallTextInputStyle={styles.textInput}
          labelStyle={styles.label}
          secureTextEntry={hidePass ? true : false}
          onChangeText={(e) => setPassword(e)}
        ></AppInputBox>
        <TouchableOpacity onPress={onPress} style={{ margin: 5 }}>
          <Text
            style={{
              alignSelf: "flex-end",
              textDecorationLine: "underline",
              color: "blue",
            }}
          >
            Forgot Password
          </Text>
        </TouchableOpacity>
        <Button
          style={{ minWidth: 120, maxWidth: "25%" }}
          title="Login"
          textStyle={{ color: "#fff" }}
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#43425D",
  },
  textInput: {
    fontSize: 16,
    fontWeight: "normal",
    flex: 1,
    fontSize: 15 * PixelRatio.getFontScale(),
    width: "100%",
    maxHeight: 60,
    minHeight: 40,
    maxWidth: Platform.OS === "android" || Platform.OS === "ios" ? 300 : 400,
    margin: 5,
    right: 10,
  },
  label: {
    marginLeft: 42,
  },
  placeholderColor: {
    color: "#43325D",
  },
});
