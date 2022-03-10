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
  ScrollView,
  Platform,
} from "react-native";
import Icon from "../icon";
import { connect } from "react-redux";
import Button from "../../../components/common/button/button";
import { addToCart } from "../../../redux/actions/cart.action";

import config from "../../../config/config";
import { DimensionContext } from "../../dimensionContext";
import { addError } from "../../../redux/actions/toast.action";
import Pipe from "../../utils/pipe";
import Carousel from "../../imageSlider/Carousel";
const productDetails = ({
  route,
  addToCart,
  products,
  currentBeat,
  facility,
  navigation,
  business,
  addError,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (products && products.length > 0 && route && route.params) {
      setSelectedProduct({
        ...products.find((e) => e._id === route.params?.item),
      });
    }
  }, [products, route]);
  const add = () => {
    if (selectedProduct?.price) {
      if (facility) {
        addToCart({
          products: [{ product: selectedProduct._id, ordNoOfProduct: 1 }],
          beat: currentBeat._id,
          business: business?._id,

          facility: facility._id,
        });
      } else {
        addError(
          "Cannot add to cart, no nearby facility available for now!",
          3000
        );
      }
    } else {
      addError("No stock available for this product", 3000);
    }
  };
  let pipe = new Pipe();
  const { window } = useContext(DimensionContext);
  return selectedProduct ? (
    <View style={{ flex: 1, backgroundColor: "grey" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <View style={{ alignSelf: "center", flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.navigate("homeScreen")}>
            <Image
              style={{
                minHeight:
                  window.height > 700 ? window.height / 50 : window.height / 30,
                minWidth:
                  window.width > 450 ? window.width / 50 : window.width / 15,
                maxHeight:
                  window.height > 700 ? window.height / 50 : window.height / 50,
                maxWidth:
                  window.width > 450 ? window.width / 50 : window.width / 27,
                marginLeft: 5,
              }}
              source={require("../../../assets/left2.png")}
            ></Image>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontSize: 17,
              color: "#fff",
            }}
          >
            {selectedProduct?.name.capitalize()}
          </Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <View
        style={{
          flex: 4,
          borderRadius: 50,
          padding: 10,
        }}
      >
        <Carousel
          data={
            selectedProduct.image && selectedProduct.image.length > 0
              ? selectedProduct.image.map((x) => ({
                  ...x,
                  url: `/api/product/image/view?id=${selectedProduct._id}&imageId=${x._id}`,
                }))
              : [{ url: `/api/product/image/view?id=${selectedProduct._id}` }]
          }
          type="Product"
          navigation={navigation}
          imageStyle={{
            minHeight: "98%",
            maxHeight: "98%",
            width: "100%",
          }}
          cardStyle={{
            maxHeight:
              Platform.OS === "android" || Platform.OS === "ios"
                ? 245
                : window.height / 4.26,

            minHeight:
              Platform.OS === "android" || Platform.OS === "ios"
                ? window.height / 2.9
                : window.height > 700
                ? window.height / 2.8
                : window.height / 2.7,
            width: window.width - 35,
            borderRadius: 20,
          }}
        />
        {/* <Image
          style={{
            alignSelf: "center",
            maxHeight:
              Platform.OS === "android" || Platform.OS === "ios"
                ? 250
                : window.height / 4.26,

            minHeight:
              Platform.OS === "android" || Platform.OS === "ios"
                ? window.height / 2.9
                : window.height > 700
                ? window.height / 2.8
                : window.height / 2.7,
            width: "100%",
            borderRadius: 20,
          }}
          source={{
            uri:
              config.baseUrl +
              `/api/product/image/view?id=${selectedProduct._id}`,
          }}
        ></Image> */}

        <View
          style={{
            position: "absolute",
            bottom: 10,
            right: 20,
            height: 70,
            width: 70,
            borderRadius: 100,
            backgroundColor: "#fff",
            justifyContent: "center",
            zIndex: 2000,
            marginLeft: 12,
            borderWidth: 1,
            borderColor: "red",
            shadowColor: "#000",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 50,
            elevation: 15,
          }}
        >
          <Text style={{ color: "red", alignSelf: "center", fontSize: 15 }}>
            {pipe.formatter.format(selectedProduct?.price)}
          </Text>
        </View>
      </View>
      <View style={{ flex: 0.4 }}></View>
      <View
        style={{
          flex: 5,

          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          flexDirection: "column",
          marginHorizontal: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            justifyContent: "space-evenly",
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              flex: 5,
              justifyContent: "space-evenly",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                alignSelf: "flex-start",
                marginLeft: 35,
              }}
            >
              Brand
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                alignSelf: "flex-start",
                marginLeft: 35,
              }}
            >
              Category
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                alignSelf: "flex-start",
                marginLeft: 35,
              }}
            >
              Manufacturer
            </Text>
          </View>
          <View
            style={{
              flex: 5,
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <Text style={{ color: "#585858", alignSelf: "flex-start" }}>
              {selectedProduct?.brand.name.capitalize()}
            </Text>
            <Text style={{ color: "#585858", alignSelf: "flex-start" }}>
              {selectedProduct?.category.name.capitalize()}
            </Text>
            <Text style={{ color: "#585858", alignSelf: "flex-start" }}>
              {selectedProduct?.manufacturer.name.capitalize()}
            </Text>
          </View>
        </View>
        <View
          style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}
        >
          <ScrollView style={{ flex: 1.4 }}>
            <Text
              style={{
                color: "#585858",
                flexWrap: "wrap",
                marginLeft: 35,
                paddingBottom: 10,
              }}
            >
              {selectedProduct?.description}
            </Text>
          </ScrollView>
          <View style={{ flex: 0.7 }}>
            <TouchableOpacity
              onPress={() => add()}
              style={{ flex: 1.3, justifyContent: "flex-end" }}
            >
              <View
                style={{
                  height: 50,
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                  backgroundColor: "grey",
                  backgroundColor: "#FA4248",
                  alignContent: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#fff",
                    alignSelf: "center",
                  }}
                >
                  {selectedProduct?.price ? "ADD TO CART" : "OUT OF STOCK"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  ) : (
    <></>
  );
};
const mapStateToProps = ({
  products,
  currentCart,
  facility,
  currentBeat,
  business,
}) => ({
  products,
  currentCart,
  facility,
  currentBeat,
  business,
});
export default connect(mapStateToProps, {
  addToCart,
  addError,
})(productDetails);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailsStyle: {
    flex: 1,
    borderWidth: 1,
    marginTop: 5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "rgb(168,168,168)",
    flexDirection: "row",
  },
  upperContainerStyle: {
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "rgb(168,168,168)",
    flexDirection: "row",
  },
  deatils: {
    alignSelf: "center",
    color: "#FA4248",
  },
  imageView: {
    backgroundColor: "#fff",
    borderRadius: 100,
    height: "60%",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
    alignSelf: "center",
    top: 30,
    zIndex: 1,
  },
  bottomStyle: {
    maxWidth: 150,
    minWidth: 150,
    minHeight: 35,
    maxHeight: 35,
    backgroundColor: "#FA4248",
    borderColor: "#fff",
  },
});
