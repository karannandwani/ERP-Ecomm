import React, { useEffect, useState } from "react";
import { PixelRatio, StyleSheet, Text, TextInput, View } from "react-native";

let validationReg;

export default function InputTextWithPlaceholder({
  placeholder,
  placeholderTextColor,
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
  secureTextEntry,
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
    <View style={[{ flex: 1, marginLeft: 30 }, smallTextInputStyle]}>
      <TextInput
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : "#AFAEBF"
        }
        style={[
          styles.textInputStyle,
          style,
          !valid && inValidStyle ? inValidStyle : smallTextInputStyle,
        ]}
        onChangeText={(e) => {
          onChangeText(e);
          validate(e);
        }}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        value={value}
        autoFocus={autoFocus || !valid}
        secureTextEntry={secureTextEntry}
      ></TextInput>
      <Text style={{ color: "red", fontSize: 12, marginTop: 3 }}>
        {!valid && inValidText ? inValidText : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    fontSize: 25 * PixelRatio.getFontScale(),
    fontWeight: "bold",
    width: "80%",
    borderBottomWidth: 1,
    padding: 10,
    color: "black",
    borderBottomColor: "#E9E9F0",
    flex: 1,
    maxHeight: 60,
    minHeight: 60,
    maxWidth: 400,
    marginTop: 20,
    marginLeft: 30,
    // outlineStyle: "none",
    // outlineWidth: 0,
    // outlineColor: "transparent"
  },
});
