import React, { useState } from "react";
import { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { DimensionContext } from "../dimensionContext";

const selectionCircle = ({ style, firstCircle, secondCircle, thirdCircle }) => {
  const { window } = useContext(DimensionContext);
  return (
    <View style={[{ flex: 1, margin: 10, marginBottom: 15 }, style]}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          // backgroundColor:"red",

          maxHeight: 25,
          // paddingBottom: 10,
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <View style={styles.outerCircleStyle}>
          <View
            style={{
              maxWidth: 18,
              minWidth: 18,
              minHeight: 18,
              maxHeight: 18,
              borderRadius: 10,
              borderColor: "#D6D2D2",
              borderWidth: 1,
              backgroundColor:
                firstCircle || secondCircle || thirdCircle ? "#FA4248" : "",
            }}
          ></View>
        </View>
        <View
          style={{
            flex: 1,
            borderColor: "#D6D2D2",
            borderBottomWidth: 1,
            alignSelf: "center",
            borderBottomColor: secondCircle || thirdCircle ? "#FA4248" : "",
            // backgroundColor:"red"
          }}
        ></View>
        <View style={styles.outerCircleStyle}>
          {firstCircle ? (
            <></>
          ) : (
            <View
              style={{
                maxWidth: 18,
                minWidth: 18,
                minHeight: 18,
                maxHeight: 18,
                borderRadius: 10,
                borderColor: "#D6D2D2",
                borderWidth: 1,
                backgroundColor: secondCircle || thirdCircle ? "#FA4248" : "",
              }}
            ></View>
          )}
        </View>
        <View
          style={{
            flex: 1,
            borderColor: "#D6D2D2",
            borderBottomWidth: 1,
            alignSelf: "center",
            borderBottomColor: thirdCircle ? "#FA4248" : "",
          }}
        ></View>
        <View style={styles.outerCircleStyle}>
          {firstCircle || secondCircle ? (
            <></>
          ) : (
            <View
              style={{
                maxWidth: 18,
                minWidth: 18,
                minHeight: 18,
                maxHeight: 18,
                borderRadius: 10,
                borderColor: "#D6D2D2",
                borderWidth: 1,
                backgroundColor: thirdCircle ? "#FA4248" : "",
              }}
            ></View>
          )}
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          // marginTop: 10,
          // backgroundColor:"blue",
          maxHeight: 30,
          minHeight: 30,
          marginTop:
            Platform.OS === "android" || Platform.OS === "ios" ? 5 : 15,
        }}
      >
        <Text
          style={{
            color: "#000",
            marginRight: 5,
            fontSize: 25 * (window.height * 0.001),
          }}
        >
          Address
        </Text>
        <Text
          style={{
            color: secondCircle || thirdCircle ? "#000" : "#DFDFDF",
            marginLeft: 5,
            fontSize: 25 * (window.height * 0.001),
          }}
        >
          Payment
        </Text>
        <Text
          style={{
            color: thirdCircle ? "#000" : "#DFDFDF",
            marginLeft: 5,
            fontSize: 25 * (window.height * 0.001),
          }}
        >
          Summary
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  outerCircleStyle: {
    flex: 1,
    maxWidth: 28,
    minWidth: 28,
    minHeight: 28,
    maxHeight: 28,
    borderRadius: 15,
    borderColor: "#D6D2D2",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});
export default selectionCircle;
