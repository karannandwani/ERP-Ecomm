import React, { useState, useEffect, Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import ImagePicker from "../../components/common/imageCard/imageCard";

const ManufacturerForm = ({
  manufacturer,
  onChange,
  windowData,
  resetField,
}) => {
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const [image, setImage] = useState(null);
  useEffect(() => {
    setName(manufacturer && manufacturer.name ? manufacturer.name : "");
    if (Object.keys(manufacturer).length !== 0) {
      setActive(manufacturer?.active);
    }
    setImage(
      manufacturer && manufacturer.image
        ? `data:${manufacturer.image.mimType};base64,${manufacturer.image.image}`
        : null
    );
  }, [manufacturer]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {windowData > 360
            ? manufacturer._id
              ? "Update Manufacturer"
              : "Add Manufacturer"
            : "Manufacturer"}
        </Text>
      </View>
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setName(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Name"
          placeholder="Name"
          inValidText="Name should not be blank"
          value={name}
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
          resetField={resetField}
        ></InputboxWithBorder>
      </View>

      <View style={{ padding: 10 }}>
        <Text>Image</Text>
        <ImagePicker
          onSelection={(e) => setImage(e)}
          style={styles.imageHolder}
          multiple={false}
          data={image}
        ></ImagePicker>
      </View>

      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <CheckBox
            isLabel={true}
            value={active}
            setValue={(e) => setActive(e)}
          ></CheckBox>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button
            pressFunc={() => {
              if (form && form.name) {
                onChange({
                  ...manufacturer,
                  name: name,
                  active: active,
                  image: image,
                });
              } else {
                setValidateNow(true);
              }
            }}
            title={"Submit"}
          ></Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    maxHeight: 200,
    minHeight: 40,
    maxWidth: "100%",
    backgroundColor: "lightgray",
    borderWidth: 3,
    borderColor: "#DFE0E3",
    padding: 5,
  },
});

export default ManufacturerForm;
