import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import PopUp from "../../components/popUp/popUp";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";

const StaticDataModal = ({ onChange, data, business }) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);

  useEffect(() => {
    setKey(data.key || "");
    setValue(data.value || "");
    if (data.key) {
      setForm({ ...form, key: data.key });
    }
    if (data.value) {
      setForm({ ...form, value: data.value });
    }
  }, [data]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {data._id ? "Update Static Data" : "Add Static Data"}
        </Text>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setKey(e)}
          value={key}
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
          isValid={(n) => setForm({ ...form, key: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setValue(e)}
          value={value}
          style={{
            borderWidth: 1,
            borderColor: "#E8E9EC",
            fontSize: 14,
            fontWeight: "normal",
          }}
          label="Value"
          inValidText="Value should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, value: n })}
        ></InputboxWithBorder>
      </View>

      <View style={{ alignSelf: "center", margin: 5 }}>
        <Button
          pressFunc={() => {
            if (form && form.key && form.value) {
              onChange({
                _id: data._id,
                key: key,
                value: value,
                business: business._id,
              });
            } else {
              setValidateNow(true);
            }
          }}
          title={data._id ? "Update Static Data" : "Add Static Data"}
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

export default StaticDataModal;
