import React, { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Button from "../../components/common/button/button";
import { connect } from "react-redux";
import { login, sendOtp } from "../../redux/actions/login.action";
import config from "../../config/config";
import { DimensionContext } from "../../components/dimensionContext";

const SignUp = ({ login, otp, sendOtp, navigation, business }) => {
  const [phone, setPhone] = useState("");
  const { window } = useContext(DimensionContext);
  return (
    <View style={style.container}>
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#ffff",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "20%",
        }}
      >
        <Image
          style={{ width: window.width / 1.5, height: window.height / 5 }}
          resizeMode="contain"
          resizeMethod="scale"
          source={require("../../assets/icon.png")}
        />
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.26,
          shadowRadius: 10,
          elevation: 5,
          alignSelf: "center",
          top: 100,
          zIndex: 1,
          maxHeight: 330,
          minHeight: 330,
          width: "100%",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: window.width > 1000 ? 27 : 27 * (window.height * 0.001),
            fontWeight: "bold",
            color: "#000",
            alignSelf: "center",
            marginTop: 40,
          }}
        >
          Welcome
        </Text>
        <View>
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit={true}
            style={{
              alignSelf: "center",
              fontSize: window.width > 1000 ? 17 : 17 * (window.height * 0.001),
              marginTop: 5,
              color: "#787878",
            }}
          >
            Sign up to get started and experience
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: window.width > 1000 ? 17 : 17 * (window.height * 0.001),
              color: "#787878",
            }}
          >
            great shopping deals
          </Text>
        </View>

        <TextInput
          maxLength={10}
          keyboardType="numeric"
          placeholder="Phone"
          onChangeText={(e) => setPhone(e)}
          style={style.input}
        ></TextInput>

        <Button
          pressFunc={() => {
            sendOtp({ phone: phone, business: business?._id });
            if (phone !== "" && phone.length == 10) {
              navigation.navigate("Verification", {
                phone: phone,
                business: business?._id,
              });
            }
          }}
          textStyle={{
            color: "#fff",
            fontSize: window.width > 1000 ? 20 : 17 * (window.height * 0.001),
          }}
          style={{
            bottom: 20,
            minWidth: window.width > 1000 ? 300 : window.width / 1.5,
            maxWidth: window.width > 1000 ? 300 : window.width / 1.5,
            minHeight: window.height > 1300 ? 70 : 50,
            maxHeight: window.height > 1300 ? 70 : 50,
            backgroundColor: "#FA4248",
            borderColor: "#fff",
          }}
          title="CONTINUE"
        ></Button>
      </View>

      <View style={style.itemConatiner2}>
        {/* <Text
          style={{
            alignSelf: "center",
            fontWeight: "bold",
            fontSize: 18,
            color: "#787878",
            position: "relative",
            top: 120,
          }}
        >
          -OR-
        </Text> */}
        {/* <View style={{ marginTop: 150 }}>
          <Button
            textStyle={{ marginRight: 20 }}
            facebookIcon={true}
            style={{
              maxWidth: 350,
              minWidth: 350,
              minHeight: 50,
              maxHeight: 50,
              backgroundColor: "#fff",
              borderColor: "#787878",
            }}
            title="Sign in with Facebook"
          ></Button>
          <Button
            textStyle={{ marginRight: 22 }}
            googleIcon={true}
            style={{
              maxWidth: 350,
              minWidth: 350,
              minHeight: 50,
              maxHeight: 50,
              backgroundColor: "#fff",
              borderColor: "#787878",
            }}
            title="Sign in with Google"
          ></Button>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ alignSelf: "center", fontSize: 15 }}>
              Don't have an account?
            </Text>
            <TouchableOpacity>
              <Text style={{ color: "red", alignSelf: "center", fontSize: 15 }}>
                Signup
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#999291",
    justifyContent: "center",
    alignContent: "center",
  },
  itemConatiner1: {
    flex: 3,
    alignItems: "center",
  },
  itemConatiner2: {
    flex: 7,
    backgroundColor: "#fff",
  },
  input: {
    padding: 10,
    borderColor: "#E8E9EC",
    height: 40,
    // borderWidth: 2,
    width: "85%",
    alignSelf: "center",
    borderBottomColor: "#FA4248",
    // borderRightColor: "transparent",
    // borderLeftColor: "transparent",
    // borderTopColor: "transparent",
    // borderTopWidth: 0,
    borderBottomWidth: 2,
  },
  logo: {
    marginTop: 7,
    height: 70,
    width: 235,
  },
});
const mapStateToProps = ({ otp, business }) => ({
  otp,
  business,
});
export default connect(mapStateToProps, { login, sendOtp })(SignUp);
