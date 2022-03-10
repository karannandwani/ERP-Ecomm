import React, { useState, useEffect, useReducer } from "react";
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
    case "CONDITION":
      return {
        ...state,
        condition: { products: [...state.condition.products, ...action.data] },
      };
    case "REMOVE_FROM_CONDITION":
      return {
        ...state,
        condition: {
          products: [
            ...state.condition.products.filter(
              (x) => x._id !== action.data._id
            ),
          ],
        },
      };
    default:
      return state;
  }
};
const ProductDiscount = ({
  scheme,
  onChange,
  selectedBusiness,
  fetchProducts,
  products,
  addError,
}) => {
  const [schemeForm, setSchemeForm] = useReducer(reducer, {
    effectFrom: new Date(),
    effectTill: new Date(),
    active: true,
    autoApplied: true,
    business: selectedBusiness?._id,
    condition: {
      products: [],
    },
    effect: {
      type: "FLAT_DISCOUNT",
      value: "",
    },
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
    if (!schemeForm.effect.value || schemeForm.effect.value === "") {
      addError("Invalid discount information!", 3000);
      return;
    }
    if (schemeForm.condition.products.length === 0) {
      addError("Cannot create a scheme without Products!", 3000);
      return;
    }
    let obj = {
      type: "PRODUCT_DISCOUNT",
      ...schemeForm,
    };
    onChange({
      ...obj,
      condition: { products: obj.condition.products.map((x) => x._id) },
    });
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
              <Text style={{ marginLeft: 7 }}>Valid From</Text>
              <FilterComponent
                type="date"
                filterConfig={{
                  value: schemeForm.effectFrom,
                }}
                onFilterChange={(vv) => {
                  updateSchemeForm({
                    effectFrom: new Date(vv.value.utc().format()),
                  });
                }}
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

      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text style={[Styles.h2, { padding: 2 }]}>Discount Info</Text>
          <View style={styles.sectionBorder}>
            <InputboxWithBorder
              jsx={<Text style={{ marginLeft: 10, flex: 1 }}>Value</Text>}
              onChangeText={(e) =>
                updateSchemeForm({ effect: { ...schemeForm.effect, value: e } })
              }
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#E8E9EC",
                marginLeft: 5,
              }}
              label="Value"
              placeholder="Value"
              value={schemeForm.effect.value}
              required={true}
              keyboardType="numeric"
            ></InputboxWithBorder>
            <View style={{ flex: 1 }}>
              <Text style={{ padding: 2 }}>Type</Text>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  style={{ borderRadius: 19, margin: 5 }}
                  isLabel={true}
                  value={schemeForm.effect.type == "FLAT_DISCOUNT"}
                  label={"FLAT"}
                  setValue={(e) =>
                    updateSchemeForm({
                      effect: { ...schemeForm.effect, type: "FLAT_DISCOUNT" },
                    })
                  }
                ></CheckBox>
                <CheckBox
                  style={{ borderRadius: 19, margin: 5 }}
                  isLabel={true}
                  value={schemeForm.effect.type == "PERCENT_DISCOUNT"}
                  label={"PERCENT"}
                  setValue={(e) =>
                    updateSchemeForm({
                      effect: {
                        ...schemeForm.effect,
                        type: "PERCENT_DISCOUNT",
                      },
                    })
                  }
                ></CheckBox>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Text style={[Styles.h2, { padding: 2, marginTop: 12 }]}>Products</Text>
        <View
          style={{
            elevation: 8,
            backgroundColor: "rgb(67, 66, 93)",
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <AutoCompleteModal
            name={"Product"}
            label={"Add Product"}
            viewLabel={
              <Text
                style={{
                  color: "#fff",
                  alignSelf: "center",
                  textTransform: "capitalize",
                }}
              >
                Add Product
              </Text>
            }
            onSelection={(result) =>
              setSchemeForm({ type: "CONDITION", data: result })
            }
            styleSingleSelect={{
              backgroundColor: "#fff",
            }}
            searchApi={searchProductByPhrase}
            renderData={products}
            isSubmitButtom={true}
            multiSelect={true}
          ></AutoCompleteModal>
        </View>
      </View>
      <ScrollView scrollEnabled={true} style={styles.productArea}>
        {schemeForm.condition.products?.map((x, i) => (
          <View
            key={x._id}
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              minHeight: 50,
              maxHeight: 50,
              borderRadius: 10,
              backgroundColor: "#DBDBDB",
              marginTop: 10,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text style={{ marginLeft: 15 }}>{x.name}</Text>
            </View>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setSchemeForm({ type: "REMOVE_FROM_CONDITION", data: x })
                }
              >
                <Icon fill="black" name="remove"></Icon>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          // <View
          //   key={Math.random()}
          //   style={{
          //     flexDirection: "row",
          //     alignItems: "center",
          //     borderRadius: 20,
          //     backgroundColor: "#DBDBDB",
          //     marginLeft: 5,
          //     justifyContent: "space-between",
          //     marginTop: 2,
          //     marginBottom: 5,
          //     padding: 5,
          //   }}
          // >
          //   <View>
          //     <Text>{x.name}</Text>
          //   </View>
          //   <TouchableOpacity
          //     style={{
          //       zIndex: 999,
          //       // marginLeft: 5,
          //       paddingTop: 3,
          //     }}
          //     onPress={() =>
          //       setSchemeForm({ type: "REMOVE_FROM_CONDITION", data: x })
          //     }
          //   >
          //     <Icon fill="black" name="remove"></Icon>
          //   </TouchableOpacity>
          // </View>
        ))}
      </ScrollView>

      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <CheckBox
            isLabel={true}
            label={"Active"}
            value={schemeForm.active}
            setValue={(e) => updateSchemeForm({ active: e })}
          ></CheckBox>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button pressFunc={() => saveScheme()} title={"Submit"}></Button>
        </View>
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
    minHeight: 170,
    maxHeight: 170,
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
  },
  listStyle: {
    backgroundColor: "#fff",
    marginBottom: 3,
    flexDirection: "row",
  },
});
export default ProductDiscount;
