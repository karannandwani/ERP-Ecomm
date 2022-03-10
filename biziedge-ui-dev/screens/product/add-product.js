import React, { useState, useEffect, useContext, useReducer } from "react";
import { connect } from "react-redux";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import InputTextAreaWithBorder from "../../components/textArea/textArea";
import AutoCompleteModal from "../../components/common/autocompleteModal/auto-complete-modal";
import ManufacturerForm from "../manufacturer/manufacturerForm";
import AddUpdateBrand from "../brand/addUpdateBrandForm";
import ExtraTaxForm from "../HSN/addExtraTaxForm";
import HsnForm from "../HSN/hsnForm";
import AddEditPricelist from "../priceListGroup/pricelistForm.js";
import AddUpdateCategoryForm from "../product Category/categoryForm";
import {
  addPriceListGroup,
  fetchPricelistGroupNames,
} from "../../redux/actions/priceListGroup.action";
import { addTax, fetchTaxNames } from "../../redux/actions/tax.action";
import {
  addProductCategory,
  fetchProductCategories,
} from "../../redux/actions/category.action";
import { addHSN, fetchHSN } from "../../redux/actions/hsn.action";
import { addBrandAction, fetchBrands } from "../../redux/actions/brand.action";
import {
  addManufacturer,
  fetchManufacturer,
} from "../../redux/actions/manufacturer.action";
import ImagePicker from "../../components/common/imageCard/imageCard";
import { addProduct } from "../../redux/actions/propduct.action";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return { ...state, ...action.data };
    case "INIT_DATA":
      return {
        ...action.data,
        image:
          action.data.image && action.data.image.length > 0
            ? action.data.image.map((x) => ({
              uri: `data:${x.mimType};base64,${x.image}`,
              featured: x.featured,
            }))
            : [],
      };
    default:
      return state;
  }
};
const AddProduct = ({
  manufacturerList,
  HSN,
  selectedBusiness,
  brandNames,
  pricelistGroups,
  taxList,
  products,
  addProduct,
  categoryList,
  addManufacturer,
  addProductCategory,
  addHSN,
  addPriceListGroup,
  addBrandAction,
  addTax,
  route,
  navigation,
  fetchBrands,
  fetchProductCategories,
  fetchHSN,
  fetchPricelistGroupNames,
  fetchTaxNames,
}) => {
  const [productForm, setProductForm] = useReducer(reducer, {
    _id: "",
    name: "",
    brand: "",
    sku: "",
    basepackCode: "",
    hsn: "",
    description: "",
    category: {},
    priceListGroup: "",
    manufacturer: "",
    qtyPerCase: "",
    notifyBeforeExpiry: "",
    tax: [],
    business: "",
    returnable: true,
    image: [],
  });
  const [modalvisible, setModalvisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [childModal, setChildModalVisiblity] = useState(false);
  const { window } = useContext(DimensionContext);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const [autoFieldValidation, setAutoFieldValidation] = useState(false);

  const modalAddParentDataCallBack = (childData) => {
    setSelected({
      business: selectedBusiness.business._id,
      active: "true",
    });
    setModalvisible(childData);
  };

  let product = route.params?.product
    ? products.find((x) => x._id === route.params.product)
    : "";

  const searchBrand = (text) => {
    fetchBrands({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 10,
      name: text,
    });
  };

  const searchCategory = (text) => {
    fetchProductCategories({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 150,
      name: text,
    });
  };

  const searchHsn = (text) => {
    fetchHSN({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 200,
      hsn: text,
    });
  };

  const searchPLG = (text) => {
    fetchPricelistGroupNames({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 15,
      name: text,
    });
  };

  const searchTax = (text) => {
    fetchTaxNames({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 15,
      name: text,
    });
  };

  useEffect(() => {
    return () => {
      setProductForm({});
    };
  }, []);
  useEffect(() => {
    if (product) {
      setProductForm({
        type: "INIT_DATA",
        data: product,
      });
    }
  }, [product]);

  return (
    <View style={[Styles.container, { backgroundColor: "#fff" }]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {product && product._id ? "Update" : "Add"} Product
        </Text>
      </View>
      <ScrollView nestedScrollEnabled={true}>
        <View style={{ marginTop: 20, flex: 1 }}>
          <View
            style={{
              flexDirection: window.width >= 500 ? "row" : "column",
              justifyContent: window.width >= 500 ? "space-between" : "center",
            }}
          >
            <View
              style={{
                width: window.width >= 500 ? "45%" : "100%",
                marginTop: window.width >= 500 ? 0 : 10,
                minHeight: 50,
              }}
            >
              <InputboxWithBorder
                onChangeText={(e) =>
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      sku: e.replace(/ /g, "_"),
                      name: e,
                    },
                  })
                }
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                label="Product name"
                placeholder="Product Name"
                value={productForm.name}
                required={true}
                validateNow={validateNow}
                isValid={(n) => setForm({ ...form, productName: n })}
                inValidText="Name should not be blank"
              ></InputboxWithBorder>
            </View>
            <View
              style={{
                width: window.width >= 500 ? "45%" : "100%",
                marginTop: window.width >= 500 ? 0 : 0,
                minHeight: 50,
              }}
            >
              <AutoCompleteModal
                name={"Brand"}
                label={"Brand"}
                onSelection={(e) => {
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      manufacturer: { ...e.manufacturer },
                      brand: e,
                    },
                  });
                  searchBrand("");
                }}
                value={productForm.brand}
                displayField={"name"}
                textInputStyle={{ marginBottom: 5 }}
                data={
                  productForm.brand
                    ? { data: productForm.brand, displayField: "name" }
                    : ""
                }
                addParentData={modalAddParentDataCallBack}
                renderData={brandNames.filter((x) => x.active === true)}
                validate={autoFieldValidation}
                inValidText="Brand should not be blank"
                searchApi={searchBrand}
                addComponent={
                  <AddUpdateBrand
                    supplier={{
                      business: selectedBusiness.business._id,
                      active: true,
                    }}
                    manufacturerList={manufacturerList}
                    onChange={(supplier) => {
                      setChildModalVisiblity(!childModal);
                      addBrandAction(supplier);
                    }}
                  ></AddUpdateBrand>
                }
                onRequestClose={childModal}
              ></AutoCompleteModal>
            </View>
          </View>
          <View
            style={{
              flexDirection: window.width >= 500 ? "row" : "column",
              justifyContent: window.width >= 500 ? "space-between" : "center",
            }}
          >
            <View
              style={{
                width: window.width >= 500 ? "45%" : "100%",
                marginTop: window.width >= 500 ? 0 : 10,
                minHeight: 50,
              }}
            >
              <AutoCompleteModal
                name={"Category"}
                label={"Category"}
                textInputStyle={{ marginBottom: 5 }}
                onSelection={(e) => {
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      category: e,
                    },
                  });
                  searchCategory("");
                }}
                value={productForm.category}
                displayField={"name"}
                data={
                  productForm.category
                    ? { data: productForm.category, displayField: "name" }
                    : ""
                }
                searchApi={searchCategory}
                addParentData={modalAddParentDataCallBack}
                renderData={categoryList.filter((x) => x.active === true)}
                validate={autoFieldValidation}
                inValidText="Category should not be blank"
                addComponent={
                  <AddUpdateCategoryForm
                    category={{
                      business: selectedBusiness.business._id,
                      active: true,
                      parentCategory: null,
                    }}
                    onChange={(category) => {
                      setChildModalVisiblity(!childModal);
                      addProductCategory(category);
                    }}
                  ></AddUpdateCategoryForm>
                }
                onRequestClose={childModal}
              ></AutoCompleteModal>
            </View>
            <View
              style={{
                width: window.width >= 500 ? "45%" : "100%",
                marginTop: window.width >= 500 ? 0 : 10,
                minHeight: 50,
              }}
            >
              <InputboxWithBorder
                onChangeText={(d) => console.log(d)}
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                label="Manufacturer"
                placeholder="Manufacturer"
                value={productForm.manufacturer?.name}
                required={true}
                disable={false}
                required={true}
                validateNow={validateNow}
                isValid={(n) => setForm({ ...form, manufacturer: n })}
                inValidText="Manufacturer should not be blank"
              ></InputboxWithBorder>
            </View>
          </View>
          <View
            style={{
              flexDirection: window.width >= 500 ? "row" : "column",
              justifyContent: window.width >= 500 ? "space-between" : "center",
            }}
          >
            <View
              style={{
                width: window.width >= 500 ? "45%" : "100%",
                marginTop: window.width >= 500 ? 0 : 10,
                minHeight: 50,
              }}
            >
              <InputboxWithBorder
                onChangeText={(e) =>
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      sku: e,
                    },
                  })
                }
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                label="SKU"
                placeholder="sku"
                value={productForm.sku}
              ></InputboxWithBorder>
            </View>
            <View
              style={{
                width: window.width >= 500 ? "45%" : "100%",
                marginTop: window.width >= 500 ? 0 : 10,
                minHeight: 50,
              }}
            >
              <AutoCompleteModal
                name={"HSN"}
                label={"HSN"}
                onSelection={(e) => {
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      hsn: e,
                    },
                  });
                  searchHsn("");
                }}
                displayField={"hsn"}
                textInputStyle={{ marginBottom: 5 }}
                value={productForm.hsn}
                data={
                  productForm.hsn
                    ? { data: productForm.hsn, displayField: "hsn" }
                    : ""
                }
                addParentData={modalAddParentDataCallBack}
                renderData={HSN}
                validate={autoFieldValidation}
                inValidText="Hsn should not be blank"
                searchApi={searchHsn}
                addComponent={
                  <HsnForm
                    hsnNum={{
                      business: selectedBusiness.business._id,
                      active: true,
                    }}
                    onChange={(hsnNum) => {
                      setChildModalVisiblity(!childModal);
                      addHSN(hsnNum);
                    }}
                  ></HsnForm>
                }
                onRequestClose={childModal}
              ></AutoCompleteModal>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: window.width >= 500 ? 0 : 10,
            }}
          >
            <InputTextAreaWithBorder
              onChangeText={(e) =>
                setProductForm({
                  type: "UPDATE",
                  data: {
                    description: e,
                  },
                })
              }
              style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
              placeholder="Description"
              label="Description"
              value={productForm.description}
              multiline={true}
              smallTextInputStyle={{ minHeight: 100, minWidth: "100%" }}
            ></InputTextAreaWithBorder>
          </View>
          <View
            style={{
              flexDirection: window.width >= 735 ? "row" : "column",
              justifyContent: window.width >= 735 ? "space-between" : "center",
            }}
          >
            <View
              style={{
                width: window.width >= 735 ? "30%" : "100%",
                marginTop:
                  window.width >= 735
                    ? 0
                    : window.width <= 735 && window.width >= 360
                      ? 0
                      : 10,
                minHeight: 50,
              }}
            >
              <AutoCompleteModal
                name={"PriceListGroup"}
                label={"PriceListGroup"}
                onSelection={(e) => {
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      priceListGroup: e,
                    },
                  });
                  searchPLG("");
                }}
                displayField={"name"}
                textInputStyle={{ marginBottom: 5 }}
                value={productForm.priceListGroup}
                data={
                  productForm.priceListGroup
                    ? { data: productForm.priceListGroup, displayField: "name" }
                    : null
                }
                addParentData={modalAddParentDataCallBack}
                renderData={pricelistGroups.filter((x) => x.active === true)}
                searchApi={searchPLG}
                addComponent={
                  <AddEditPricelist
                    pricelistGroup={{
                      business: selectedBusiness.business._id,
                      active: true,
                    }}
                    onChange={(pricelistGroup) => {
                      setChildModalVisiblity(!childModal);
                      addPriceListGroup(pricelistGroup);
                    }}
                  ></AddEditPricelist>
                }
                onRequestClose={childModal}
              ></AutoCompleteModal>
            </View>
            <View
              style={{
                width: window.width >= 735 ? "30%" : "100%",
                marginTop: window.width >= 735 ? 0 : 10,
                minHeight: 50,
              }}
            >
              <AutoCompleteModal
                name={"Tax"}
                label={"Tax"}
                onSelection={(e) => {
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      tax: e,
                    },
                  });
                  searchTax("");
                }}
                displayField={"name"}
                addParentData={modalAddParentDataCallBack}
                renderData={taxList}
                textInputStyle={{ marginBottom: 5 }}
                searchApi={searchTax}
                addComponent={
                  <ExtraTaxForm
                    tax={{
                      business: selectedBusiness.business._id,
                    }}
                    onChange={(tax) => {
                      setChildModalVisiblity(!childModal);
                      addTax(tax);
                    }}
                  ></ExtraTaxForm>
                }
                onRequestClose={childModal}
                multiSelect={true}
                selectionValue={productForm.tax}
              ></AutoCompleteModal>
            </View>
            <View
              style={{
                width: window.width >= 735 ? "30%" : "100%",
                marginTop: window.width >= 735 ? 0 : 10,
                minHeight: 50,
              }}
            >
              <InputboxWithBorder
                onChangeText={(e) =>
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      notifyBeforeExpiry: e,
                    },
                  })
                }
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                label="Notify before expiry (in days)"
                placeholder="Notify before expiry (in days)"
                value={`${productForm.notifyBeforeExpiry}`}
              ></InputboxWithBorder>
            </View>
          </View>
          <View
            style={{
              flexDirection: window.width >= 735 ? "row" : "column",
              justifyContent: window.width >= 735 ? "space-between" : "center",
            }}
          >
            <View
              style={{
                width: window.width >= 735 ? "30%" : "100%",
                marginTop: window.width >= 735 ? 0 : 10,
              }}
            >
              <InputboxWithBorder
                onChangeText={(e) =>
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      basepackCode: e,
                    },
                  })
                }
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                label="BasePack Code"
                placeholder="BasePack Code"
                value={productForm.basepackCode}
              ></InputboxWithBorder>
            </View>
            <View
              style={{
                width: window.width >= 735 ? "30%" : "100%",
                marginTop: window.width >= 735 ? 0 : 10,
              }}
            >
              <InputboxWithBorder
                onChangeText={(e) =>
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      qtyPerCase: e,
                    },
                  })
                }
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                label="Qty.per Case"
                placeholder="Qty.per Case"
                value={`${productForm.qtyPerCase}`}
              ></InputboxWithBorder>
            </View>
            <View
              style={{
                width: window.width >= 735 ? "30%" : "100%",
              }}
            >
              <CheckBox
                label={"Returnable"}
                isLabel={true}
                value={productForm.returnable}
                setValue={(data) =>
                  setProductForm({
                    type: "UPDATE",
                    data: {
                      returnable: data,
                    },
                  })
                }
                containerStyle={{ marginTop: window.width >= 735 ? 30 : 0 }}
              ></CheckBox>
            </View>
          </View>
          <ImagePicker
            onSelection={(data) =>
              setProductForm({
                type: "UPDATE",
                data: {
                  image: data,
                },
              })
            }
            style={styles.imageHolder}
            multiple={true}
            data={productForm.image}
          />

          <View style={[{ marginTop: 20 }]}>
            <Button
              style={{ alignSelf: "center" }}
              pressFunc={() => {
                if (
                  form &&
                  productForm.name &&
                  productForm.manufacturer &&
                  productForm.brand &&
                  productForm.manufacturer &&
                  productForm.category &&
                  productForm.hsn
                ) {
                  let data = {
                    _id: productForm._id,
                    name: productForm.name,
                    brand: productForm.brand._id,
                    sku: productForm.sku,
                    basepackCode: productForm.basepackCode,
                    hsn: productForm.hsn._id,
                    description: productForm.description,
                    category: productForm.category._id,
                    priceListGroup: productForm.priceListGroup._id,
                    manufacturer: productForm.manufacturer._id,
                    qtyPerCase: Number(productForm.qtyPerCase),
                    notifyBeforeExpiry: Number(productForm.notifyBeforeExpiry),
                    tax: productForm.tax?.map((x) => x._id),
                    business: selectedBusiness.business._id,
                    returnable: productForm.returnable,
                    image:
                      productForm.image && productForm.image.length > 0
                        ? productForm.image.map((x) => ({
                          imageData: x.uri,
                          featured: x.featured,
                        }))
                        : [],
                  };
                  addProduct({
                    ...data,
                    business: selectedBusiness.business._id,
                  });
                  navigation.navigate("product");
                } else {
                  setValidateNow(true);
                  setAutoFieldValidation(true);
                }
              }}
              title={product?._id ? "Update Product" : "Add Product"}
            ></Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    borderWidth: 3,
    borderColor: "#DFE0E3",
    padding: 5,
  },
  label: {
    flex: 1,
  },
});

const mapStateToProps = ({
  selectedBusiness,
  manufacturerList,
  HSN,
  brandNames,
  pricelistGroups,
  taxList,
  products,
  categoryList,
}) => ({
  selectedBusiness,
  manufacturerList,
  HSN,
  brandNames,
  pricelistGroups,
  taxList,
  products,
  categoryList,
});

export default connect(mapStateToProps, {
  addProduct,
  addManufacturer,
  addProductCategory,
  addHSN,
  addPriceListGroup,
  addBrandAction,
  addTax,
  fetchBrands,
  fetchProductCategories,
  fetchManufacturer,
  fetchHSN,
  fetchPricelistGroupNames,
  fetchTaxNames,
})(AddProduct);
