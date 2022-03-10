import React, { useState, useEffect, useReducer, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import FilterComponent from "../../components/filter/filter";
import AutoCompleteModal from "../../components/common/autocompleteModal/auto-complete-modal";
import AddModal from "../../components/addModal/addModal";
import Icon from "../../components/common/icon";
import ComboSelect from "./combo-select";
import { DimensionContext } from "../../components/dimensionContext";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return { ...state, ...action.data };
    case "INIT_DATA":
      return {
        ...action.data,
        effectFrom: new Date(action.data.effectFrom),
        effectTill: new Date(action.data.effectTill),
      };
    case "EVALUATION":
      return {
        ...state,
        evaluation: { products: [...state.evaluation, action.data] },
      };
    case "REMOVE_FROM_EVALUATION":
      return {
        ...state,
        evaluation: [
          ...state.evaluation.filter((x, i) => i !== action.data.index),
        ],
      };
    default:
      return state;
  }
};
const ComboDiscountForm = ({
  scheme,
  onChange,
  selectedBusiness,
  fetchProducts,
  products,
  addError,
}) => {
  const { window } = useContext(DimensionContext);

  const [comboModal, viewComboModal] = useState(false);
  const [active, setActive] = useState(true);
  const [schemeForm, setSchemeForm] = useReducer(reducer, {
    effectFrom: new Date(),
    effectTill: new Date(),
    active: true,
    autoApplied: true,
    business: selectedBusiness?._id,
    evaluation: [],
    product: null,
  });

  useEffect(() => {
    if (scheme) {
      setSchemeForm({
        type: "INIT_DATA",
        data: scheme,
      });
    }
  }, [scheme]);
  const searchProductByPhrase = (phrase) => {
    fetchProducts({
      business: selectedBusiness._id,
      pageNo: 0,
      pageSize: 15,
      name: phrase,
    });
  };

  const updateSchemeForm = (data) => {
    setSchemeForm({
      type: "UPDATE",
      data: data,
    });
  };

  const saveScheme = () => {
    if (
      schemeForm.effectFrom.getTime() === schemeForm.effectTill.getTime() ||
      schemeForm.effectFrom.getTime() > schemeForm.effectTill.getTime()
    ) {
      addError("Please provide valid validity information!", 3000);
      return;
    }
    if (!schemeForm.evaluation && schemeForm.evaluation.length === 0) {
      addError("Combination cannot be blank!", 3000);
      return;
    }
    if (!schemeForm.product) {
      addError("Cannot create a combo scheme without Product!", 3000);
      return;
    }
    let obj = {
      type: "COMBO_PRODUCT_DISCOUNT",
      ...schemeForm,
      evaluation: schemeForm.evaluation.map((x) =>
        x.freeProduct ? { ...x, freeProduct: x.freeProduct._id } : x
      ),
    };
    onChange(obj);
  };

  return (
    <View style={[Styles.MainContainer]}>
      <View style={[Styles.headerContainer, { marginBottom: 10 }]}>
        <Text style={Styles.h1}>
          {scheme?._id ? "Update Scheme" : "Add Scheme"}
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text style={[Styles.h2, { padding: 2 }]}>Validity Info</Text>
          <View style={styles.sectionBorder}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Text style={{ marginLeft: 5 }}>Valid From</Text>
              <FilterComponent
                type={"date"}
                filterConfig={{
                  value: schemeForm.effectFrom,
                }}
                onFilterChange={(vv) =>
                  updateSchemeForm({
                    effectFrom: new Date(vv.value.utc().format()),
                  })
                }
              />
            </View>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Text>Valid Till</Text>
              <FilterComponent
                type={"date"}
                filterConfig={{
                  value: schemeForm.effectTill,
                }}
                onFilterChange={(vv) =>
                  updateSchemeForm({
                    effectTill: new Date(vv.value.utc().format()),
                  })
                }
              />
            </View>
          </View>
        </View>
      </View>
      <View>
        <AutoCompleteModal
          name={"Product"}
          label={"Product"}
          data={{
            data: { name: schemeForm.product?.name ?? "" },
            displayField: "name",
          }}
          onSelection={(result) =>
            setSchemeForm({ type: "UPDATE", data: { product: result } })
          }
          styleSingleSelect={{
            backgroundColor: "#fff",
          }}
          searchApi={searchProductByPhrase}
          renderData={products}
          isSubmitButtom={true}
        ></AutoCompleteModal>
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={[Styles.h2, { padding: 2, marginTop: 7 }]}>
            Combinations
          </Text>
          <Button
            style={{ marginTop: 10 }}
            pressFunc={() => viewComboModal(true)}
            title={"Add New Combo"}
          ></Button>
        </View>
        <ScrollView style={styles.productArea}>
          {schemeForm.evaluation.map((x, i) => (
            <View
              key={Math.random()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 20,
                backgroundColor: "#DBDBDB",
                marginLeft: 5,
                justifyContent: "space-between",
                marginTop: 2,
                marginBottom: 5,
                padding: 5,
              }}
            >
              {x.type === "FLAT_DISCOUNT" ? (
                <View>
                  <Text>Quantity: {x.qty}</Text>
                  <Text>Type: {x.type}</Text>
                  <Text>Discount: {x.discount}</Text>
                </View>
              ) : (
                <></>
              )}
              {x.type === "PERCENTAGE_DISCOUNT" ? (
                <View>
                  <Text>Quantity: {x.qty}</Text>
                  <Text>Type: {x.type}</Text>
                  <Text>Discount: {x.discount}</Text>
                </View>
              ) : (
                <></>
              )}
              {x.type === "FREE_PRODUCT" ? (
                <View>
                  <Text>Quantity: {x.qty}</Text>
                  <Text>Type: {x.type}</Text>
                  <Text>Free Product: {x.freeProduct?.name}</Text>
                  <Text>Free QTY: {x.freeQty}</Text>
                </View>
              ) : (
                <></>
              )}
              <TouchableOpacity
                style={{
                  zIndex: 999,
                  // marginLeft: 5,
                  paddingTop: 3,
                }}
                onPress={() =>
                  setSchemeForm({
                    type: "REMOVE_FROM_EVALUATION",
                    data: { index: i },
                  })
                }
              >
                <Icon fill="black" name="remove"></Icon>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <CheckBox
            isLabel={true}
            label={"Active"}
            value={schemeForm.active}
            setValue={(e) =>
              setSchemeForm({
                type: "UPDATE",
                data: { active: e },
              })
            }
          ></CheckBox>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button pressFunc={() => saveScheme()} title={"Submit"}></Button>
        </View>
      </View>
      <View>
        <AddModal
          showModal={comboModal}
          onSelection={() => viewComboModal(false)}
          modalViewStyle={{
            maxWidth: "100%",
            minWidth: "100%",
            flexDirection: "column",
            padding: 10,
            minHeight: window.height / 2,
          }}
          add={
            <ComboSelect
              onPress={() => viewComboModal(false)}
              products={products}
              searchProductByPhrase={searchProductByPhrase}
              evaluation={schemeForm.evaluation}
              onChange={(data) => {
                viewComboModal(false);
                setSchemeForm({
                  type: "UPDATE",
                  data: {
                    evaluation: data,
                  },
                });
              }}
            ></ComboSelect>
          }
        ></AddModal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionBorder: {
    flexDirection: "row",
    flex: 1,
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5,
    minHeight: 40,
    alignItems: "center",
    marginBottom: 10,
  },
  productArea: {
    minHeight: 100,
    maxHeight: "70%",
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5,
    marginTop: 15,
  },
  listStyle: {
    backgroundColor: "#fff",
    marginBottom: 3,
    flexDirection: "row",
  },
});
export default ComboDiscountForm;
