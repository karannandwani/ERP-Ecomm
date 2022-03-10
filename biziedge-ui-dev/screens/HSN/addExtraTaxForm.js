import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import { Styles } from "../../globalStyle";
const ExtraTaxForm = ({ tax, onChange }) => {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  useEffect(() => {
    setName(tax && tax.name ? tax.name : "");
    setPercentage(tax && tax.percentage ? Number(tax.percentage) : "");
  }, [tax]);
  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {(tax._id ? "Update " : "Create ") + "Tax"}
        </Text>
      </View>
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setName(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Name"
          placeholder="Tax Name"
          value={name}
        ></InputboxWithBorder>
      </View>
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setPercentage(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Percentage"
          placeholder="Percentage"
          keyboardType="numeric"
          value={percentage}
        ></InputboxWithBorder>
      </View>

      <View style={[{ padding: 10 }]}>
        <Button
          pressFunc={() => {
            onChange({
              ...tax,
              name: name,
              percentage: percentage,
            });
          }}
          title={"Submit"}
        ></Button>
      </View>
    </View>
  );
};
export default ExtraTaxForm;
