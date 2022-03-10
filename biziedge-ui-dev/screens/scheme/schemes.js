import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { fetchSchemes, addScheme } from "../../redux/actions/scheme.action";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import Button from "../../components/common/buttom/button";
import { Styles } from "../../globalStyle";
import ComboDiscountForm from "./combo-discount-scheme";
import { DimensionContext } from "../../components/dimensionContext";
import ProductDiscount from "./product-discount-scheme";
import { fetchProducts } from "../../redux/actions/propduct.action";
import { addError } from "../../redux/actions/toast.action";
import moment from "moment";

const Schemes = ({
  selectedBusiness,
  schemes,
  fetchSchemes,
  addScheme,
  effectVariables,
  schemeVariables,
  navigation,
  products,
  fetchProducts,
  addError,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [schemeTypeModal, viewSchemeTypeModal] = useState(false);
  const [createScheme, viewCreateScheme] = useState(null);
  const { window } = useContext(DimensionContext);

  const schemeTypes = ["PRODUCT_DISCOUNT", "COMBO_PRODUCT_DISCOUNT"];

  const change = (data) => {
    addScheme(data);
    viewCreateScheme(null);
  };
  const createSchemeModal = () => {
    return (
      <View>
        {createScheme?.type === "PRODUCT_DISCOUNT" ? (
          <ProductDiscount
            scheme={selected}
            products={products}
            selectedBusiness={selectedBusiness?.business}
            fetchProducts={fetchProducts}
            addError={addError}
            onChange={change}
          ></ProductDiscount>
        ) : (
          <></>
        )}
        {createScheme?.type === "COMBO_PRODUCT_DISCOUNT" ? (
          <ComboDiscountForm
            scheme={selected}
            products={products}
            selectedBusiness={selectedBusiness?.business}
            fetchProducts={fetchProducts}
            addError={addError}
            onChange={change}
          ></ComboDiscountForm>
        ) : (
          <></>
        )}
      </View>
    );
  };
  const typeSelected = (x) => {
    viewSchemeTypeModal(false);
    viewCreateScheme({
      view: true,
      type: x,
    });
  };

  // useEffect(() => {
  //   fetchSchemes({ business: selectedBusiness.business._id });
  // }, [!schemes]);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 15,
          alignItems: "center",
          flex: 1,
          marginHorizontal: 15,
        }}
      >
        <Text style={styles.add_button}>Schemes</Text>
        <Button
          style={{ maxWidth: "22%", marginRight: 20 }}
          title="Add Scheme"
          pressFunc={() => viewSchemeTypeModal(true)}
        ></Button>
      </View>
      <View style={{ flex: 6, margin: 10 }}>
        {schemes?.map((x) => (
          <View
            key={x._id}
            style={[
              styles.listStyle,
              {
                backgroundColor: "#fff",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setSelected(x);
                viewCreateScheme({ view: true, type: x.type });
              }}
              style={{ flexDirection: "row" }}
            >
              <View style={{ flexWrap: "wrap", padding: 10 }}>
                <Text style={[Styles.h3]}>{x.type} </Text>
                <Text style={[Styles.h3]}>
                  Effect From: {moment(x.effectFrom).format("DD/MM/YYYY")}
                </Text>
                <Text style={[Styles.h3]}>
                  Effect Till: {moment(x.effectTill).format("DD/MM/YYYY")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          // <View key={x._id}>
          //   <Text>{x.type}</Text>
          // </View>
        ))}
      </View>
      <View>
        <AddModal
          showModal={schemeTypeModal}
          onSelection={(data) => viewSchemeTypeModal(false)}
          modalViewStyle={{
            padding: 20,
          }}
          add={
            <View>
              {schemeTypes.map((x) => (
                <TouchableOpacity
                  onPress={() => typeSelected(x)}
                  key={Math.random()}
                  style={styles.schemeType}
                >
                  <Text style={[Styles.h2, { fontWeight: "bold" }]}>{x}</Text>
                </TouchableOpacity>
              ))}
            </View>
          }
        ></AddModal>
      </View>
      <View>
        <AddModal
          showModal={createScheme && createScheme.view}
          onSelection={() => {
            viewCreateScheme(null);
            setSelected(null);
          }}
          modalViewStyle={{
            maxWidth:
              window.width >= 960
                ? window.width / 2.5
                : window.width >= 641 && window.width <= 960
                ? window.width / 1.2
                : window.width <= 641 && window.width >= 500
                ? window.width / 1
                : window.width <= 500 && window.width >= 360
                ? window.width / 1
                : window.width - 60,
            minWidth:
              window.width >= 960
                ? window.width / 2.5
                : window.width >= 641 && window.width <= 960
                ? window.width / 1.2
                : window.width <= 641 && window.width >= 500
                ? window.width / 1
                : window.width <= 500 && window.width >= 360
                ? window.width / 1
                : window.width - 60,
            flexDirection: "column",
            padding: 10,
            minHeight: window.height / 2,
          }}
          add={createSchemeModal()}
        ></AddModal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  add_button: {
    fontSize: 28,
    color: "#43425D",
    alignSelf: "center",
    marginLeft: 20,
  },
  schemeType: {
    minHeight: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    paddingTop: 6,
    alignItems: "center",
    paddingBottom: 2,
  },
  listStyle: {
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const mapStateToProps = ({
  schemes,
  selectedBusiness,
  effectVariables,
  schemeVariables,
  products,
}) => ({
  schemes,
  selectedBusiness,
  effectVariables,
  schemeVariables,
  products,
});

export default connect(mapStateToProps, {
  fetchSchemes,
  addScheme,
  fetchProducts,
  addError,
})(Schemes);
