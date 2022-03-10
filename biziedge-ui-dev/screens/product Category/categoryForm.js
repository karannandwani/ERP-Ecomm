import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import ImagePicker from "../../components/common/imageCard/imageCard";

const AddUpdateCategoryForm = ({ category, onChange, resetField }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setCheckBoxValue] = useState(true);
  const [expiry, setExpiry] = useState("");
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const [image, setImage] = useState(null);
  const [icon, setIcon] = useState(null);
  const handleItemCallback = (checked) => {
    setCheckBoxValue(checked);
  };

  useEffect(() => {
    setName(category && category.name ? category.name : "");
    setDescription(
      category && category.description ? category.description : ""
    );
    setCheckBoxValue(category && category.active ? category.active : "");
    setExpiry(
      category && category.notifyBeforeExpiry ? category.notifyBeforeExpiry : ""
    );
    setImage(
      category && category.image
        ? `data:${category.image.mimType};base64,${category.image.image}`
        : null
    );
    setIcon(
      category && category.icon
        ? `data:${category.icon.mimType};base64,${category.icon.image}`
        : null
    );
  }, [category]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          <View style={Styles.headerContainer}>
            <Text style={Styles.h1}>
              {category._id ? "Update " : "Add "}
              {category.parentCategory ? "Sub Category" : "Category"}
            </Text>
          </View>
        </Text>
      </View>
      <View>
        {category ? (
          <InputboxWithBorder
            onChangeText={(e) => setName(e)}
            style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
            label="Category Name"
            placeholderTextColor="#AFAEBF"
            placeholder="Category Name"
            value={name}
            inValidText="Name should not be blank"
            required={true}
            validateNow={validateNow}
            isValid={(n) => setForm({ ...form, name: n })}
            resetField={resetField}
          ></InputboxWithBorder>
        ) : (
          <InputboxWithBorder
            onChangeText={(e) => setName(e)}
            style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
            label="Subcategory Name"
            placeholder="Subcategory Name"
            placeholderTextColor="#AFAEBF"
            value={name}
            inValidText="Name should not be blank"
            required={true}
            validateNow={validateNow}
            isValid={(n) => setForm({ ...form, name: n })}
            resetField={resetField}
          ></InputboxWithBorder>
        )}
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setDescription(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          placeholderTextColor="#AFAEBF"
          placeholder="Description"
          label="Description"
          value={description}
          // inValidText="Describe Something"
          // required={true}
          // validateNow={validateNow}
          // isValid={(n) => setForm({ ...form, description: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setExpiry(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Notify before expiry"
          placeholder="Notify before expiry (in days)"
          value={expiry}
          // inValidText="This Should Not Be Blank"
          // required={true}
          // validateNow={validateNow}
          // isValid={(n) => setForm({ ...form, expiry: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <Text>Image</Text>
        <ImagePicker
          onSelection={(e) => setImage(e)}
          style={styles.imageHolder}
          multiple={false}
          data={image}
        ></ImagePicker>
      </View>
      <View>
        <Text>Icon</Text>
        <ImagePicker
          onSelection={(e) => setIcon(e)}
          style={styles.imageHolder}
          multiple={false}
          data={icon}
        ></ImagePicker>
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <CheckBox
            isLabel={true}
            value={value}
            setValue={handleItemCallback}
          ></CheckBox>
        </View>

        <View style={[{ marginTop: 20 }]}>
          <Button
            style={{ borderRadius: 5 }}
            pressFunc={() => {
              if (form && form.name) {
                onChange({
                  ...category,
                  name: name,
                  description: description,
                  active: value,
                  notifyBeforeExpiry: expiry,
                  image: image,
                  icon: icon,
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

export default AddUpdateCategoryForm;
