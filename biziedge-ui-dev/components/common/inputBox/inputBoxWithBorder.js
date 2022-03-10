import React, { useEffect, useState, Fragment } from "react";
import { StyleSheet, Text, TextInput, View, Platform } from "react-native";
import { Styles } from "../../../globalStyle";

export default function InputTextWithBorder({
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
  disable,
  jsx,
  resetField = false,
}) {
  const [valid, setValid] = useState(true);
  const [validationReg, setValidationReg] = useState(null);

  useEffect(() => {
    if (validateNow) {
      validate(value);
    }
  }, [validateNow, validationReg, value]);

  useEffect(() => {
    setValid(true);
  }, [resetField]);

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
    <View style={{ flex: 1 }}>
      {jsx ? jsx : <Text style={{ padding: 2 }}>{label}</Text>}
      <TextInput
        multiline={multiline}
        placeholder={placeholder}
        style={[
          styles.input,
          style,
          !valid && inValidStyle ? inValidStyle : smallTextInputStyle,
        ]}
        onChangeText={(e) => {
          onChangeText(e);
          validate(e);
        }}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        value={keyboardType === "numeric" ? `${value}` : value}
        editable={disable}
        autoFocus={autoFocus || !valid}
      />
      {!valid && inValidText ? (
        <Text style={styles.error}>{inValidText}</Text>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#E8E9EC",
    padding: 10,
    marginBottom: 15,
    alignSelf: "stretch",
  },
  error: {
    position: "absolute",
    bottom: 0,
    color: "red",
    fontSize: 12,
    marginLeft: 2,
  },

  textInputStyle: {
    // color: "black",
    // backgroundColor: "#fff",
    // maxHeight: 40,
    // minHeight: 40,
    // lineHeight: 23,
    // paddingLeft: 5,
  },
});
