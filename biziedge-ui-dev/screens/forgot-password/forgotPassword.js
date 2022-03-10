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
import { sendCode } from "../../redux/actions/login.action";
import { verifyCode } from "../../redux/actions/login.action";
import { addError, addInfo } from "../../redux/actions/toast.action";
import { passwordReset } from "../../redux/actions/login.action";

const forgotPassword = ({
  sendCode,
  code,
  addInfo,
  passwordReset,
  verifyCode,
  navigation,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
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
      <View style={{ flex: 1, flexDirection: "row" }}>
        {code === "EMAIL" ? (
          <View style={styles.container2}>
            <Text style={styles.text}>BIZI EDGE</Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                color: "grey",
                marginLeft: 5,
                maxWidth: "90%",
              }}
            >
              Enter the email associated with your account and we'll send a code
              to reset your password
            </Text>
            <AppInputBox
              placeholder={"Email"}
              placeholderTextColor={"#43325D"}
              smallTextInputStyle={styles.textInput}
              labelStyle={styles.label}
              onChangeText={(e) => setUserEmail(e)}
              required={true}
              validateNow={validateNow}
              isValid={(n) => setForm({ ...form, name: n })}
            ></AppInputBox>

            <Button
              style={{ minWidth: 120, maxWidth: "20%" }}
              title="Send Code"
              textStyle={{ color: "#fff" }}
              pressFunc={() => {
                sendCode({ email: userEmail }),
                  addInfo("Code sent successfully", 3000);
              }}
            ></Button>
          </View>
        ) : code === "CODE" ? (
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
                  email: userEmail,
                  code: verificationCode,
                });
              }}
            ></Button>
          </View>
        ) : code === "VERIFIED" ? (
          <View style={styles.container2}>
            <Text style={styles.text}>BIZI EDGE</Text>
            <AppInputBox
              secureTextEntry={true}
              value={newPassword}
              placeholder={"New Password"}
              placeholderTextColor={"#43325D"}
              smallTextInputStyle={styles.textInput}
              labelStyle={styles.label}
              onChangeText={(e) => setNewPassword(e)}
              required={true}
              validateNow={validateNow}
              isValid={(n) => setForm({ ...form, password: n })}
            ></AppInputBox>
            <AppInputBox
              secureTextEntry={true}
              placeholder={"Confirm Password"}
              placeholderTextColor={"#43325D"}
              smallTextInputStyle={styles.textInput}
              labelStyle={styles.label}
              onChangeText={(e) => setConfirmPassword(e)}
              required={true}
              validateNow={validateNow}
              isValid={(n) => setForm({ ...form, password: n })}
            ></AppInputBox>

            <Button
              style={{ minWidth: 120, maxWidth: "20%" }}
              title="Reset Password"
              textStyle={{ color: "#fff" }}
              pressFunc={() => {
                if (form && form.password && newPassword === confirmPassword) {
                  passwordReset({
                    email: userEmail,
                    password: confirmPassword,
                  }),
                    navigation.navigate("login");
                } else {
                  setValidateNow(true);
                }
              }}
            ></Button>
          </View>
        ) : (
          <></>
        )}
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
export default connect(mapStateToProps, {
  sendCode,
  addInfo,
  verifyCode,
  passwordReset,
})(forgotPassword);
