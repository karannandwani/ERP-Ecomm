import React, { useState, useReducer, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import FilterNameComponent from "../../screens/filter/FilterNameComponent";
import Button from "../../components/common/button/button";
import { connect } from "react-redux";
import DisplayData from "../../components/DisplayData/DisplayData";
import { setFilteredData } from "../../redux/actions/filterData";
import { DimensionContext } from "../../components/dimensionContext";
import { useContext } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "manufacturer":
      return state.manufacturers?.includes(action.value)
        ? {
            ...state,
            manufacturers: state.manufacturers.filter(
              (x) => x !== action.value
            ),
          }
        : { ...state, manufacturers: [...state.manufacturers, action.value] };
    case "brand":
      return state.brands?.includes(action.value)
        ? {
            ...state,
            brands: state.brands.filter((x) => x !== action.value),
          }
        : { ...state, brands: [...state.brands, action.value] };
    case "category":
      return state.categories?.includes(action.value)
        ? {
            ...state,
            categories: state.categories.filter((x) => x !== action.value),
          }
        : { ...state, categories: [...state.categories, action.value] };
    case "clear": {
      return { ...state, manufacturers: [], brands: [], categories: [] };
    }
    case "previousData": {
      return { ...action.value };
    }
    default:
      return state;
  }
}
const filter = ({
  brands,
  manufacturerList,
  categories,
  products,
  navigation,
  setFilteredData,
  filteredParams,
}) => {
  const [selectCategory, setselectCategory] = useState(true);
  const [selectBrand, setselectBrand] = useState(false);
  const [selectManufacture, setselectManufacture] = useState(false);
  const DisplayCategory = () => {
    setselectCategory(true);
    setselectBrand(false);
    setselectManufacture(false);
  };
  const DisplayBrand = () => {
    setselectBrand(true);
    setselectCategory(false);
    setselectManufacture(false);
  };
  const DisplayManufacture = () => {
    setselectManufacture(true);
    setselectBrand(false);
    setselectCategory(false);
  };

  const handleSelectedManufacturer = (childData) => {
    dispatch({ type: "manufacturer", value: childData._id });
  };
  const handleSelectedBrand = (childData) => {
    dispatch({ type: "brand", value: childData._id });
  };
  const handleSelectedCategory = (childData) => {
    dispatch({ type: "category", value: childData._id });
  };
  let initFilterObj = {
    manufacturers: [],
    categories: [],
    brands: [],
    text: "",
  };
  const [filterParams, dispatch] = useReducer(reducer, initFilterObj);

  const clearFilterData = () => {
    dispatch({ type: "clear" });
    setFilteredData(initFilterObj);
    navigation.navigate("homeScreen", { category: null });
  };

  useEffect(() => {
    if (filteredParams) {
      dispatch({ type: "previousData", value: filteredParams });
    }
  }, []);
  const { window } = useContext(DimensionContext);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", marginTop: 25 }}>
      <View
        style={{
          // flex: 1, backgroundColor: "pink",
          maxHeight: 50,
          minHeight: 50,
          borderBottomWidth: 1,
          borderColor: "#B3B3B3",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flex: 9,
              fontSize: 15,
              fontWeight: "bold",
              color: "#000",
              marginLeft: 10,
              marginTop: 20,
              maxHeight: 50,
              minHeight: 50,
            }}
          >
            FILTERS
          </Text>
        </View>

        <TouchableOpacity onPress={() => clearFilterData()}>
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              fontWeight: "bold",
              color: "#000",
              marginLeft: 10,
              marginTop: 20,
              maxHeight: 50,
              minHeight: 50,
              marginRight: 5,
            }}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 9,
          // backgroundColor: "red",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            // backgroundColor: "red"
          }}
        >
          <View style={{ flex: 9, backgroundColor: "#E2E5DE" }}>
            <FilterNameComponent
              pressFunc={() => DisplayCategory()}
              name="Category"
              count={filterParams.categories.length}
              style={{ backgroundColor: selectCategory ? "#fff" : "#E2E5DE" }}
            ></FilterNameComponent>
            <FilterNameComponent
              pressFunc={() => DisplayBrand()}
              name="Brand"
              count={filterParams.brands.length}
              style={{ backgroundColor: selectBrand ? "#fff" : "#E2E5DE" }}
            ></FilterNameComponent>
            <FilterNameComponent
              pressFunc={() => DisplayManufacture()}
              name="Manufacturer"
              count={filterParams.manufacturers.length}
              style={{
                backgroundColor: selectManufacture ? "#fff" : "#E2E5DE",
              }}
            ></FilterNameComponent>
          </View>
        </View>
        <View style={{ flex: 1.5 }}>
          {selectCategory ? (
            <View style={{ flex: 1 }}>
              <DisplayData
                renderData={categories}
                values={filterParams.categories}
                selected={handleSelectedCategory}
              ></DisplayData>
            </View>
          ) : (
            <></>
          )}
          {selectBrand ? (
            <View style={{ flex: 1 }}>
              <DisplayData
                renderData={brands}
                values={filterParams.brands}
                selected={handleSelectedBrand}
              ></DisplayData>
            </View>
          ) : (
            <></>
          )}
          {selectManufacture ? (
            <View style={{ flex: 1 }}>
              <DisplayData
                renderData={manufacturerList}
                values={filterParams.manufacturers}
                selected={handleSelectedManufacturer}
              ></DisplayData>
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          pressFunc={() => navigation.navigate("homeScreen")}
          style={{
            maxHeight: window.height / 15,
            minHeight: window.height / 17,
            minWidth: window.width / 2.3,
            maxWidth: window.width / 2.3,
            backgroundColor: "#fff",
            borderColor: "#FA4248",
          }}
          title="CLOSE"
          textStyle={{ color: "#000" }}
        ></Button>
        <Button
          pressFunc={() => {
            setFilteredData(filterParams);
            navigation.navigate("homeScreen", { filter: "true" });
          }}
          textStyle={{ color: "#fff" }}
          style={{
            maxHeight: window.height / 15,
            minHeight: window.height / 17,
            minWidth: window.width / 2.3,
            maxWidth: window.width / 2.3,
            backgroundColor: "#FA4248",
            borderColor: "#fff",
          }}
          title="APPLY"
        ></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});
const mapStateToProps = ({
  brands,
  manufacturerList,
  categories,
  products,
  filteredParams,
}) => ({
  categories,
  brands,
  manufacturerList,
  products,
  filteredParams,
});
export default connect(mapStateToProps, { setFilteredData })(filter);
