import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import PopUp from "../../components/popUp/popUp";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";

const stateModal = ({ country, onChange, state }) => {
  const [name, setName] = useState("");
  const [selectCountry, setselectCountry] = useState("");
  const [available, setAvailable] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const [autofeildValidation, setAutoFieldValidation] = useState(false);


  const handleItemCallback = (checked) => {
    setAvailable(checked);
  };
  useEffect(() => {
    setName(state && state.name ? state.name : "");
    setAvailable(state && state.active ? state.active : false);
    setselectCountry(state && state.country ? state.country : "");
  }, [state]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {state._id ? "Update State" : "Add State"}
        </Text>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setName(e)}
          value={name}
          style={{
            borderWidth: 1,
            borderColor: "#E8E9EC",
            fontSize: 14,
            fontWeight: "normal",
          }}
          label="Name"
          inValidText="Name should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <PopUp
          label={"Country"}
          onSelection={(data) => {
            setselectCountry(data);
            setModalVisible(false);
          }}
          selectionValue={selectCountry}
          renderData={country}
          containerStyle={{ marginBottom: 10 }}
          placeholder="Select Country"
          visible={modalVisible}
          validate={autofeildValidation}
          invalidText="Country should not be blank"
          style={{ minHeight: 40 }}
        ></PopUp>
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
      <View style={{ alignSelf: "center", margin: 5 }}>
        <Button
          pressFunc={() => {
            if ((form && form.name && country)) {
            onChange({
              _id: state._id,
              name: name,
              active: available,
              country: selectCountry,
            });
          }else{
            setValidateNow(true);
            setAutoFieldValidation(true);

          }
          }}
          title={state._id ? "Update State" : "Add State"}
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

export default stateModal;
