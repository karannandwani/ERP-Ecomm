import React, { useState } from "react";
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
import { connect } from "react-redux";
import Icon from "../../components/common/icon";
import { passwordReset } from "../../redux/actions/login.action";

const resetPassword = ({ navigation, route, passwordReset }) => {
  const [newPassword, setNewPassword] = useState("");
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
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
          placeholder={"New Password"}
          placeholderTextColor={"#43325D"}
          smallTextInputStyle={styles.textInput}
          labelStyle={styles.label}
          onChangeText={(e) => setNewPassword(e)}
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, password: n })}
        ></AppInputBox>

        <Button
          style={{ minWidth: 120, maxWidth: "20%" }}
          title="Reset Password"
          textStyle={{ color: "#fff" }}
          pressFunc={() => {
            if (form && form.password) {
              passwordReset({
                email: route.params.email,
                password: newPassword,
              }),
                navigation.navigate("login");
            } else {
              setValidateNow(true);
            }
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
    maxWidth: Platform.OS === "android" || Platform.OS === "ios" ? "86%" : 400,
    margin: 5,
  },
  label: {
    marginLeft: 42,
  },
  placeholderColor: {
    color: "#43325D",
  },
});
export default connect(null, { passwordReset })(resetPassword);
