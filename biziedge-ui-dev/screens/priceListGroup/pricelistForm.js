import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
const AddEditPricelist = ({ pricelistGroup, onChange }) => {
  const [name, setName] = useState("");
  const [value, setCheckBoxValue] = useState(false);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const handleItemCallback = (checked) => {
    setCheckBoxValue(checked);
  };

  useEffect(() => {
    setName(pricelistGroup && pricelistGroup.name ? pricelistGroup.name : "");
    setCheckBoxValue(
      pricelistGroup && pricelistGroup.active ? pricelistGroup.active : ""
    );
  }, [pricelistGroup]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {pricelistGroup._id
            ? "Update Pricelist Group"
            : "Add Pricelist Group"}
        </Text>
      </View>
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          onChangeText={(e) => setName(e)}
          label="Name"
          placeholder="Name"
          value={name}
          inValidText="Name should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
        ></InputboxWithBorder>
      </View>
      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <CheckBox
            isLabel={true}
            value={value}
            setValue={handleItemCallback}
          ></CheckBox>
        </View>
      </View>
      <View style={[{ padding: 10 }]}>
        <Button
          pressFunc={() => {
            if (form && form.name) {
              onChange({
                ...pricelistGroup,
                name: name,
                active: value,
              });
            } else {
              setValidateNow(true);
            }
          }}
          title={"Submit"}
        ></Button>
      </View>
    </View>
  );
};


export default AddEditPricelist;
