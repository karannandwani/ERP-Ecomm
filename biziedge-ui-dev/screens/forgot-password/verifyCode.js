import React, { useState, useEffect } from "react";
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
import { verifyCode } from "../../redux/actions/login.action";
import { addError, addInfo } from "../../redux/actions/toast.action";
const codeVerfication = ({ route, navigation, verifyCode, code, addInfo }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [validateNow, setValidateNow] = useState(false);
  useEffect(() => {
    if (code?.message === true) {
      navigation.navigate("reset-password", {
        email: route.params.email,
      });
    } else {
      addError("Code doesn't match", 3000);
    }
  }, [code]);
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
          placeholder={"Enter the code here"}
          placeholderTextColor={"#43325D"}
          smallTextInputStyle={styles.textInput}
          labelStyle={styles.label}
          onChangeText={(e) => setVerificationCode(e)}
          required={true}
          validateNow={validateNow}
        ></AppInputBox>

        <Button
          style={{ minWidth: 120, maxWidth: "20%" }}
          title="Verify code"
          textStyle={{ color: "#fff" }}
          pressFunc={() => {
            verifyCode({
              email: route.params.email,
              code: verificationCode,
            }),
              addInfo("Code matched successfully", 3000);
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
const mapStateToProps = ({ code }) => ({
  code,
});
export default connect(mapStateToProps, { verifyCode, addInfo })(
  codeVerfication
);
