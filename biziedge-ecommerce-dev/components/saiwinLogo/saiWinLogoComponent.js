import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  image,
  Pressable,
} from "react-native";
import { Dimensions, Platform, SafeAreaView } from "react-native";
import { DimensionContext } from "../dimensionContext";

const saiWinLogo = ({
  innerContainerStyle,
  onPressIcon,
  backIconStyle,
  imageStyle,
  onPressLogo,
  containerStyle,
}) => {
  const { window } = useContext(DimensionContext);

  return (
    <View
      style={
        ([
          {
            flex: 1,
            backgroundColor: "#fff",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          },
        ],
        containerStyle)
      }
    >
      <View
        style={
          (innerContainerStyle,
          {
            // backgroundColor: "red",

            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          })
        }
      >
        <View>
          <TouchableOpacity onPress={onPressIcon}>
            <Image
              source={require("../../assets/back.png")}
              resizeMode="contain"
              resizeMethod="scale"
              style={[
                {
                  minHeight:
                    window.height > 700
                      ? window.height / 50
                      : window.height / 50,
                  minWidth:
                    window.width > 450 ? window.width / 50 : window.width / 27,
                  maxHeight:
                    window.height > 700
                      ? window.height / 50
                      : window.height / 50,
                  maxWidth:
                    window.width > 450 ? window.width / 50 : window.width / 27,
                },
                backIconStyle,
              ]}
            ></Image>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ justifyContent: "center", flex: 9 }}
          onPress={onPressLogo}
        >
          <Image
            source={require("../../assets/icon.png")}
            resizeMode="contain"
            resizeMethod="scale"
            style={[
              {
                marginRight: 30,
                alignSelf: "center",
                maxHeight:
                  Platform.OS === "android"
                    ? window.height / 16
                    : window.height / 13,
                maxWidth:
                  Platform.OS === "android"
                    ? window.width / 2
                    : window.width / 2.5,

                minHeight: window.height / 10,
                minWidth: window.width / 2.5,
              },
              imageStyle,
            ]}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default saiWinLogo;
