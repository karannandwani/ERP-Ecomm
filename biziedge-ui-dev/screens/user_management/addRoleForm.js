import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import { Styles } from "../../globalStyle";

const AddRoleForm = ({ role, onChange }) => {
  const [name, setName] = useState("");
  //   const [manufacturer, setManufacturer] = useState("");

  //   const [active, setActive] = useState(true);

  useEffect(() => {
    setName(role && role.name ? role.name : "");
  }, [role]);
  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {role._id ? "Update Role" : "Add Role"}
        </Text>
      </View>
      <InputboxWithBorder
        onChangeText={(e) => setName(e)}
        style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
        label="Role"
        placeholder="Role"
        value={name}
      ></InputboxWithBorder>

      <View>
        <Button
          pressFunc={() => {
            // selected._id ? setModalVisible(false) : AddSupplier();
            onChange({
              ...role,
              name: name,
            });
          }}
          title={role._id ? "Update Role" : "Add Role"}
        ></Button>
      </View>
    </View>
  );
};

export default AddRoleForm;
