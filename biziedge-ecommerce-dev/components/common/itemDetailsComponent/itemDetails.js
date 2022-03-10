import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "../icon";
import config from "../../../config/config";

import Pipe from "../../utils/pipe";
import { DimensionContext } from "../../dimensionContext";

const ItemDetails = ({ item, onSelection, onClick, currentCart }) => {
  const { window } = useContext(DimensionContext);
  const [cartProduct, setCartProduct] = useState(null);
  useEffect(() => {
    if (currentCart)
      setCartProduct(
        currentCart.products.find((x) => x.product._id === item._id && x.price)
      );
  }, [currentCart]);
  let pipe = new Pipe();

  const selectProduct = (product) => {
    onClick(product);
  };
  const selectItem = (item) => {
    onSelection(item);
  };

  return (
    <View
      style={{
        borderColor: "#DCDCDC",
        borderRadius: 10,
        borderWidth: 2,
        marginLeft:
          Platform.OS === "android"
            ? 10
            : window.width < 350
            ? window.width / 23
            : window.width > 700
            ? window.width / 36
            : window.width / 25,
        marginTop: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.5,

        maxHeight:
          Platform.OS === "android" || Platform.OS === "ios"
            ? window.height / 2.8
            : window.height / 3.1,
        maxWidth:
          Platform.OS === "android" || Platform.OS === "ios"
            ? window.width / 2.2
            : window.width > 450
            ? window.width / 3.6
            : window.width / 2.3,

        minHeight:
          Platform.OS === "android" || Platform.OS === "ios"
            ? window.height / 2.6
            : window.height > 800
            ? window.height / 2.7
            : window.width < 350
            ? window.height / 2.55
            : window.height / 2.65,
        minWidth:
          Platform.OS === "android" || Platform.OS === "ios"
            ? window.width / 2.2
            : window.width > 500
            ? window.width / 3.3
            : window.width < 300
            ? window.width / 2.2
            : window.width / 2.3,
      }}
    >
      <TouchableOpacity style={{ flex: 5 }} onPress={() => selectProduct(item)}>
        <Image
          style={{
            marginTop:
              Platform.OS === "android" || Platform.OS === "ios"
                ? window.height / 85
                : window.width > 450
                ? window.height / 60
                : window.height / 75,
            alignSelf: "center",

            maxHeight:
              Platform.OS === "android" || Platform.OS === "ios"
                ? 200
                : window.height / 4.26,
            maxWidth:
              Platform.OS === "android" || Platform.OS === "ios"
                ? window.width / 3
                : window.width / 2,

            minHeight:
              Platform.OS === "android" || Platform.OS === "ios"
                ? window.height / 3.6
                : window.height > 700
                ? window.height / 4.1
                : window.height / 4 + 5,
            minWidth:
              Platform.OS === "android" || Platform.OS === "ios"
                ? window.width / 2.5
                : window.width > 500
                ? window.width / 3.8
                : window.width / 3 + 15,
            borderRadius: 10,
          }}
          source={{
            uri: config.baseUrl + `/api/product/image/view?id=${item._id}`,
          }}
        ></Image>
      </TouchableOpacity>

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        style={{
          fontSize: 10 * (window.height * 0.002),
          marginLeft: 10,
          marginTop: 3,
        }}
      >
        {item?.name.capitalize()}
      </Text>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          {item?.discountedPrice ? (
            <View
              style={{
                flex: 1,
                marginLeft: 8,
                marginTop:
                  window.height > 1300
                    ? 20
                    : window.height > 1000 && window.width < 1030
                    ? 12
                    : 3,
              }}
            >
              <Text
                style={{
                  fontSize: 9 * (window.height * 0.002),
                  color: "#FA4248",
                }}
              >
                {pipe.formatter.format(item.discountedPrice)}
              </Text>
              <Text
                style={[
                  styles.discountPrice,
                  { fontSize: 9 * (window.height * 0.002) },
                ]}
              >
                {pipe.formatter.format(item?.price)}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  marginLeft: 7,
                  fontSize: 9 * (window.height * 0.002),
                  color: "#FA4248",
                }}
              >
                {pipe.formatter.format(item?.price)}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          {cartProduct && currentCart ? (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                maxHeight: window.height > 1000 ? 35 : 27,
                backgroundColor: "#ECE6E6",
                borderRadius: 15,
                // minHeight: window.height > 825 ? 30 : window.height / 35,
                // maxWidth: window.width > 500 ? 80 : window.width / 6,
                // minWidth:
                //   window.width > 1000
                //     ? window.width / 10
                //     : window.width > 500
                //     ? window.width / 19
                //     : window.width / 6,
                marginLeft: window.width / 20 - 6,
                marginRight: 5,
              }}
            >
              <View
                style={{
                  justifyContent: "center",

                  flex: 3,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    selectItem({
                      product: item._id,
                      ordNoOfProduct: cartProduct.ordNoOfProduct - 1,
                    })
                  }
                >
                  <Text
                    style={{
                      fontSize: window.width > 450 ? 17 : 0.04 * window.width,
                      marginLeft: 5,
                    }}
                  >
                    -
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  flex: 4,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: window.width > 450 ? 17 : 0.04 * window.width,
                  }}
                >
                  {cartProduct.ordNoOfProduct}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  flex: 3,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    selectItem({
                      product: item._id,
                      ordNoOfProduct: cartProduct.ordNoOfProduct + 1,
                    })
                  }
                >
                  <Text
                    adjustsFontSizeToFit={true}
                    style={{
                      alignSelf: "flex-end",
                      fontSize: window.width > 450 ? 17 : 0.04 * window.width,
                      marginRight: 5,
                    }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginRight: 7,
                  marginTop: window.height < 1000 ? 7 : null,
                }}
                onPress={() => {
                  selectItem({ product: item._id, ordNoOfProduct: 1 });
                }}
              >
                <Icon
                  height={window.height > 900 ? 65 : 25}
                  width={window.width > 500 ? 35 : 25}
                  fill="rgb(88,88,88)"
                  name="cart"
                ></Icon>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  discountPrice: {
    flex: 1,
    fontSize: 12,
    color: "#FA4248",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
});
export default ItemDetails;
