import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import PopUp from "../../components/popUp/popUp";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";

const countryModal = ({ country, onChange }) => {
  const [name, setName] = useState("");
  const [available, setAvailable] = useState(true);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);

  const handleItemCallback = (checked) => {
    setAvailable(checked);
  };

  useEffect(() => {
    setName(country && country.name ? country.name : "");
    setAvailable(country && country.active ? country.active : false);
  }, [country]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text
          style={{
            fontSize: 20,
            color: "#43425D",
            marginLeft: 15,
            marginBottom: 30,
          }}
        >
          {country._id ? "Update Country" : "Add Country"}
        </Text>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setName(e)}
          value={name}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Name"
          inValidText="Name should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
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
      <View style={{ alignSelf: "center", margin: 5 }}>
        <Button
          pressFunc={() => {
            if ((form && form.name)) {
              onChange({
                _id: country._id,
                name: name,
                active: available,
              });
            } else {
                setValidateNow(true);

            }
          }}
          title={country._id ? "Update Country" : "Add Country"}
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

export default countryModal;
