import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Button from "../../components/common/buttom/button";
import PopUp from "../../components/popUp/popUp";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";

const businessModal = ({ business, onChange, states, countries }) => {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [available, setAvailable] = useState(true);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [filteredState, setFilteredState] = useState([]);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const [autofeildValidation, setAutoFieldValidation] = useState(false);

  const handleItemCallback = (checked) => {
    setAvailable(checked);
  };
  const updateFilteredState = (data) => {
    setFilteredState([...states.filter((x) => x.country._id === data._id)]);
    setState(null);
  };

  useEffect(() => {
    // setValidateNow(false)
    setBusinessName(business && business.name ? business.name : "");
    setEmail(business && business.email ? business.email : "");
    setAvailable(business && business.active ? business.active : false);
    setCountry(business && business.country ? business.country : null);
    setState(business && business.state ? business.state : null);
    setPhone(business && business.phone ? business.phone : "");
    setAddress(business && business.address ? business.address : "");
  }, [business]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {business._id ? "Update Business" : "Add Business"}
        </Text>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setBusinessName(e)}
          value={businessName}
          style={{
            borderWidth: 1,
            borderColor: "#E8E9EC",
          }}
          label="Name"
          inValidText="Name should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, businessName: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setEmail(e)}
          value={email}
          style={{
            borderWidth: 1,
            borderColor: "#E8E9EC",
          }}
          label="Email"
          inValidText="Email should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, email: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setAddress(e)}
          value={address}
          style={{
            borderWidth: 1,
            borderColor: "#E8E9EC",
          }}
          label="Address"
        ></InputboxWithBorder>
      </View>
      <View>
        <PopUp
          onSelection={(data) => {
            setCountry(data);
            setModalVisible(false);
            updateFilteredState(data);
          }}
          selectionValue={country}
          renderData={countries}
          label="Country"
          placeholder="Select Country"
          visible={modalVisible}
          validate={autofeildValidation}
          invalidText="Country should not be blank"
          containerStyle={{ marginBottom: 10 }}
          style={{ minHeight: 40 }}
        ></PopUp>
      </View>
      <View>
        <PopUp
          label={"State"}
          onSelection={(data) => {
            setState(data);
            setModalVisible(false);
          }}
          selectionValue={state}
          renderData={states}
          placeholder="Select State"
          visible={modalVisible}
          containerStyle={{ marginBottom: 10 }}
          validate={autofeildValidation}
          invalidText="State should not be blank"
          style={{ minHeight: 40 }}
        ></PopUp>
      </View>

      <View>
        <InputboxWithBorder
          onChangeText={(e) => setPhone(e)}
          value={phone}
          style={{
            borderWidth: 1,
            borderColor: "#E8E9EC",
            fontSize: 14,
            fontWeight: "normal",
          }}
          label="Phone"
        ></InputboxWithBorder>
      </View>
      <View
        style={{ flex: 1, marginTop: 20, marginLeft: 5, flexDirection: "row" }}
      >
        <View>
          <CheckBox
            style={styles.checkBox}
            isLabel={true}
            value={available}
            setValue={handleItemCallback}
          ></CheckBox>
        </View>
      </View>
      <View style={{ flex: 1, alignSelf: "center" }}>
        <Button
          pressFunc={() => {
            if ((form && form.name, form.email && country && state)) {
              onChange({
                _id: business._id,
                name: businessName,
                email: email,
                active: available,
                country: country._id,
                state: state._id,
                phone: phone,
                address: address,
              });
            } else {
              setValidateNow(true);
              setAutoFieldValidation(true);

            }
          }}
          title={business._id ? "Update Business" : "Add Business"}
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
  label: {
    fontSize: 18,
    color: "#43325D",
  },
});

export default businessModal;
