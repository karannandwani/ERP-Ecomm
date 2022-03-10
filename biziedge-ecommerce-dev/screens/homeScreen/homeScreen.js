import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Dimensions, Platform, SafeAreaView } from "react-native";
import { fetchManufacturer } from "../../redux/actions/manufacturer.action";
import { fetchBrands } from "../../redux/actions/brand.action";
import { fetchProducts } from "../../redux/actions/product.action";
import { fetchCategories } from "../../redux/actions/productCategories.action";
import { fetchBeat } from "../../redux/actions/beat.action";
import { connect } from "react-redux";
import Icon from "../../components/common/icon";
import ItemDetails from "../../components/common/itemDetailsComponent/itemDetails";
import Button from "../../components/common/button/button";
import { addToCart } from "../../redux/actions/cart.action";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
import config from "../../config/config";

import { fetchFacilityByBeat } from "../../redux/actions/facility.action";
import CategorySlider from "../../components/categorySlider/categorySlider";
import { setFilteredData } from "../../redux/actions/filterData";

const HomeScreen = ({
  fetchBeat,
  fetchProducts,
  fetchCategories,
  categories,
  fetchManufacturer,
  fetchBrands,
  products,
  navigation,
  addToCart,
  filteredParams,
  facility,
  currentCart,
  currentBeat,
  route,
  setFilteredData,
  business,
}) => {
  useEffect(() => {
    // fetchManufacturer({ business: business?._id });
    // fetchBrands({ business: business?._id });
    // fetchCategories({ business: business?._id });
    // fetchBeat({ business: business?._id });
  }, []);

  const [dimensions, setDimensions] = useState({ window, screen });
  const [width, setWidth] = useState(dimensions.window.width);
  const [height, setHeight] = useState(dimensions.window.height);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [evaluated, setEvaluated] = useState(null);
  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
    setWidth(window.width);
    setHeight(window.height);
  };

  useEffect(() => {
    if (
      route &&
      route.params &&
      Object.keys(route.params).length > 0 &&
      !route.params.filter
    ) {
      let fp = {
        categories: [],
        manufacturers: [],
        brands: [],
      };
      if (route.params.category) {
        fp.categories.push(route.params.category);
        setFilteredCategories([
          ...categories.filter(
            (x) => x.parentCategory?._id === route.params.category
          ),
        ]);
      } else if (route.params.type?.toLowerCase() == "category") {
        fp.categories.push(route.params.id);
        setFilteredCategories([
          ...categories.filter(
            (x) => x.parentCategory?._id === route.params.id
          ),
        ]);
      } else {
        setFilteredCategories([...categories.filter((x) => !x.parentCategory)]);
      }

      if (route.params.manufacturer) {
        fp.manufacturers.push(route.params.manufacturer);
      }
      if (route.params.type?.toLowerCase() == "manufacturer") {
        fp.manufacturers.push(route.params.id);
      }

      if (route.params.brand) {
        fp.brands.push(route.params.brand);
      }
      if (route.params.type?.toLowerCase() == "brand") {
        fp.brands.push(route.params.id);
      }

      setEvaluated({ type: "Filter" });
      setFilteredData({ ...fp });
    } else {
      setEvaluated({ type: "Business" });
      setFilteredCategories([...categories]);
    }
  }, [route]);

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (evaluated) {
      if (evaluated.type === "Business" && !route.params?.filter) {
        let obj = new Object();

        obj.business = business?._id;
        // fetchProducts(obj);
      } else {
        let obj = new Object();

        obj.business = business?._id;
        if (filteredParams.categories?.length > 0) {
          obj.categories = filteredParams.categories;
          setFilteredCategories(
            categories.filter(
              (x) =>
                filteredParams.categories.includes(x._id) ||
                filteredParams.categories.includes(x.parentCategory?._id)
            )
          );
        } else {
          delete obj["categories"];
        }
        if (filteredParams.manufacturers?.length > 0) {
          obj.manufacturers = filteredParams.manufacturers;
        } else {
          delete obj["manufacturers"];
        }
        if (filteredParams.brands?.length > 0) {
          obj.brands = filteredParams.brands;
        } else {
          delete obj["brands"];
        }
        if (filteredParams.text != "") {
          obj.name = filteredParams.text;
        } else {
          delete obj["text"];
        }
        fetchProducts(obj);
      }
    }
  }, [filteredParams]);

  const onClickCategory = (item) => {
    setFilteredData({
      ...filteredParams,
      categories: [item],
    });
  };

  const add = (item) => {
    if (facility) {
      addToCart({
        products: [item],
        facility: facility?._id,
        business: business?._id,
        beat: currentBeat._id,
      });
    } else {
      console.error(
        "Cannot add to cart, no nearby facility available for now!"
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          top: 0,
          backgroundColor: "#f8f8f8",
          borderBottomWidth: 0.5,
          borderColor: "#f8f8f8",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0.5 },
          shadowOpacity: 0.5,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: window.height * 0.03,
            height: window.height * 0.11,
          }}
        >
          <View style={styles.left}>
            <TouchableOpacity
              onPress={() => navigation.navigate("search-location")}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                source={require("../../assets/loc.png")}
                style={{
                  height: 20,
                  width: 20,
                }}
              ></Image>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                style={{
                  color: "grey",
                  marginTop: 5,
                  flex: 1,
                }}
              >
                {currentBeat ? currentBeat.name : "Select Location"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.center}>
            <Image
              source={require("../../assets/icon.png")}
              resizeMode="contain"
              resizeMethod="scale"
              style={{
                justifyContent: "center",
                maxHeight: window.height * 0.11 - window.height * 0.03,
                maxWidth: "100%",

                minHeight:
                  window.width < 300
                    ? window.height / 20
                    : window.height * 0.11 - window.height * 0.03,
                minWidth: window.width < 300 ? window.width / 20 : "100%",
              }}
            ></Image>
          </View>
          <View style={styles.right}>
            <TouchableOpacity
              onPress={() => navigation.navigate("search-product")}
            >
              <Icon height="25" width="25" name="search"></Icon>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <CategorySlider
          onPress={(item) => onClickCategory(item)}
          item={filteredCategories}
        ></CategorySlider>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginLeft: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {products.length === 0 ? (
            <Text style={{ fontSize: 20, marginLeft: 20 }}>
              No filter data found
            </Text>
          ) : (
            products
              .filter((x) => x.price)
              .map((x, i) => (
                <ItemDetails
                  onClick={(selectedProduct) =>
                    navigation.navigate("product-details", {
                      item: selectedProduct._id,
                    })
                  }
                  key={x._id}
                  onSelection={(item) => add(item)}
                  item={x}
                  currentCart={currentCart}
                ></ItemDetails>
              ))
          )}
        </View>
      </ScrollView>
      <View
        style={{
          // flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          height: 60,
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            fontSize: window.width > 1000 ? 30 : 20 * (window.height * 0.001),
            fontWeight: "bold",
          }}
        >
          {Object.entries(filteredParams)
            .filter((x) => x[0] !== "text")
            .reduce((a, b) => a + b[1].length, 0)
            ? Object.entries(filteredParams)
                .filter((x) => x[0] !== "text")
                .reduce((a, b) => a + b[1].length, 0) + " "
            : "No "}
          filters applied
        </Text>
        <View
          style={{
            alignSelf: "center",
          }}
        >
          <Button
            pressFunc={() => navigation.navigate("filter", {})}
            textStyle={{ color: "#fff" }}
            style={{
              minWidth: window.width / 2,
              maxWidth: window.width / 2,
              // minHeight: window.height / 18,
              // maxHeight: window.height / 18,
              backgroundColor: "#FA4248",
              borderColor: "#fff",
            }}
            title="FILTER"
          ></Button>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = ({
  products,
  categories,
  filteredParams,
  facility,
  currentCart,
  currentBeat,
  business,
}) => ({
  categories,
  products,
  filteredParams,
  facility,
  currentCart,
  currentBeat,
  business,
});
export default connect(mapStateToProps, {
  fetchCategories,
  fetchProducts,
  fetchManufacturer,
  fetchBrands,
  fetchBeat,
  addToCart,
  fetchFacilityByBeat,
  setFilteredData,
})(HomeScreen);

const styles = StyleSheet.create({
  discoverStyle: {
    fontSize: 22,
    color: "#FA4248",
    alignSelf: "center",
    top: 35,
  },
  searchStyle: {
    flex: 1,
    height: "100%",
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
  },
  left: {
    marginHorizontal: 5,
    flex: 1,
    alignItems: "flex-start",
  },
  center: {
    marginHorizontal: 5,
    flex: 2,
    alignItems: "center",
  },
  right: {
    marginHorizontal: 5,
    flex: 1,
    alignItems: "flex-end",
  },
});
