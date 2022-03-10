import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import { Styles } from "../../globalStyle";
const AddEditTax = ({ tax, onChange }) => {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  useEffect(() => {
    setName(tax && tax.name ? tax.name : "");
    setPercentage(tax && tax.percentage ? tax.percentage : "");
  }, [tax]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {(tax && tax._id ? "Update " : "Add") + " " + "Tax"}
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setName(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Name"
          placeholder="Tax Name"
          value={name}
          inValidText="Tax should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setPercentage(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Percentage"
          placeholder="Percentage"
          value={percentage}
          inValidText="Tax Percentage Should Not Be Blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, percentage: n })}
        ></InputboxWithBorder>
      </View>
      <View style={[{ marginTop: 20 }]}>
        <Button
          pressFunc={() => {
            if ((form && form.name, form.percentage)) {
              onChange({
                ...tax,
                name: name,
                percentage: percentage,
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

export default AddEditTax;
