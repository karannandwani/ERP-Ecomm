import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import { fetchFacility } from "../../redux/actions/facility.action";
import Icon from "../../components/common/icon";
import QuantityNormForm from "../quantityNorm/quantityNormForm";
import AddModal from "../../components/addModal/addModal";
import { fetchProducts } from "../../redux/actions/propduct.action";
import {
  addQuantityNorm,
  fetchQuantityNorm,
} from "../../redux/actions/quantityNorms.action";
import QuantityNormFormForUpdate from "./quantityNormFormForUpdate";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
const QuantityNorm = ({
  selectedBusiness,
  products,
  facility,
  fetchProducts,
  fetchFacility,
  addQuantityNorm,
  fetchQuantityNorm,
  quantityNorm,
}) => {
  const [quantityNormModalVisible, setQuantityNormModalVisible] =
    useState(false);
  const [updateModal, setUpdateModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState({});
  const [selectedNorm, setSelectedNorm] = useState({});
  const [searchItem, setSearchItem] = useState("");
  const { window } = useContext(DimensionContext);
  const handleCancelModalCallback = (childData) => {
    setQuantityNormModalVisible(childData);
  };
  const handleCancelModalForUpdate = (childData) => {
    setUpdateModalVisible(childData);
  };
  const handleNormCallBack = (data) => {
    setSelectedNorm(data);
    setUpdateModalVisible(true);
  };
  useEffect(() => {
    fetchFacility(
      {
        business: selectedBusiness?.business._id,
      },
      []
    );
    fetchProducts({
      business: selectedBusiness?.business._id,
      pageNo: 0,
      pageSize: 15,
    });
  }, [selectedBusiness]);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [phrase, setPhrase] = useState("");
  useEffect(() => {
    setFilterdata(phrase);
  }, [facility]);

  const searchNormByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
  };
  const setFilterdata = (text) => {
    setFilteredManufacturers([
      ...facility.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };

  const onClickItem = (item) => {
    setSelectedFacility(item);
    setSelectedNorm(item);
    fetchQuantityNorm({ facility: item._id });
  };
  return (
    <View style={[Styles.container]}>
      <View
        style={{
          flexDirection: "row-reverse",
        }}
      >
        {Object.keys(selectedFacility).length === 0 &&
        selectedFacility.constructor === Object ? (
          <></>
        ) : (
          <Button
            title="Add Quantity Norm"
            pressFunc={() => {
              setSelectedNorm({
                business: selectedBusiness.business._id,
                facility: selectedFacility._id,
              });
              setQuantityNormModalVisible(true);
            }}
          ></Button>
        )}
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: window.width >= 400 ? "row" : "column",
          justifyContent: window.width >= 400 ? "space-between" : null,
          width:
            window.width > 1040 ? window.width - (320 + 20) : window.width - 20,
          marginTop: 20,
        }}
      >
        <View
          style={{
            maxHeight: "50%",

            width:
              window.width >= 1040
                ? (window.width - 340) / 2
                : window.width >= 400 && window.width <= 1040
                ? (window.width - 20) /
                  (selectedFacility && selectedFacility._id ? 2 : 1)
                : window.width - 20,
          }}
        >
          <SearchBar
            renderData={filteredManufacturers}
            onChangeText={searchNormByPhrase}
            onSelection={onClickItem}
            renderItem={({ item, index }) => {
              return (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View
                    style={[
                      { flexDirection: "row", marginBottom: 2 },
                      styles.listStyle,
                    ]}
                  >
                    <TouchableOpacity>
                      <View style={{ padding: 10 }}>
                        <Text
                          style={{
                            marginBottom: 10,
                          }}
                        >
                          {item.name}{" "}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedFacility(item);
                        setSelectedNorm(item);
                        fetchQuantityNorm({ facility: item._id });
                      }}
                    >
                      {item.facility || item.name ? (
                        <Icon
                          name="rightArrow"
                          style={{ marginTop: 10 }}
                        ></Icon>
                      ) : (
                        ""
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              );
            }}
          ></SearchBar>
        </View>
        <View
          style={{
            maxWidth:
              window.width >= 1040
                ? (window.width - 350) / 2
                : window.width >= 400 && window.width <= 1040
                ? (window.width - 20) / 2
                : window.width - 20,
            minWidth:
              window.width >= 1040
                ? (window.width - 350) / 2
                : window.width >= 400 && window.width <= 1040
                ? (window.width - 20) / 2
                : window.width - 20,
            marginLeft: window.width >= 400 ? 10 : 0,
          }}
        >
          {Object.keys(selectedFacility).length === 0 &&
          selectedFacility.constructor === Object &&
          Object.keys(selectedNorm).length === 0 &&
          selectedNorm.constructor === Object ? (
            <></>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <SearchBar
                renderData={quantityNorm}
                onSelection={handleNormCallBack}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => handleNormCallBack(item)}
                      >
                        <View
                          style={{
                            padding: 5,
                            backgroundColor: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <Text
                            style={{
                              marginBottom: 20,
                            }}
                          >
                            Product Name:{item.product?.name}
                          </Text>
                          <Text
                            style={{
                              marginBottom: 20,
                            }}
                          >
                            Minimum Order Qty:{item.minOrdQty}
                          </Text>
                          <Text
                            style={{
                              marginBottom: 10,
                            }}
                          >
                            Maximum Order Qty:{item.maxOrdQty}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              ></SearchBar>
            </ScrollView>
          )}
        </View>
      </View>
      <AddModal
        showModal={quantityNormModalVisible}
        onSelection={handleCancelModalCallback}
        modalViewStyle={{
          maxWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20,
          minWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20,
          flexDirection: "column",
          paddingTop: 20,
          borderRadius: 6,
          backgroundColor: "#fefefe",
        }}
        add={
          <QuantityNormForm
            items={products}
            // quantityNormObj={selectedNorm}
            onChange={(quantityNormObj) => {
              if (
                (quantityNormObj.length =
                  1 &&
                  quantityNormObj[0].product !== null &&
                  quantityNormObj[0].maxOrdQty !== null)
              ) {
                addQuantityNorm(
                  quantityNormObj.map((e) => ({
                    ...e,
                    business: selectedBusiness.business._id,
                    facility: selectedFacility._id,
                  }))
                );
                setQuantityNormModalVisible(false);
              }
            }}
            quantityNormObj={selectedNorm}
            closeModal={setQuantityNormModalVisible}
          ></QuantityNormForm>
        }
      ></AddModal>
      <AddModal
        showModal={updateModal}
        onSelection={handleCancelModalForUpdate}
        modalViewStyle={{
          maxWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20,
          minWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20,
          flexDirection: "column",
          borderRadius: 6,
          backgroundColor: "#fefefe",
        }}
        add={
          <QuantityNormFormForUpdate
            items={products}
            quantityNormObj={selectedNorm}
            onChange={(quantityNormObj) => {
              addQuantityNorm([quantityNormObj]);
              setUpdateModalVisible(false);
            }}
          ></QuantityNormFormForUpdate>
        }
      ></AddModal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listStyle: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const mapStateToProps = ({
  selectedBusiness,
  facility,
  products,
  quantityNorm,
}) => ({
  selectedBusiness,
  facility,
  products,
  quantityNorm,
});
export default connect(mapStateToProps, {
  fetchProducts,
  fetchFacility,
  addQuantityNorm,
  fetchQuantityNorm,
})(QuantityNorm);
