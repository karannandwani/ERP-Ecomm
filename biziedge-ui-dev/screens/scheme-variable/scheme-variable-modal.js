import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";

const schemeVariableModal = ({ onChange, schemeVariable, business }) => {
  const [name, setName] = useState("");
  const [query, setQuery] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemCallback = (checked) => {
    setAvailable(checked);
  };
  useEffect(() => {
    setName(schemeVariable && schemeVariable.name ? schemeVariable.name : "");
    setQuery(
      schemeVariable && schemeVariable.query ? schemeVariable.query : ""
    );
  }, [schemeVariable]);

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
        {schemeVariable._id ? "Update Scheme Variable" : "Add Scheme Variable"}
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
              _id: schemeVariable._id,
              name: name,
              query: query,
              business: business,
            });
          }}
          title={
            schemeVariable._id
              ? "Update Scheme Variable"
              : "Add Scheme Variable"
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

export default schemeVariableModal;
