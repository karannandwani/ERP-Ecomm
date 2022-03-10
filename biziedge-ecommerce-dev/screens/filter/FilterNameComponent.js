import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
const FilterNameComponent = ({
  name,
  pressFunc,
  style,
  onSelection,
  count,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={pressFunc}>
        <Text style={{ marginTop: 10, marginLeft: 10 }}>{name}</Text>
      </TouchableOpacity>
      {count ? (
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            backgroundColor: "#FA4248",
            marginLeft: 20,
            alignSelf: "center",
          }}
        >
          <Text style={{ color: "#fff", alignSelf: "center" }}>{count}</Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 40,
    minHeight: 40,
    borderBottomWidth: 1,
    borderColor: "#C2C3C1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default FilterNameComponent;
