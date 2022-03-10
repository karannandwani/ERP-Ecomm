import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, Image, TextInput } from "react-native";
import Button from "../../components/common/button/button";
import { connect } from "react-redux";
import { login, sendOtp } from "../../redux/actions/login.action";
import { DimensionContext } from "../../components/dimensionContext";
import { useContext } from "react";

const Verification = ({ login, route }) => {
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [third, setThird] = useState(null);
  const [forth, setForth] = useState(null);
  let otpNum = first + second + third + forth;
  let firstTextInput = useRef(null);
  let secondTextInput = useRef(null);
  let thirdtextinput = useRef(null);
  let fourtextinput = useRef(null);
  const { window } = useContext(DimensionContext);
  useEffect(() => {
    firstTextInput.focus();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", marginTop: 60 }}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          resizeMethod="scale"
          source={require("../../assets/icon.png")}
        />
      </View>
      <View
        style={{
          flex: 2,
          alignItems: "center",
          marginBottom: "10%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.header}>Verification</Text>
        <View>
          <Text style={{ alignSelf: "center" }}>
            A 4-Digit pin has been sent to your mobile
          </Text>
          <Text style={{ alignSelf: "center" }}>
            Enter it below to continue
          </Text>
        </View>
        <View
          style={{ flex: 0.6, justifyContent: "center", flexDirection: "row" }}
        >
          <TextInput
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(e) =>
              e.length === 0
                ? firstTextInput.focus()
                : (secondTextInput.focus(), setFirst(e))
            }
            ref={(input) => {
              firstTextInput = input;
            }}
            // placeholder="FirstTextInput"
            returnKeyType={"next"}
            // onChange={() => {
            //   secondTextInput.focus();
            // }}
            style={styles.textinput}
            blurOnSubmit={false}
          />

          <TextInput
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(e) =>
              e.length === 0 ? firstTextInput.focus() : setSecond(e)
            }
            ref={(input) => {
              secondTextInput = input;
            }}
            style={styles.textinput}
            // placeholder="ThirdTextInput"
            onChange={() => {
              thirdtextinput.focus();
            }}
            blurOnSubmit={false}
          />

          <TextInput
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(e) =>
              e.length === 0 ? secondTextInput.focus() : setThird(e)
            }
            ref={(input) => {
              thirdtextinput = input;
            }}
            style={styles.textinput}
            // placeholder="ThirdTextInput"
            onChange={() => {
              fourtextinput.focus();
            }}
            maxLength={1}
            blurOnSubmit={false}
          ></TextInput>
          <TextInput
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(e) =>
              e.length === 0 ? thirdtextinput.focus() : setForth(e)
            }
            ref={(input) => {
              fourtextinput = input;
            }}
            style={styles.textinput}
            maxLength={1}
          ></TextInput>
        </View>
      </View>
      <View style={{ flex: 1, marginTop: 50 }}>
        <Button
          pressFunc={() => login({ ...route.params, otp: otpNum })}
          textStyle={{ color: "#fff" }}
          title="Continue"
          style={{
            backgroundColor: "#E33C18",
            minWidth: window.width > 1000 ? 300 : window.width / 1.7,
            maxWidth: window.width > 1000 ? 300 : window.width / 1.7,
            minHeight: window.height > 1300 ? 70 : 50,
            maxHeight: window.height > 1300 ? 70 : 50,
            borderColor: "white",
          }}
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    height: 70,
    width: 235,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: "10%",
  },
  textinput: {
    color: "#fff",
    margin: 10,
    backgroundColor: "grey",
    borderRadius: 4,
    textAlign: "center",
    minHeight: 50,
    minWidth: 50,
    maxHeight: 50,
    maxWidth: 50,
    fontSize: 20,
    fontWeight: "bold",
  },
});
const mapStateToProps = ({ otp }) => ({
  otp,
});
export default connect(mapStateToProps, { login, sendOtp })(Verification);
