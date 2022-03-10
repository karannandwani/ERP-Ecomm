import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { StyleSheet } from "react-native";
export default function Button({ title, pressFunc, style, textStyle }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={pressFunc}
      style={styles.appButtonContainer}
    >
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "rgb(67, 66, 93)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  appButtonText: {
    color: "#fff",
    alignSelf: "center",
    textTransform: "capitalize",
  },
});
