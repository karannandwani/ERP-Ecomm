import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Text, View, StyleSheet, Platform } from "react-native";
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
import { addPriceListGroup } from "../../redux/actions/priceListGroup.action";
import { addTax } from "../../redux/actions/tax.action";
import { addProductCategory } from "../../redux/actions/category.action";
import { addHSN } from "../../redux/actions/hsn.action";
import { addBrandAction } from "../../redux/actions/brand.action";
import { addManufacturer } from "../../redux/actions/manufacturer.action";
import ImagePicker from "../../components/common/imageCard/imageCard";

const AddProductForm = ({
  product,
  manufacturerList,
  onChange,
  HSN,
  brandNames,
  pricelistGroups,
  taxList,
  categoryList,
  selectedBusiness,
  addManufacturer,
  addProductCategory,
  addHSN,
  addPriceListGroup,
  addBrandAction,
  addTax,
  navigation,
}) => {
  const [brandName, setBrandName] = useState("");
  const [productName, setproductName] = useState("");
  const [sku, setSKU] = useState("");
  const [basePackCode, setbasePackCode] = useState("");
  const [expiry, setExpiry] = useState("");
  const [QtyPerCase, setQtyPerCase] = useState("");
  const [description, setDescription] = useState("");
  const [hsnNumber, setHsnNumber] = useState("");
  const [category, setCategory] = useState({});
  const [extratax, setExtratax] = useState([]);
  const [pricelistgroup, setPricelistgroup] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [image, setImage] = useState([]);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);

  const [modalvisible, setModalvisible] = useState(false);

  const [selected, setSelected] = useState(false);

  const modalAddParentDataCallBack = (childData) => {
    setSelected({
      business: selectedBusiness.business._id,
      active: "true",
    });
    setModalvisible(childData);
  };

  const handleImageCallback = (image) => {
    setImage(image);
  };

  let productobj = {
    name: productName,
    brand: brandName._id,
    sku: sku,
    basepackCode: basePackCode,
    hsn: hsnNumber._id,
    description: description,
    category: category._id,
    priceListGroup: pricelistgroup._id,
    manufacturer: manufacturer._id,
    qtyPerCase: Number(QtyPerCase),
    notifyBeforeExpiry: Number(expiry),
    tax: extratax ? [extratax._id] : null,
    image: image ? image : [],
    business: selectedBusiness.business._id,
  };

  useEffect(() => {
    if (product && product.brand) setBrandName(product.brand);
    setManufacturer(
      product && product.manufacturer ? product.manufacturer : ""
    );
    setPricelistgroup(
      product && product.priceListGroup ? product.priceListGroup : ""
    );
    //todo change input after multiselect
    setExtratax(
      product && product.tax && product.tax.length > 0 ? product.tax[0] : ""
    );
    setCategory(product && product.category ? product.category : "");
    setHsnNumber(product && product.hsn ? product.hsn : "");
    setDescription(product && product.description ? product.description : "");
    setExpiry(
      product && product.notifyBeforeExpiry ? product.notifyBeforeExpiry : ""
    );
    setQtyPerCase(product && product.qtyPerCase ? product.qtyPerCase : "");
    setbasePackCode(
      product && product.basepackCode ? product.basepackCode : ""
    );
    setSKU(product && product.sku ? product.sku : "");
    setproductName(product && product.name ? product.name : "");
    setImage(
      product && product.image && product.image.length > 0
        ? product.image.map((x) => ({
            uri: `data:${x.mimType};base64,${x.image}`,
            featured: x.featured,
          }))
        : []
    );
  }, [product]);
  return (
    <View style={{ flex: 1, paddingHorizontal: 50 }}>
      <View style={{ flex: 2 }}>
        <Text style={{ fontSize: 22, marginTop: 15, marginLeft: 30 }}>
          {product && product._id ? "Update" : "Add"} Product
        </Text>
        {/* first half viewS */}
        <View style={{ flex: 1 }}>
          {/* //view 1 */}
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              minHeight: 150,
              maxHeight: 200,
            }}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, maxWidth: "90%" }}>
                <InputboxWithBorder
                  onChangeText={(e) => setproductName(e)}
                  style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                  label="Product name"
                  placeholder="Product Name"
                  value={productName}
                  required={true}
                  validateNow={validateNow}
                  isValid={(n) => setForm({ ...form, productName: n })}
                ></InputboxWithBorder>
              </View>
              <View style={{ flex: 1, maxWidth: "90%" }}>
                <Text>Category</Text>
                <AutoCompleteModal
                  name={"Category"}
                  label={"Category"}
                  onSelection={(e) => setCategory(e)}
                  displayField={"name"}
                  textInputStyle={{ marginBottom: 5 }}
                  data={{ data: category, displayField: "name" }}
                  addParentData={modalAddParentDataCallBack}
                  modalViewStyle={{
                    maxHeight: "70%",
                    padding: 40,
                    minWidth: "40%",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                  renderData={categoryList}
                  addComponent={
                    <AddUpdateCategoryForm
                      category={{
                        business: selectedBusiness.business._id,
                        active: true,
                        parentCategory: null,
                      }}
                      onChange={(category) => {
                        addProductCategory(category);
                      }}
                    ></AddUpdateCategoryForm>
                  }
                ></AutoCompleteModal>
              </View>

              <View style={{ flex: 1, maxWidth: "90%" }}>
                <InputboxWithBorder
                  onChangeText={(e) => setSKU(e)}
                  style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                  label="SKU"
                  placeholder="sku"
                  value={sku}
                ></InputboxWithBorder>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, maxWidth: "90%" }}>
                <Text>Brand</Text>
                <AutoCompleteModal
                  name={"Brand"}
                  label={"Brand"}
                  textInputStyle={{ marginBottom: 5 }}
                  onSelection={(e) => setBrandName(e)}
                  displayField={"name"}
                  data={{ data: brandName, displayField: "name" }}
                  addParentData={modalAddParentDataCallBack}
                  modalViewStyle={{
                    maxHeight: "70%",
                    padding: 40,
                    minWidth: "40%",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                  renderData={brandNames}
                  addComponent={
                    <AddUpdateBrand
                      supplier={{
                        business: selectedBusiness.business._id,
                        active: true,
                      }}
                      manufacturerList={manufacturerList}
                      onChange={(supplier) => {
                        addBrandAction(supplier);
                      }}
                    ></AddUpdateBrand>
                  }
                ></AutoCompleteModal>
              </View>

              <View style={{ flex: 1, maxWidth: "90%" }}>
                <Text>Manufacturer</Text>
                <AutoCompleteModal
                  name={"Manufacturer"}
                  textInputStyle={{ marginBottom: 5 }}
                  label={"Manufacturer"}
                  onSelection={(e) => setManufacturer(e)}
                  displayField={"name"}
                  data={{ data: manufacturer, displayField: "name" }}
                  addParentData={modalAddParentDataCallBack}
                  modalViewStyle={{
                    maxHeight: "70%",
                    padding: 40,
                    minWidth: "40%",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                  renderData={manufacturerList}
                  addComponent={
                    <ManufacturerForm
                      manufacturer={{
                        business: selectedBusiness.business._id,
                        active: true,
                      }}
                      onChange={(manufacturer) => {
                        addManufacturer(manufacturer);
                      }}
                    ></ManufacturerForm>
                  }
                ></AutoCompleteModal>
              </View>

              <View style={{ flex: 1, maxWidth: "90%" }}>
                <Text>HSN</Text>
                <AutoCompleteModal
                  name={"HSN"}
                  label={"HSN"}
                  textInputStyle={{ marginBottom: 5 }}
                  onSelection={(e) => setHsnNumber(e)}
                  displayField={"hsn"}
                  data={{ data: hsnNumber, displayField: "hsn" }}
                  addParentData={modalAddParentDataCallBack}
                  modalViewStyle={{
                    maxHeight: "70%",
                    padding: 40,
                    minWidth: "40%",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                  renderData={HSN}
                  addComponent={
                    <HsnForm
                      hsnNum={{
                        business: selectedBusiness.business._id,
                        active: true,
                      }}
                      onChange={(hsnNum) => {
                        addHSN(hsnNum);
                      }}
                    ></HsnForm>
                  }
                ></AutoCompleteModal>
              </View>
            </View>
          </View>

          {/* // view 2 */}

          <View style={{ flex: 1, maxHeight: 150 }}>
            <View style={{ flex: 1, maxWidth: "95%" }}>
              <InputTextAreaWithBorder
                onChangeText={(e) => setDescription(e)}
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                placeholder="Description"
                label="Description"
                value={description}
                smallTextInputStyle={{ minHeight: 100, minWidth: "100%" }}
              ></InputTextAreaWithBorder>
            </View>
          </View>
        </View>
      </View>
      {/* half view 2 */}
      <View style={{ flex: 3, paddingTop: 20, marginTop: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            maxHeight: 100,
            maxWidth: "98%",
          }}
        >
          <View style={{ flex: 1, maxWidth: "50%" }}>
            {/* Pricelist Group */}

            <View style={{ flex: 1, maxWidth: "90%" }}>
              <Text>PriceListGroup</Text>
              <AutoCompleteModal
                name={"PriceListGroup"}
                label={"PriceListGroup"}
                onSelection={(e) => setPricelistgroup(e)}
                displayField={"name"}
                textInputStyle={{ marginBottom: 5 }}
                data={{ data: pricelistgroup, displayField: "name" }}
                addParentData={modalAddParentDataCallBack}
                modalViewStyle={{
                  maxHeight: "70%",
                  padding: 40,
                  minWidth: "40%",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
                renderData={pricelistGroups}
                addComponent={
                  <AddEditPricelist
                    pricelistGroup={{
                      business: selectedBusiness.business._id,
                      active: true,
                    }}
                    onChange={(pricelistGroup) => {
                      addPriceListGroup(pricelistGroup);
                    }}
                  ></AddEditPricelist>
                }
              ></AutoCompleteModal>
            </View>
          </View>
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <View style={{ flex: 1, maxWidth: "90%" }}>
              <Text>Extra Tax</Text>
              <AutoCompleteModal
                name={"Tax"}
                label={"Tax"}
                onSelection={(e) => setExtratax(e)}
                displayField={"name"}
                data={{ data: extratax, displayField: "name" }}
                addParentData={modalAddParentDataCallBack}
                textInputStyle={{ marginBottom: 5 }}
                modalViewStyle={{
                  maxHeight: "70%",
                  padding: 40,
                  minWidth: "40%",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
                renderData={taxList}
                addComponent={
                  <ExtraTaxForm
                    tax={{
                      business: selectedBusiness.business._id,
                    }}
                    onChange={(tax) => {
                      addTax(tax);
                    }}
                  ></ExtraTaxForm>
                }
              ></AutoCompleteModal>
            </View>
          </View>
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <View style={{ flex: 1, maxWidth: "90%" }}>
              <InputboxWithBorder
                onChangeText={(e) => setExpiry(e)}
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                label="Notify before expiry (in days)"
                placeholder="Notify before expiry (in days)"
                value={expiry}
              ></InputboxWithBorder>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: "row", marginTop: 20 }}>
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <View style={{ flex: 1, maxWidth: "90%" }}>
              <InputboxWithBorder
                onChangeText={(e) => setbasePackCode(e)}
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                label="BasePack Code"
                placeholder="BasePack Code"
                value={basePackCode}
              ></InputboxWithBorder>
            </View>
          </View>
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <View style={{ flex: 1, maxWidth: "90%" }}>
              <InputboxWithBorder
                onChangeText={(e) => setQtyPerCase(e)}
                style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                label="Qty.per Case"
                placeholder="Qty.per Case"
                value={QtyPerCase}
              ></InputboxWithBorder>
            </View>
          </View>
        </View>
        <ImagePicker
          onSelection={handleImageCallback}
          style={styles.imageHolder}
          multiple={true}
          data={image}
        ></ImagePicker>
        <View style={{ flex: 1 }}>
          {/* <View style={{ flex: 2 }}></View> */}
          <View style={{ flex: 1 }}>
            <Button
              pressFunc={() => {
                if ((form && form.productName)) {
                  onChange({
                    _id: product._id,
                    ...productobj,
                    image:
                      productobj.image && productobj.image.length > 0
                        ? productobj.image.map((x) => ({
                            imageData: x.uri,
                            featured: x.featured,
                          }))
                        : null,
                  });
                  navigation.navigate("product");
                } else {
                  setValidateNow(true);
                }
        
              }}
              title={product._id ? "Update Product" : "Add Product"}
            ></Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    maxHeight: 80,
    minHeight: "50%",
    maxWidth: "300%",
    // backgroundColor: '#999999',
    backgroundColor: "lightgray",
    borderWidth: 3,
    borderColor: "#DFE0E3",
    padding: 5,
  },
});

const mapStateToProps = ({ selectedBusiness, products }) => ({
  selectedBusiness,
  products,
});

export default connect(mapStateToProps, {
  addManufacturer,
  addProductCategory,
  addHSN,
  addPriceListGroup,
  addBrandAction,
  addTax,
})(AddProductForm);
