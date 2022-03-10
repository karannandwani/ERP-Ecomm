import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import AddModal from "../../components/addModal/addModal";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import { createLandingPageData } from "../../redux/actions/landing-page-data.action";
import { createSlide } from "../../redux/actions/slide.action";
import CreateSlide from "./create-slide";
import CategorySlider from "./categorySlider";
import ProductSlider from "./productSlider";
import Carousel from "./Carousel";
import CarouselItem from "./CarouselItem";
const { width, height } = Dimensions.get("window");
import {
  addProductCategory,
  fetchProductCategories,
} from "../../redux/actions/category.action";
import { addBrandAction, fetchBrands } from "../../redux/actions/brand.action";
import { addError } from "../../redux/actions/toast.action";
import {
  addManufacturer,
  fetchManufacturer,
} from "../../redux/actions/manufacturer.action";
import LandingPageComponent from "./add-landing-page-component";
import CategoryWrap from "./categoryWrap";
const LandingPage = ({
  selectedBusiness,
  createLandingPageData,
  landingPageData,
  slides,
  createSlide,
  navigation,
  manufacturerList,
  brandNames,
  categoryList,
  fetchBrands,
  fetchProductCategories,
  fetchManufacturer,
  addError,
}) => {
  const [modalVisible, setModalVisible] = useState(null);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const { window } = useContext(DimensionContext);

  const handleCallback = () => {
    setModalVisible(null);
  };

  const viewModal = () => {
    return modalVisible?.type === "Slide" ? (
      <CreateSlide
        selectedBusiness={selectedBusiness.business}
        slide={selectedSlide}
        manufacturerList={manufacturerList}
        brandNames={brandNames}
        categoryList={categoryList}
        fetchBrands={fetchBrands}
        fetchProductCategories={fetchProductCategories}
        fetchManufacturer={fetchManufacturer}
        addError={addError}
        onChange={(slide) => {
          createSlide(slide).then(() => setSelectedSlide(null));
          setModalVisible(null);
        }}
      ></CreateSlide>
    ) : modalVisible?.type === "Component" ? (
      <LandingPageComponent
        selectedBusiness={selectedBusiness.business}
        component={selectedComponent}
        addError={addError}
        slides={slides}
        onChange={(slide) => {
          createLandingPageData(slide).then(() => setSelectedComponent(null));
          setModalVisible(null);
        }}
      ></LandingPageComponent>
    ) : (
      <></>
    );
  };

  return (
    <ScrollView style={[Styles.container]}>
      <View
        style={{
          flexDirection: "row-reverse",
        }}
      >
        <View style={{ paddingLeft: 10 }}>
          <Button
            title={"Add Slide"}
            pressFunc={() => {
              setModalVisible({ type: "Slide" });
            }}
          ></Button>
        </View>
        <View>
          <Button
            title={"Add Landing Page Component"}
            pressFunc={() => {
              setSelectedComponent(null);
              setModalVisible({ type: "Component" });
            }}
          ></Button>
        </View>
      </View>
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          flexWrap: "wrap",
          flexDirection: width > 670 ? "row" : "column",
          justifyContent: width > 670 ? "space-between" : "space-around",
        }}
      >
        <View
          style={{
            width: width > 670 ? width / 3 : width - 20,
            paddingTop: 20,
            borderColor: "grey",
            borderWidth: 2,
            borderRadius: 15,
            height: height,
          }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            style={{
              flex: 1,
              flexGrow: 1,
            }}
            nestedScrollEnabled={true}
          >
            {landingPageData.map((x, i) =>
              x?.type === "Category" ? (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedComponent(x);
                    setModalVisible({ type: "Component" });
                  }}
                  key={i}
                  style={{
                    backgroundColor: "#ffff",
                    marginTop: 5,
                  }}
                >
                  {selectedComponent?.viewType === "Scroll" ? (
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
                  ) : (
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
                  )}
                </TouchableOpacity>
              ) : x?.type == "Product" ? (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedComponent(x);
                    setModalVisible({ type: "Component" });
                  }}
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
                </TouchableOpacity>
              ) : x?.type == "Carousel" ? (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedComponent(x);
                    setModalVisible({ type: "Component" });
                  }}
                  key={x._id}
                  style={{ marginTop: 50 }}
                >
                  <Carousel data={x.slideImages} navigation={navigation} />
                </TouchableOpacity>
              ) : x?.type == "Image" ? (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedComponent(x);
                    setModalVisible({ type: "Component" });
                  }}
                  key={x._id}
                  style={{
                    maxHeight: 250,
                    minHeight: 250,
                    marginTop: 50,
                  }}
                >
                  <CarouselItem
                    item={{ ...x, url: x.slideImages[0].image }}
                    navigation={navigation}
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )
            )}
          </ScrollView>
        </View>
        <View
          style={{
            width: window.width > 670 ? width / 3 : window.width,
            marginTop: 20,
          }}
        >
          <Text style={Styles.h1}>Slides</Text>
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 5, maxHeight: window.height / 1.2 }}
            keyExtractor={(item, index) => index.toString()}
            data={slides}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.cardView}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedSlide(item);
                      setModalVisible({ type: "Slide" });
                    }}
                  >
                    <View style={{ padding: 10 }}>
                      <Text>{item.name}</Text>
                      <Image
                        style={styles.image}
                        source={{ uri: item.image }}
                      />
                      <View style={styles.textView}>
                        <Text> Redirect To Home Screen: </Text>
                        <Text>
                          With {item.redirectData.type} :
                          {
                            (item.category || item.manufacturer || item.brand)
                              ?.name
                          }
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </View>
      <AddModal
        showModal={modalVisible != null}
        onSelection={handleCallback}
        modalViewStyle={{
          maxWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 360
              ? window.width / 1.2
              : window.width - 60,
          minWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 360
              ? window.width / 1.2
              : window.width - 60,
          flexDirection: "column",
          paddingTop: 20,
          paddingBottom: window.width >= 360 ? 20 : 10,
          paddingLeft: window.width >= 360 ? 40 : 10,
          paddingRight: window.width >= 360 ? 40 : 10,
          borderRadius: 6,
          backgroundColor: "#fefefe",
        }}
        add={viewModal()}
      ></AddModal>
    </ScrollView>
  );
};
const mapStateToProps = ({
  selectedBusiness,
  landingPageData,
  slides,
  manufacturerList,
  brandNames,
  categoryList,
}) => ({
  selectedBusiness,
  landingPageData,
  slides,
  manufacturerList,
  brandNames,
  categoryList,
});
export default connect(mapStateToProps, {
  createLandingPageData,
  createSlide,
  fetchBrands,
  fetchProductCategories,
  fetchManufacturer,
  addProductCategory,
  addBrandAction,
  addManufacturer,
  addError,
})(LandingPage);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardView: {
    flex: 1,
    width: width > 670 ? width / 3 : width,
    height: height / 4,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: width > 670 ? width / 3 : width,
    height: height / 4,
    borderRadius: 10,
  },
});
