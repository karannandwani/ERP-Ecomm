import React, { useState, useEffect, useContext } from "react";
import { View, Image, TextInput } from "react-native";
import Button from "../common/buttom/button";
import { DimensionContext } from "../dimensionContext";
const ReceiveOrderComponent = ({ pressFunc, onChangeText }) => {
  const { window } = useContext(DimensionContext);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Image
          style={{ height: window.height / 4, width: "100%" }}
          source={require("../../assets/deliver1.jpg")}
        ></Image>
      </View>
      <View style={{ marginTop: 10 }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#E8E9EC",
            padding: 10,
            alignSelf: "stretch",
            backgroundColor: "#fff",
            minHeight: 40,
            maxWidth: "97%",
            marginLeft: 3,
          }}
          placeholder="Password"
          onChangeText={onChangeText}
        ></TextInput>
        <View style={{ marginTop: 10 }}>
          <Button pressFunc={pressFunc} title="Confirm Delivery"></Button>
        </View>
      </View>
    </View>
  );
};
export default ReceiveOrderComponent;
