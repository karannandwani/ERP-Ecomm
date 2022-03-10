import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { DimensionContext } from "../../dimensionContext";
import Pipe from "../../utils/pipe";

const ProductComponent = ({ price, item }) => {
  let pipe = new Pipe();
  const { window } = useContext(DimensionContext);
  return (
    <View
      style={{
        flex: 1,
        marginLeft: 5,
        backgroundColor: "#fff",
        maxHeight: 120,
        minHeight: 120,
        maxWidth: 100,
        minWidth: window.width > 900 ? 210 : 100,
      }}
    >
      <Image
        style={{
          flex: 1,
          margin: 2,
          // maxHeight: 80,
          minHeight:
            window.height > 900 ? window.height / 8 : window.height / 20,
          // maxWidth: 80,
          minWidth: window.width > 800 ? window.width / 7 : window.width / 25,
          borderRadius: 10,
        }}
        source={
          item.product.image.length > 0
            ? {
                uri: `data:image/jpeg;base64,${
                  (
                    item.product.image.find((x) => x.default) ||
                    item.product.image[0]
                  ).image
                }`,
              }
            : require("../../../assets/products.png")
        }
      />
      <Text
        style={{
          alignSelf: "center",
          flex: 1,
          maxHeight: 15,
          fontSize:
            Platform.OS === "android" || Platform.OS === "ios"
              ? 17 * (window.height * 0.001)
              : window.height > 800
              ? 17
              : 20 * (window.height * 0.001),
          marginRight: 7,
        }}
      >
        {item.product.name}
      </Text>

      <Text
        style={{
          flex: 1,
          maxHeight: 20,
          fontSize:
            Platform.OS === "android" || Platform.OS === "ios"
              ? 17 * (window.height * 0.001)
              : window.height > 800
              ? 17
              : window.height < 500
              ? 10
              : 20 * (window.height * 0.001),
          marginRight: 7,
          alignSelf: "center",
        }}
      >
        {pipe.formatter.format(item.productPrice)}
        {" x "}
        {item.ordNoOfProduct}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: "#fff",
    maxHeight: 120,
    minHeight: 120,
    maxWidth: 100,
    minWidth: 100,
  },
  ordimg: {
    flex: 1,
    margin: 2,
    maxHeight: 80,
    minHeight: 60,
    maxWidth: 80,
    minWidth: 60,
    borderRadius: 10,
  },
});
export default ProductComponent;
