import React, { useEffect, useState } from "react";
import { useContext } from "react";
import {
  View,
  Text,
  PixelRatio,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/button/button";
import FormComponent from "../../components/common/Form/FormComponent";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImagePicker from "../../components/common/imageCard/imageCard";
import { DimensionContext } from "../../components/dimensionContext";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import { addUser } from "../../redux/actions/user.action";
import { addError } from "../../redux/actions/toast.action";
const editProfile = ({ userInfo, business, route, navigation, addUser }) => {
  const [name, setUserName] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState([]);
  const [image, setImage] = useState(null);
  const [active, setCheckBoxValue] = useState(true);
  const [validateNow, setValidateNow] = useState(false);
  const [form, setForm] = useState({});
  const [modalVisible, setModalvisible] = useState(false);
  const { window } = useContext(DimensionContext);
  useEffect(() => {
    if (route.params.userData === "[object Object]") {
      navigation.navigate("user-profile");
    } else {
      null;
    }
  }, []);
  if (route.params.userData) {
    userInfo = route.params.userData;
  } else {
    null;
  }
  const pickImage = () => {
    const options = {
      storageOptions: {
        path: "images",
        mediaType: "photo",
      },
      includeBase64: true,
      base64: true,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("error");
      } else {
        const source = response.assets[0].base64;
        // const source = {
        //   uri:
        //     `data:${response.assets[0].type};base64,` +
        //     response.assets[0].base64,
        // };
        setImage(source);
      }
    });
  };

  useEffect(() => {
    if (userInfo && userInfo.businessRoleMap && userInfo._id) {
      setRole(userInfo.businessRoleMap[0]?.roles);
    } else {
      setRole([]);
    }
    setUserName(userInfo && userInfo.name ? userInfo.name : "");
    setPhoneNumber(userInfo && userInfo.phone ? userInfo.phone : "");
    setEmail(userInfo && userInfo.email ? userInfo.email : "");
    setImage(
      userInfo && userInfo.image
        ? (Platform.OS === "android") | (Platform.OS === "ios")
          ? userInfo.image
          : `data:${userInfo.mimType};base64,${userInfo.image}`
        : ""
    );
  }, [userInfo]);
  return (
    <View
      style={{
        minHeight: window.height - window.height / 10,
        maxHeight: window.height - window.height / 10,
        marginBottom: window.height / 10,
      }}
    >
      <View
        style={{
          height: window.height / 6,
        }}
      >
        <SaiWinLogo
          containerStyle={{
            alignContent: "center",
          }}
          backIconStyle={{
            marginLeft: 20,
          }}
          containerStyle={{
            flexDirection: "row",
            height: "100%",
            backgroundColor: "white",
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
          }}
          onPressIcon={() => navigation.navigate("user-profile")}
          // onPress={() => navigation.navigate("home")}
          imageStyle={{ marginTop: 5 }}
          // onPressLogo={() =>
          //   navigation.navigate("Home", { screen: "home-page" })
          // }
        ></SaiWinLogo>
      </View>

      <View style={{ flex: 1 }}>
        <FormComponent
          headerStyle={{
            marginTop: window.width > 1000 ? 15 : null,
            marginLeft: window.width > 1000 ? 15 : 7,
            fontSize: 19 * (window.height * 0.001),
          }}
          textInputStyle={{
            padding: 7,
            fontSize: 17 * (window.height * 0.001),
            marginLeft: window.width > 1000 ? 10 : null,
          }}
          style={{ flex: 1, marginTop: 7 }}
          onChangeText={(e) => setUserName(e)}
          header="Name"
          label="Name"
          placeholder="Name"
          value={name}
          inValidText="Name Should Not Be Blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
        ></FormComponent>
      </View>
      <View style={{ flex: 1 }}>
        <FormComponent
          headerStyle={{
            marginTop: window.width > 1000 ? 15 : null,
            marginLeft: window.width > 1000 ? 15 : 7,
            fontSize: 19 * (window.height * 0.001),
          }}
          textInputStyle={{
            padding: 7,
            fontSize: 17 * (window.height * 0.001),
            marginLeft: window.width > 1000 ? 10 : null,
          }}
          keyboardType="phone-pad"
          maxLength={10}
          dataDetectorTypes="phoneNumber"
          textContentType="telephoneNumber"
          style={{ flex: 1, marginTop: 7 }}
          onChangeText={(value) => {
            let num = value.replace(".", "");
            if (isNaN(num)) {
              addError("Please provide contact number", 3000);
            } else {
              setPhoneNumber(value);
            }
          }}
          header="Phone"
          label="Phone"
          placeholder="Phone"
          value={phone}
          inValidText="Phone Should Not Be Blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, phone: n })}
        ></FormComponent>
      </View>
      <View style={{ flex: 1 }}>
        <FormComponent
          headerStyle={{
            marginTop: window.width > 1000 ? 15 : null,
            marginLeft: window.width > 1000 ? 15 : 7,
            fontSize: 19 * (window.height * 0.001),
          }}
          textInputStyle={{
            padding: 7,
            fontSize: 17 * (window.height * 0.001),
            marginLeft: window.width > 1000 ? 10 : null,
          }}
          style={{ flex: 1, marginTop: 7 }}
          onChangeText={(e) => setEmail(e)}
          header="Email"
          label="Email"
          placeholder="Email"
          value={email}
          inValidText="Email Should Not Be Blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, email: n })}
        ></FormComponent>
      </View>

      <View
        style={{
          marginTop: 8,
          marginLeft: 20,
        }}
      >
        <Text style={{ fontSize: 19 * (window.height * 0.001) }}>Photo</Text>
      </View>
      {Platform.OS === "web" ? (
        <ImagePicker
          imageRemove={() => setImage(null)}
          uploadTextStyle={{ fontSize: 19 * (window.height * 0.001) }}
          imageStyle={{
            minWidth:
              window.height < 500 ? window.height / 3 : window.height / 3,
            maxHeight: 50,
            minHeight:
              window.height < 500 ? window.height / 9 : window.height / 7,
            maxWidth: "70%",
          }}
          onSelection={(e) => setImage(e)}
          style={{
            alignSelf: "center",
            justifyContent: "center",
            minWidth: window.height < 500 ? "30%" : "70%",
            maxHeight: 150,
            minHeight: 150,
            maxWidth: "70%",
            backgroundColor: "lightgray",
            borderWidth: 3,
            borderColor: "#DFE0E3",
            padding: 5,
          }}
          multiple={false}
          data={image}
        ></ImagePicker>
      ) : (
        <View>
          <TouchableOpacity
            style={{
              width: "70%",
              height: 100,
              backgroundColor: "#B4B4B4",
              justifyContent: "center",
              alignSelf: "center",
            }}
            onPress={() => pickImage()}
          >
            {image ? (
              <Image
                style={{ width: "100%", height: 100 }}
                source={{
                  uri: "data:image/jpeg;base64," + image,
                }}
              ></Image>
            ) : (
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Add Image
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setImage(null)}
            style={{
              backgroundColor: "#B4B4B4",
              minWidth: 150,
              maxWidth: 150,
              marginTop: 10,
              alignSelf: "center",
              borderRadius: 30,
              height: 25,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Remove image
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Button
          style={{
            alignSelf: "center",
            borderColor: "#FA4248",
            backgroundColor: "#FA4248",
            maxHeight: 50,
          }}
          textStyle={{ color: "#fff" }}
          pressFunc={() => {
            if (form) {
              addUser({
                ...userInfo,
                name: name,
                phone: phone,
                email: email,
                active: true,
                image:
                  Platform.OS === "web"
                    ? image
                    : image
                    ? "data:image/jpeg;base64," + image
                    : null,
                password: "1234",
                businessRoleMap: {
                  business: userInfo.businessRoleMap[0].business?._id,
                  roles: role.map((x, i) => x._id),
                },
              });
              navigation.navigate("user-profile");
            } else {
              setValidateNow(true);
            }
          }}
          title="Update User"
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  textInput: {
    fontSize: 16,
    fontWeight: "normal",
    flex: 1,
    fontSize: 15 * PixelRatio.getFontScale(),
    width: "100%",
    maxHeight: 60,
    minHeight: 28,
    maxWidth: "100%",
    minWidth: "70%",
    margin: 5,
    marginLeft: 0,
  },
  label: {
    marginLeft: 0,
  },
  placeholderColor: {
    color: "#43325D",
  },
  checkBox: {
    width: 18,
    minHeight: 20,
    maxHeight: 20,
    margin: 1,
    marginTop: 8,
  },

  imageHolder: {},
});
export default connect(null, {
  addUser,
})(editProfile);
