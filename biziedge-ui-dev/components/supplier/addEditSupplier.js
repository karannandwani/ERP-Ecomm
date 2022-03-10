import React, { useState, useEffect } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../common/buttom/button";
import PopUp from "../popUp/popUp";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
const AddEditSupplier = ({ supplier, onChange, facilityList }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shortName, setShortName] = useState("");
  const [phone, setPhone] = useState("");
  const [facility, setFacility] = useState(null);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const [value, setCheckBoxValue] = useState(false);

  const handleItemCallback = (checked) => {
    setCheckBoxValue(checked);
  };
  useEffect(() => {
    setName(supplier && supplier.name ? supplier.name : "");
    setEmail(supplier && supplier.email ? supplier.email : "");
    setShortName(supplier && supplier.shortName ? supplier.shortName : "");
    setPhone(supplier && supplier.phone ? supplier.phone : "");
    setFacility(supplier && supplier.facility ? supplier.facility : null);
  }, [supplier]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {(supplier && supplier._id ? "Update " : "Add ") + "Supplier"}
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setName(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Name"
          placeholder="Name"
          value={name}
          inValidText="Name should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setEmail(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC", color: "black" }}
          label="Email"
          placeholder="Email"
          value={email}
          validationType="email"
          inValidStyle={{ color: "red" }}
          inValidText="Please enter a valid email"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, email: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setShortName(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Short Name"
          placeholder="Short Name"
          value={shortName}
          inValidText="ShortName should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, shortName: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setPhone(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC", color: "black" }}
          label="Phone"
          placeholder="Phone"
          value={phone}
          inValidText="Please Enter a Valid Phone-No"
          validationType="phone"
          inValidStyle={{ color: "red" }}
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, phoneNo: n })}
        ></InputboxWithBorder>
      </View>
      <View style={{ minheight: 40 }}>
        <PopUp
          style={{ minHeight: 40 }}
          renderData={[{ _id: null, name: "None" }, ...facilityList]}
          selectionValue={facility}
          onSelection={(data) => setFacility(data._id ? data : null)}
          // style={{ flex: 1 }}
          label="Facility"
          placeholder="Select Facility"
          containerStyle={{ marginBottom: 10 }}
          // style={{ borderWidth: 1, borderColor: "#E8E9EC", padding: 8 }}
        ></PopUp>
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
          pressFunc={() => {
            // selected._id ? setModalVisible(false) : AddSupplier();
            if ((form && form.name, form.email, form.shortName, form.phoneNo)) {
              onChange({
                ...supplier,
                name: name,
                email: email,
                shortName: shortName,
                phone: phone,
                facility: facility ? facility._id : null,
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

export default AddEditSupplier;
