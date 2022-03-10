import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";

const AddEditVehicle = ({
  vehicleInfo,
  selectedBusiness,
  onChange,
  resetField,
}) => {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [value, setCheckBoxValue] = useState(true);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);

  const handleItemCallback = (checked) => {
    setCheckBoxValue(checked);
  };

  useEffect(() => {
    setName(vehicleInfo && vehicleInfo.name ? vehicleInfo.name : "");
    setModel(vehicleInfo && vehicleInfo.model ? vehicleInfo.model : "");
    if (Object.keys(vehicleInfo).length !== 0) {
      setCheckBoxValue(vehicleInfo?.active);
    }
  }, [vehicleInfo]);

  return (
    <View style={[Styles.MainContainer, { flexDirection: "column" }]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {vehicleInfo?._id ? "Update Vehicle" : "Add Vehicle"}
        </Text>
      </View>
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          placeholder="Name"
          value={name}
          onChangeText={(e) => setName(e)}
          label="Name"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
          inValidText=" Name should not be blank"
          resetField={resetField}
        ></InputboxWithBorder>
      </View>
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setModel(e)}
          value={model}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Model"
          placeholder={"Model"}
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, model: n })}
          inValidText="Model should not be blank"
          resetField={resetField}
        ></InputboxWithBorder>
      </View>
      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <CheckBox
            style={styles.checkBox}
            isLabel={true}
            value={value}
            setValue={handleItemCallback}
          ></CheckBox>
        </View>
      </View>
      <View style={[{ padding: 10 }]}>
        <Button
          pressFunc={() => {
            if ((form && form.name, form.model)) {
              onChange({
                ...vehicleInfo,
                name: name,
                model: model,
                active: value,
              });
            } else {
              setValidateNow(true);
            }

            // addVehicleAction(vehicleInfo);
            // setModalVisible(false);
          }}
          title={"Submit"}
        ></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  checkBox: {
    width: 18,
    minHeight: 20,
    maxHeight: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});

export default AddEditVehicle;
