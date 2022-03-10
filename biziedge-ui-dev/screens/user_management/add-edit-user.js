import React, { useEffect, useState } from "react";
import { View, Text, PixelRatio, StyleSheet, Platform } from "react-native";
import Button from "../../components/common/buttom/button";
// import Checkbox from "../../components/common/checkBox/checkbox";
import ImagePicker from "../../components/common/imageCard/imageCard";
import AppInputBox from "../../components/common/inputTextWithoutBorder";
import PopUp from "../../components/popUp/popUp";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import { useContext } from "react";

const AddEditUser = ({
  userInfo,
  roles,
  selectionValue,
  onChange,
  business,
}) => {
  const [name, setUserName] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState([]);
  const [image, setImage] = useState("");
  const [active, setCheckBoxValue] = useState(true);
  const [validateNow, setValidateNow] = useState(false);
  const [form, setForm] = useState({});
  const { window } = useContext(DimensionContext);

  useEffect(() => {
    // userInfo.businessId = business
    if (userInfo && userInfo.businessRoleMap && userInfo._id) {
      // userInfo.businessRoleMap.roles.map((role) => {
      //   setRole(role);
      // });
      setRole(userInfo.businessRoleMap.roles);
    } else {
      setRole([]);
    }
    setUserName(userInfo && userInfo.name ? userInfo.name : "");
    setPhoneNumber(userInfo && userInfo.phone ? userInfo.phone : "");
    setEmail(userInfo && userInfo.email ? userInfo.email : "");
    setCheckBoxValue(userInfo && userInfo.active ? userInfo.active : "");
    setImage(
      userInfo && userInfo.image
        ? `data:${userInfo.mimType};base64,${userInfo.image}`
        : ""
    );
  }, [userInfo]);
  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {userInfo._id ? "Update User" : "Add User"}
        </Text>
      </View>
      <View>
        <InputboxWithBorder
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          onChangeText={(e) => setUserName(e)}
          label="Name"
          placeholder="Name"
          value={name}
          inValidText="Name Should Not Be Blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          style={{ borderWidth: 1, borderColor: "#E8E9EC", color: "black" }}
          onChangeText={(e) => setPhoneNumber(e)}
          label="Phone"
          placeholder="Phone"
          value={phone}
          inValidText="Please Enter a Valid Phone-No"
          validationType="phone"
          inValidStyle={{ color: "red" }}
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, phone: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          style={{ borderWidth: 1, borderColor: "#E8E9EC", color: "black" }}
          onChangeText={(e) => setEmail(e)}
          label="Email"
          placeholder="Email"
          value={email}
          validationType="email"
          inValidStyle={{ color: "red" }}
          inValidText="Please enter a valid email"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, email: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <PopUp
          onSelection={(e) => setRole(e)}
          selectionValue={role}
          renderData={roles}
          label={"Role"}
          placeholder="Select Role"
          multiSelect={true}
        ></PopUp>
      </View>
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <CheckBox
          setValue={(data) => setCheckBoxValue(data)}
          value={active}
          isLabel={true}
          label={"Available"}
        ></CheckBox>
      </View>
      <View
        style={{
          marginTop: 8,
          marginBottom: 10,
        }}
      >
        <Text>Photo</Text>
      </View>

      <ImagePicker
        onSelection={(e) => setImage(e)}
        style={styles.imageHolder}
        multiple={false}
        data={image}
        onPressRemove={() => setImage(null)}
      ></ImagePicker>
      <View
        style={{
          minHeight:
            Platform.OS === "android" || Platform.OS === "ios"
              ? window.height / 6
              : window.height / 8,
          marginTop: 20,
        }}
      >
        <Button
          pressFunc={() => {
            if (form) {
              onChange({
                ...userInfo,
                name: name,
                phone: phone,
                email: email,
                active: active,
                image: image,
                password: "1234",
                businessRoleMap: {
                  business: business,
                  roles: role.map((x) => x._id),
                },
              });
            } else {
              setValidateNow(true);
            }
          }}
          title={userInfo._id ? "Update User" : "Add User"}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  imageHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    borderWidth: 3,
    borderColor: "#DFE0E3",
    padding: 5,
  },
});
export default AddEditUser;
