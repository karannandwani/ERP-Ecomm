import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Touchable,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
import Pipe from "../../utils/pipe";

const orderComponent = ({ item, onQtyChange }) => {
  const [dimensions, setDimensions] = useState({ window, screen });
  const [width, setWidth] = useState(dimensions.window.width);
  const [height, setHeight] = useState(dimensions.window.height);
  const [count, setCount] = useState(0);
  let pipe = new Pipe();

  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
    setWidth(window.width);
    setHeight(window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });
  return item ? (
    <View style={styles.container}>
      <View style={styles.box1}>
        <Image
          style={{
            flex: 1,
            maxHeight: height / 8 + 20,
            minHeight: height > 700 ? 100 : height / 8 + 20,
            maxWidth: width / 8,
            minWidth: width > 450 ? 100 : width / 3 - 20,
            borderRadius: 10,
          }}
          source={
            item.product.image?.length > 0
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
      </View>
      <View style={styles.box2}>
        <View style={{ flex: 1, marginLeft: width / 20 + 2 }}>
          <Text
            numberOfLines={2}
            style={{ fontSize: width > 450 ? 15 : 0.04 * width, marginTop: 5 }}
          >
            {item.product.name.capitalize()}
          </Text>
        </View>
        {item.price ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              maxHeight: height / 22,
              backgroundColor: "#ECE6E6",
              borderRadius: 15,
              minHeight: height > 800 ? 30 : height / 22,
              maxWidth: width > 450 ? 85 : width / 4.5,
              marginLeft: width / 20 - 6,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() =>
                  onQtyChange({
                    product: item.product._id,
                    ordNoOfProduct: item.ordNoOfProduct - 1,
                  })
                }
              >
                <Text
                  style={{
                    fontSize: width > 450 ? 25 : 0.04 * width,
                    marginLeft: 5,
                  }}
                >
                  -
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: width > 450 ? 15 : 0.04 * width,
                }}
              >
                {item.ordNoOfProduct}
              </Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() =>
                  onQtyChange({
                    product: item.product._id,
                    ordNoOfProduct: item.ordNoOfProduct + 1,
                  })
                }
              >
                <Text
                  style={{
                    fontSize: width > 450 ? 25 : 0.04 * width,
                    marginRight: 5,
                  }}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              maxHeight: height / 22,
              backgroundColor: "#ECE6E6",
              borderRadius: 15,
              minHeight: height > 800 ? 30 : height / 22,
              maxWidth: width > 450 ? 85 : width / 4.5,
              marginLeft: width / 20 - 6,
            }}
          >
            <Text style={{ justifyContent: "center" }}>FREE</Text>
          </View>
        )}
      </View>
      <View style={styles.box3}>
        <Text style={{ color: "red", marginRight: 10 }}>
          {pipe.formatter.format(item.price)}
        </Text>
        {item.price ? (
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <TouchableOpacity
              onPress={() =>
                onQtyChange({ product: item.product._id, ordNoOfProduct: 0 })
              }
            >
              <Image
                style={{ height: 38, width: 38 }}
                source={require("../../../assets/delete.webp")}
              ></Image>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  ) : (
    <></>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 4,
    flex: 1,
    flexDirection: "row",
    maxHeight: 120,
    minHeight: 100,
    minWidth: "94%",
    maxWidth: "93%",
    marginTop: 18,
    marginLeft: 15,
  },
  box1: {
    flex: 1,
    borderRadius: 10,
  },
  box2: {
    flex: 1,
    justifyContent: "space-between",
  },
  box3: {
    flex: 1,
    alignItems: "flex-end",
    padding: 4,
  },
  ordimg: {
    flex: 1,
    maxHeight: 100,
    minHeight: 100,
    maxWidth: 100,
    minWidth: 100,
    borderRadius: 10,
  },
});
export default orderComponent;
