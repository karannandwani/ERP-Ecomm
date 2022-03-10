import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Platform } from "react-native";

let validationReg;

export default function InputTextAreaWithBorder({
  jsx,
  placeholder,
  label,
  style,
  smallTextInputStyle,
  onChangeText,
  numberOfLines,
  multiline,
  keyboardType,
  value,
  inValidText,
  isValid,
  inValidStyle,
  validationType,
  validationRegex,
  validateNow,
  required = false,
  autoFocus,
  labelStyle,
  // onFocus,
}) {
  const [valid, setValid] = useState(true);
  const [validationReg, setValidationReg] = useState(null);
  useEffect(() => {
    if (validateNow) {
      validate(value);
    }
  }, [validateNow, validationReg]);

  function validate(v) {
    let val = valid;
    if (required && v) {
      if (validationReg) {
        val = validationReg.test(v);
      } else {
        val = true;
      }
    } else if (v) {
      if (validationReg) {
        val = validationReg.test(v);
      }
    } else {
      val = false;
    }

    setValid(val);
    if (isValid) {
      isValid(val);
    }
  }
  useEffect(() => {
    if (validationRegex || validationType)
      setValidationReg(
        validationRegex
          ? new RegExp(validationRegex)
          : validationType === "email"
          ? /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i
          : validationType === "phone"
          ? /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/i
          : validationType === "aadhar"
          ? /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/i
          : validationType === "pan"
          ? /^[A-Z]{5}[0-9]{4}[A-Z]{1}/i
          : validationType === "pin"
          ? /^[1-9][0-9]{5}$/i
          : validationType === "numeric"
          ? /^(\d+\.\d+)$|^(\d+)$/i
          : null
      );
  }, [validationRegex, validationType]);
  return (
    <View style={[{ flex: 1 }, smallTextInputStyle]}>
      {jsx ? jsx : <Text style={[{ padding: 2 }, labelStyle]}>{label}</Text>}
      <TextInput
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#AFAEBF"
        style={[
          styles.textInputStyle,
          style,
          !valid && inValidStyle ? inValidStyle : smallTextInputStyle,
        ]}
        onChangeText={(e) => {
          onChangeText(e);
          //   validate(e);
        }}
        // onFocus={(e) => {
        //   onFocus(e);
        // }}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        value={value}
        autoFocus={autoFocus || !valid}
      ></TextInput>

      <Text style={{ color: "red", fontSize: 12, marginTop: 3 }}>
        {!valid && inValidText ? inValidText : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    marginBottom: 5,
    alignSelf: "stretch",
  },
});
