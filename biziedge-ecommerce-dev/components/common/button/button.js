import React, { useContext } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";
import { DimensionContext } from "../../dimensionContext";
import Icon from "../icon";

export default function Button({
  title,
  pressFunc,
  style,
  textStyle,
  icon,
  facebookIcon,
  googleIcon,
}) {
  const { window } = useContext(DimensionContext);
  return (
    <View style={[style, styles.buttomStyle]}>
      <TouchableOpacity
        style={{
          padding: 10,
          paddingRight: 30,
          paddingLeft: 30,
          flexDirection: "row",
        }}
        onPress={pressFunc}
      >
        {facebookIcon ? (
          <View
            style={{
              flex: 0.5,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Image
              style={{ width: 25, height: 25 }}
              source={require("../../../assets/facebook.jpg")}
            ></Image>
          </View>
        ) : (
          <></>
        )}
        {googleIcon ? (
          <View
            style={{
              flex: 0.5,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Image
              style={{ width: 25, height: 25 }}
              source={require("../../../assets/google.png")}
            ></Image>
          </View>
        ) : (
          <></>
        )}
        <Text
          style={[
            {
              color: "#000",
              textAlign: "center",
              fontSize: 20 * (window.height * 0.001),
              flex: 1,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>

        {icon ? (
          <View
            style={{
              flex: 0.5,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Icon name="forwardArrow"></Icon>
          </View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttomStyle: {
    alignSelf: "center",
    flex: 1,
    // backgroundColor: "#DC143C",
    width: "50%",
    marginBottom: 10,
    borderRadius: 25,
    marginTop: 10,
    // maxHeight: 40,
    justifyContent: "center",
    borderWidth: 0.5,
  },
});
