import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Searchbar from "../../components/common/searchBar";
import { DimensionContext } from "../../components/dimensionContext";
import {
  fetchSearchProductList,
  clearProductSearchList,
} from "../../redux/actions/search_product.action";
import { setProductHistory } from "../../redux/actions/productSearchHistory.action";
import { addError } from "../../redux/actions/toast.action";
import { setFilteredData } from "../../redux/actions/filterData";
import { fetchProducts } from "../../redux/actions/product.action";
const productSearch = ({
  navigation,
  searchProductList,
  fetchSearchProductList,
  addError,
  setProductHistory,
  searchProductHistoryList,
  clearProductSearchList,
  setFilteredData,
  filteredParams,
  business,
  fetchProducts,
}) => {
  const { window } = useContext(DimensionContext);
  const [isFocus, setIsFocus] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [value, setValue] = useState();

  function updateSearch(value) {
    if (value) {
      setValue(value);
      fetchSearchProductList({ business: business?._id, key: value });
    } else {
      clearProductSearchList();
      setValue("");
      setDataList(searchProductHistoryList);
    }
  }

  useEffect(() => {
    if (searchProductList?.length > 0) {
      setProductHistory(
        searchProductList.slice(0, 5).map((x) => ({ ...x, isHistory: true }))
      );
    }
  }, [searchProductList]);

  const removeProductHistory = (data) => {
    setProductHistory(
      searchProductHistoryList.filter((x) => x._id != data._id)
    );
  };

  useEffect(() => {
    setDataList(searchProductList?.map((x) => ({ ...x, isHistory: false })));
  }, [searchProductList]);

  useEffect(() => {
    if (isFocus && searchProductList?.length === 0) {
      setDataList(searchProductHistoryList);
    }
  }, [searchProductHistoryList, isFocus]);

  useEffect(() => {
    return () => {
      setDataList([]);
      clearProductSearchList();
      setValue("");
      setIsFocus(false);
    };
  }, []);

  const onFocus = () => {
    setIsFocus(true);
  };
  let initFilterObj = {
    manufacturers: [],
    categories: [],
    brands: [],
  };

  const onClickSeachItem = (data, text) => {
    switch (data.type) {
      case "Manufacturer": {
        setFilteredData({
          categories: [],
          brands: [],
          manufacturers: [data.itemId],
          text: "",
        });
        navigation.navigate("Home", { screen: "homeScreen", filter: "true" });
        return;
      }
      case "Category": {
        setFilteredData({
          brands: [],
          manufacturers: [],
          categories: [data.itemId],
          text: "",
        });
        navigation.navigate("Home", { screen: "homeScreen", filter: "true" });
        return;
      }
      case "Brand": {
        setFilteredData({
          manufacturers: [],
          categories: [],
          brands: [data.itemId],
          text: "",
        });
        navigation.navigate("Home", { screen: "homeScreen", filter: "true" });
        return;
      }
      case "Product": {
        fetchProducts({ business: business._id, _id: data.itemId });
        navigation.navigate("product-details", {
          item: data.itemId,
        });
        return;
      }
      default:
        setFilteredData({
          brands: [],
          categories: [],
          manufacturers: [],
          text: "",
        });
        navigation.navigate("Home", { screen: "homeScreen", filter: "true" });
        return;
    }
  };

  return (
    <View style={{ height: window.height - 64, marginBottom: 64 }}>
      <View
        style={[
          {
            backgroundColor: "#f8f8f8",
            width: window.width,
            top: 0,
            position: "absolute",
            backgroundColor: "#f8f8f8",
            borderBottomWidth: 0.5,
            borderColor: "#f8f8f8",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.5 },
            shadowOpacity: 0.5,
            height: window.height * 0.03 + window.height * 0.11,
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
              onPress={() =>
                navigation.navigate("Home", { screen: "homeScreen" })
              }
            >
              <Image
                source={require("../../assets/back.png")}
                style={{
                  height: 15,
                  width: 15,
                }}
              ></Image>
            </TouchableOpacity>
          </View>
          <View style={(styles.center, { flex: 1 })}>
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
        </View>
      </View>
      <View
        style={{
          height:
            window.height - (64 + window.height * 0.03 + window.height * 0.11),
          marginTop: window.height * 0.03 + window.height * 0.11 + 10,
          padding: 10,
        }}
      >
        <Searchbar
          updateSearch={updateSearch}
          style={{ marginTop: "8%" }}
          filteredDataSource={dataList}
          onFocus={onFocus}
          value={value}
          remove={removeProductHistory}
          onClickItem={onClickSeachItem}
        />
      </View>
    </View>
  );
};

const mapStateToProps = ({
  searchProductList,
  searchProductHistoryList,
  filteredParams,
  business,
}) => ({
  searchProductList,
  searchProductHistoryList,
  filteredParams,
  business,
});
export default connect(mapStateToProps, {
  fetchSearchProductList,
  addError,
  setProductHistory,
  clearProductSearchList,
  setFilteredData,
  fetchProducts,
})(productSearch);

const styles = StyleSheet.create({
  left: {
    marginHorizontal: 5,
  },
  center: {
    marginHorizontal: 5,
  },
  right: {
    marginHorizontal: 5,
  },
  container: {
    justifyContent: "center",
  },
  inputStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#cfcfcf",
    borderRadius: 20,
    color: "black",
    fontSize: 16,
  },
});
