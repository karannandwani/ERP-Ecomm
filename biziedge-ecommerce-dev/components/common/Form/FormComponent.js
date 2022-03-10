import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
const FormComponent = ({
  textInputStyle,
  maxLength,
  ref,
  placeholder,
  label,
  style,
  onChangeText,
  numberOfLines,
  multiline,
  keyboardType,
  labelStyle,
  value,
  inValidText,
  isValid,
  inValidStyle,
  validationType,
  validationRegex,
  validateNow,
  FormComponent,
  uploadFile,
  header,
  required = false,
  autoFocus,
  dataDetectorTypes,
  placeholderTextColor,
  headerStyle,
  textContentType,
  jsx,
}) => {
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
    <View style={[styles.container, style]}>
      <Text style={[{ flex: 1 }, headerStyle]}>{header}</Text>
      {jsx ? (
        jsx
      ) : (
        <TextInput
          textContentType={textContentType}
          maxLength={maxLength}
          ref={ref}
          placeholderTextColor={placeholderTextColor}
          dataDetectorTypes={dataDetectorTypes}
          style={[{ flex: 1, fontSize: 13 }, textInputStyle]}
          placeholder={placeholder}
          onChangeText={(e) => {
            onChangeText(e);
            validate(e);
          }}
          keyboardType={keyboardType}
          numberOfLines={numberOfLines}
          value={value}
          autoFocus={autoFocus || !valid}
        ></TextInput>
      )}

      <Text style={{ color: "red", fontSize: 12, marginTop: 3 }}>
        {!valid && inValidText ? inValidText : ""}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // padding: 2,
    borderBottomWidth: 1,
    borderColor: "#D6D2D2",
    marginLeft: 10,
    // maxHeight: 70,
    marginRight: 20,
  },
});
export default FormComponent;
