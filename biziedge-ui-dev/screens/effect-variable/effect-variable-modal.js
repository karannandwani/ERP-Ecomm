import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";

const effectVariableModal = ({ onChange, effectVariable, business }) => {
  const [name, setName] = useState("");
  const [query, setQuery] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemCallback = (checked) => {
    setAvailable(checked);
  };
  useEffect(() => {
    setName(effectVariable && effectVariable.name ? effectVariable.name : "");
    setQuery(
      effectVariable && effectVariable.query
        ? JSON.parse(effectVariable.query)
        : ""
    );
  }, [effectVariable]);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <Text
        style={{
          fontSize: 20,
          color: "#43425D",
          marginLeft: 15,
          marginBottom: 30,
        }}
      >
        {effectVariable._id ? "Update Effect Variable" : "Add Effect Variable"}
      </Text>

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
        ></InputboxWithBorder>
      </View>
      <View style={{ flexDirection: "column" }}>
        <Text style={styles.label}>Query</Text>
        <TextInput
          style={styles.textArea}
          onChangeText={(e) => setQuery(e)}
          value={query}
          multiline={true}
        ></TextInput>
      </View>
      <View>
        <Button
          pressFunc={() => {
            onChange({
              _id: effectVariable._id,
              name: name,
              query: query,
              business: business,
            });
          }}
          title={
            effectVariable._id
              ? "Update Effect Variable"
              : "Add Effect Variable"
          }
        ></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  textArea: {
    height: 150,
    borderColor: "#E8E9EC",
    borderWidth: 1,
    fontSize: 14,
    fontWeight: "normal",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#43325D",
  },
});

export default effectVariableModal;
