import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import { Styles } from "../../globalStyle";
const HsnForm = ({ hsnNum, onChange, selectedTax, resetField }) => {
  const [hsn, setHsn] = useState("");
  const [percentage, setPercentage] = useState("");
  const [hsnDescription, setHsnDescription] = useState({
    value: "",
    validate: false,
  });
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);

  // useEffect(() => {
  //   setValidateNow(false);
  // }, [validateNow]);

  useEffect(() => {
    setHsn(hsnNum && hsnNum.hsn ? hsnNum.hsn : "");
    setPercentage(hsnNum && hsnNum.percentage ? hsnNum.percentage : "");
    setHsnDescription(hsnNum && hsnNum.description ? hsnNum.description : "");
  }, [hsnNum]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {(hsnNum && hsnNum._id ? "Update " : "Add ") + "HSN"}
        </Text>
      </View>

      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setHsn(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="HSN"
          placeholder="HSN"
          placeholderTextColor="#AFAEBF"
          value={hsn}
          inValidText={"Name should not be blank"}
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, hsn: n })}
          resetField={resetField}
        ></InputboxWithBorder>
      </View>
      {!hsnNum._id ? (
        <View style={{ padding: 10 }}>
          <InputboxWithBorder
            onChangeText={(e) => setPercentage(e)}
            style={{
              borderWidth: 1,
              borderColor: "#E8E9EC",
              flex: 1,
            }}
            placeholderTextColor="#AFAEBF"
            placeholder="Percentage"
            label="Percentage"
            value={percentage}
            inValidText="Percentage should not be blank"
            required={true}
            validateNow={validateNow}
            isValid={(n) => setForm({ ...form, percentage: n })}
            resetField={resetField}
          ></InputboxWithBorder>
        </View>
      ) : (
        <></>
      )}
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setHsnDescription(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Description"
          placeholder="Description"
          placeholderTextColor="#AFAEBF"
          value={hsnDescription}
          inValidText="Description should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, hsnDescription: n })}
          resetField={resetField}
        ></InputboxWithBorder>
      </View>
      <View style={[{ padding: 10 }]}>
        <Button
          pressFunc={() => {
            if ((form && form.hsn, form.percentage, form.hsnDescription)) {
              onChange({
                ...hsnNum,
                hsn: hsn,
                percentage: percentage,
                description: hsnDescription,
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

export default HsnForm;
