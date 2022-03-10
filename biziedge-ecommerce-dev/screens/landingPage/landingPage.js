import React, { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import Icon from "../../components/common/icon";
import ProductSlider from "../../components/productSlider/productSlider";
import CategorySlider from "../../components/categorySlider/categorySlider";
import CarouselItem from "../../components/imageSlider/CarouselItem";
import Carousel from "../../components/imageSlider/Carousel";
import { DimensionContext } from "../../components/dimensionContext";
import CategoryWrap from "../../components/categorySlider/categoryWrap";

const landingPage = ({
  navigation,
  products,
  categories,
  currentBeat,
  landingPageData,
  manufacturerList,
}) => {
  const { window } = useContext(DimensionContext);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          {
            backgroundColor: "#FFF",
            width: window.width,
            borderBottomWidth: 0.5,
            borderBottomColorColor: "#f8f8f8",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.5 },
            shadowOpacity: 0.5,
            height: window.height * 0.03 + window.height * 0.1,
            // padd: 10,
          },
        ]}
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

                minHeight: window.height * 0.11 - window.height * 0.03,
                minWidth: "100%",
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
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          flex: 1,
        }}
      >
        <ScrollView nestedScrollEnabled={true}>
          {landingPageData.map((x) =>
            x?.type === "Category" ? (
              <View
                key={x._id}
                style={{
                  backgroundColor: "#ffff",
                  marginTop: 5,
                }}
              >
                {x.viewType === "Wrap" ? (
                  <CategoryWrap
                    onPress={(item) =>
                      navigation.navigate(
                        "homeScreen",
                        x.dataQuery.type == "Category"
                          ? {
                              category: item,
                            }
                          : x.dataQuery.type == "Manufacturer"
                          ? {
                              manufacturer: item,
                            }
                          : {}
                      )
                    }
                    item={x.data}
                  ></CategoryWrap>
                ) : (
                  <CategorySlider
                    onPress={(item) =>
                      navigation.navigate(
                        "homeScreen",
                        x.dataQuery.type == "Category"
                          ? {
                              category: item,
                            }
                          : x.dataQuery.type == "Manufacturer"
                          ? {
                              manufacturer: item,
                            }
                          : {}
                      )
                    }
                    item={x.data}
                  ></CategorySlider>
                )}
              </View>
            ) : x?.type == "Product" ? (
              <View
                key={x._id}
                style={{ backgroundColor: "#ffff", marginTop: 10 }}
              >
                <ProductSlider
                  onPress={(item) =>
                    navigation.navigate("homeScreen", {
                      category: item,
                    })
                  }
                  item={x.data}
                ></ProductSlider>
              </View>
            ) : x?.type == "Carousel" ? (
              <View key={x._id} style={{ marginTop: 10 }}>
                <Carousel data={x.slideImages} navigation={navigation} />
              </View>
            ) : x?.type == "Image" ? (
              <View
                key={x._id}
                style={{ maxHeight: 200, minHeight: 200, marginBottom: 10 }}
              >
                <CarouselItem
                  item={{
                    ...x,
                    image: x.slideImages[0].image,
                    _id: x.slideImages[0]._id,
                  }}
                  navigation={navigation}
                />
              </View>
            ) : (
              <></>
            )
          )}
        </ScrollView>
      </View>
    </View>
  );
};
const mapStateToProps = ({
  brands,
  products,
  categories,
  user,
  filteredParams,
  facility,
  cart,
  currentCart,
  currentBeat,
  landingPageData,
  manufacturerList,
}) => ({
  brands,
  products,
  categories,
  user,
  filteredParams,
  facility,
  cart,
  currentCart,
  currentBeat,
  landingPageData,
  manufacturerList,
});
export default connect(mapStateToProps, {})(landingPage);

const styles = StyleSheet.create({
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
{
  /* <View style={{ flex: 2, backgroundColor: "#ffff", marginTop: 5 }}> 
        <BrandSlider
          onPress={() => navigation.navigate("homeScreen")}
          item={brands}
        ></BrandSlider>
      </View> */
}
