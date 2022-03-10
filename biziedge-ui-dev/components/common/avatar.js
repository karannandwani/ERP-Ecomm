import React from "react";
import { usestate } from "react";
import { Image, Platform } from "react-native";
import { View, StyleSheet } from "react-native";
const Avatar = ({ source, style, borderColor }) => {
  return (
    <View>
      <Image
        style={[
          {
            width: Platform.OS === "android" || Platform.OS === "ios" ? 35 : 42,
            height:
              Platform.OS === "android" || Platform.OS === "ios" ? 35 : 42,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: borderColor ? borderColor : "#ffd500",
          },
          style,
        ]}
        source={source ? source : require("../../assets/avatar.png")}
      ></Image>
    </View>
  );
};

export default Avatar;
