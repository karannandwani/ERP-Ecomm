import React, { useContext } from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";
import Button from "../../components/common/button/button";
import { DimensionContext } from "../../components/dimensionContext";

const WelcomeScreen = ({ navigation }) => {
  const { window } = useContext(DimensionContext);
  return (
    <View style={style.container}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#999291",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          marginBottom: 100,
          alignItems: "center",
          alignContent: "center",
          // justifyContent: "space-evenly",
        }}
      >
        <View
          style={{
            backgroundColor: "#ffff",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "40%",
            marginBottom: 100,
          }}
        >
          <Image
            source={require("../../assets/icon.png")}
            resizeMode="contain"
            resizeMethod="scale"
            style={{ width: window.width / 1.5, height: window.height / 3 }}
          ></Image>
        </View>
        <Text
          style={{
            fontSize: 30 * (window.height * 0.001),
            fontWeight: "bold",
            color: "#fff",
            alignSelf: "center",
          }}
        >
          Welcome
        </Text>
      </View>

      <Button
        textStyle={{
          color: "#fff",
          fontSize: window.width > 1000 ? 20 : 20 * (window.height * 0.001),
        }}
        title="GET STARTED"
        style={{
          maxWidth: 280,
          minWidth: 250,
          bottom: 135,
          minHeight: 50,
          maxHeight: 50,
          backgroundColor: "#FA4248",
          borderColor: "#fff",
        }}
        icon={true}
        pressFunc={() => navigation.navigate("sign-up")}
      ></Button>
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
export default WelcomeScreen;
