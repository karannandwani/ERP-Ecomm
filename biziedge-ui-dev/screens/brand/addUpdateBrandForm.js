import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import PopUp from "../../components/popUp/popUp";

const AddUpdateBrand = ({
  supplier,
  manufacturerList,
  onChange,
  resetField,
}) => {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [active, setActive] = useState(true);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const handlePopupCallback = (childData) => {
    setManufacturer(childData);
    // setBusiness(childData.business)
    // supplier._id ? "Update Brand" : "Add Brand"
  };

  const CheckboxCallback = (e) => {
    setActive(e);
    // supplier._id ? "Update Brand" : "Add Brand"
  };

  useEffect(() => {
    setName(supplier && supplier.name ? supplier.name : "");
    setManufacturer(
      supplier && supplier.manufacturer ? supplier.manufacturer : ""
    );
    setActive(supplier && supplier.active ? supplier.active : "");
  }, [supplier]);

  return (
    <View style={[Styles.MainContainer, { flexDirection: "column" }]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {(supplier._id ? "Update " : "Add ") + "Brand"}
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
          resetField={resetField}
        ></InputboxWithBorder>
      </View>

      <View style={{ padding: 10, minheight: 40 }}>
        <PopUp
          style={{ minHeight: 40 }}
          placeholder={"Select"}
          renderData={manufacturerList}
          onSelection={handlePopupCallback}
          selectionValue={manufacturer}
          label={"Select Manufacturer"}
        ></PopUp>
      </View>
      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <CheckBox
            isLabel={true}
            value={active}
            setValue={CheckboxCallback}
          ></CheckBox>
        </View>
      </View>
      <View style={[{ padding: 10 }]}>
        <Button
          pressFunc={() => {
            if (form && form.name) {
              onChange({
                ...supplier,
                name: name,
                manufacturer: manufacturer._id,
                active: active,
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

export default AddUpdateBrand;
