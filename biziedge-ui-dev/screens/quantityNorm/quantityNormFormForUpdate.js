import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import Button from "../../components/common/buttom/button";
import PopUp from "../../components/popUp/popUp";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import { Styles } from "../../globalStyle";
const QuantityNormFormForUpdate = ({ quantityNormObj, onChange, items }) => {
  const [product, setProduct] = useState({});
  const [maxOrdQty, setMaxOrdQty] = useState(null);
  const [minOrdQty, setMinOrdQty] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(false);
  const handleProductCallBack = (childData) => {
    setSelectedProduct(childData);
  };
  useEffect(() => {
    setProduct(
      quantityNormObj && quantityNormObj.product ? quantityNormObj.product : ""
    );
    setMaxOrdQty(
      quantityNormObj && quantityNormObj.maxOrdQty
        ? quantityNormObj.maxOrdQty
        : ""
    );
    setMinOrdQty(
      quantityNormObj && quantityNormObj.minOrdQty
        ? quantityNormObj.minOrdQty
        : ""
    );
  }, [quantityNormObj]);

  return (
    <View style={[Styles.MainContainer, { padding: 10 }]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          <View style={Styles.headerContainer}>
            <Text style={Styles.h1}>Update Quantity Norm</Text>
          </View>
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <PopUp
          renderData={items}
          placeholder="Product Name"
          selectionValue={product}
          label="Product Name"
          onSelection={handleProductCallBack}
          containerStyle={{ marginBottom: 10 }}
        ></PopUp>
      </View>
      <View>
        <InputboxWithBorder
          keyboardType="numeric"
          onChangeText={(e) => setMinOrdQty(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Min Order Qty"
          placeholder="Min Order Qty"
          value={minOrdQty ? `${minOrdQty}` : ""}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          keyboardType="numeric"
          onChangeText={(e) => setMaxOrdQty(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Max Order Qty"
          placeholder="Max Order Qty"
          value={maxOrdQty ? `${maxOrdQty}` : ""}
        ></InputboxWithBorder>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button
          pressFunc={() => {
            onChange({
              ...quantityNormObj,
              product: selectedProduct ? selectedProduct._id : product._id,
              maxOrdQty: maxOrdQty,
              minOrdQty: minOrdQty,
            });
          }}
          title={"Submit"}
        ></Button>
      </View>
    </View>
  );
};

export default QuantityNormFormForUpdate;
