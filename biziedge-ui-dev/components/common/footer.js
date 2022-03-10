import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import Button from "./buttom/button";

export default function Footer({ name, displayItems }) {
  return (
    // <View style={styles.mainviewStyle}>
    <View style={styles.footer}>{displayItems ? displayItems : <></>}</View>
    // </View>
  );
}
const styles = StyleSheet.create({
  footer: {
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  // bottomButtons: {
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     flex: 1,
  // },
  // footerText: {
  //     color: 'white',
  //     fontWeight: 'bold',
  //     alignItems: 'center',
  //     fontSize: 18,
  // },
  // textStyle: {
  //     alignSelf: 'center',
  //     color: 'orange'
  // },
  // scrollViewStyle: {
  //     borderWidth: 2,
  //     borderColor: 'blue'
  // }
});
