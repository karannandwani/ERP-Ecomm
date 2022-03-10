import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
const StockMismatchForm = ({ stockMismatch, onChange }) => {
  const [name, setName] = useState("");
  const [value, setCheckBoxValue] = useState(false);
  const handleItemCallback = (checked) => {
    setCheckBoxValue(checked);
  };

  useEffect(() => {
    setName(stockMismatch && stockMismatch.name ? stockMismatch.name : "");
    setCheckBoxValue(
      stockMismatch && stockMismatch.active ? stockMismatch.active : ""
    );
  }, [stockMismatch]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {stockMismatch && stockMismatch._id ? "Update" : "Add"} Reason
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setName(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Reason Name"
          placeholder="Add Reason"
          value={name}
        ></InputboxWithBorder>
      </View>

      <View>
        <CheckBox
          isLabel={true}
          value={true}
          setValue={handleItemCallback}
        ></CheckBox>
      </View>
      <View style={[{ marginTop: 20 }]}>
        <Button
          style={{ alignSelf: "center" }}
          pressFunc={() => {
            onChange({
              ...stockMismatch,
              name: name,
              active: value,
            });
          }}
          title={"Submit"}
        ></Button>
      </View>
    </View>
  );
};

export default StockMismatchForm;
