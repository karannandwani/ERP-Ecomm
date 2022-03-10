import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  TextInput,
} from "react-native";
import Icon from "../../components/common/icon";
import FormComponent from "../../components/common/Form/FormComponent";
import { connect } from "react-redux";
import Button from "../../components/common/button/button";
import Checkbox from "../../components/common/checkbox/Checkbox";
import { addAddress } from "../../redux/actions/address.action";
import { updateCart } from "../../redux/actions/cart.action";
import { CheckOutContext } from "../../components/context/context";
import SelectionCircle from "../../components/selectionCircle/selectionCircle";
import { addError } from "../../redux/actions/toast.action";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import ModalView from "../../components/modalView/modal";
import { addressDelete } from "../../redux/actions/address.action";
import { fetchRazorPayKey } from "../../redux/actions/business.action";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
const Checkout = ({
  addAddress,
  navigation,
  updateCart,
  addresses,
  currentCart,
  addressDelete,
  addError,
  fetchRazorPayKey,
  business,
}) => {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    alternativePhone: "",
    email: "",
    street1: "",
    street2: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    default: false,
    billingSame: true,
  });
  const [validateNow, setValidateNow] = useState(false);
  const [checkOutPhase1, setcheckOutPhase1] = useState({ current: "contact" });
  const [selectedAddress, setSelectedAdress] = useState(null);
  const [dimensions, setDimensions] = useState({ window, screen });
  const [width, setWidth] = useState(dimensions.window.width);
  const [height, setHeight] = useState(dimensions.window.height);
  const [deleteModal, viewDeleteModal] = useState(null);
  const setDataInAddress = (data) => {
    setAddress({ ...address, ...data });
  };
  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
    setWidth(window.width);
    setHeight(window.height);
  };

  useEffect(() => {
    fetchRazorPayKey({
      key: "RAZORPAY_KEY",
      business: business._id,
    });
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
      setcheckOutPhase1({ current: "list" });
    };
  }, []);
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      let [firstElement] = addresses;
      setSelectedAdress((addresses.find((x) => x.default) || firstElement)._id);
      setcheckOutPhase1({ current: "list" });
    }
  }, [addresses]);
  const nextPress = () => {
    setValidateNow(false);
    if (checkOutPhase1.current === "contact") {
      if (!address || !address.name || !address.phone || !address.email) {
        setValidateNow(true);
      } else {
        setcheckOutPhase1({ current: "address" });
      }
    } else {
      if (
        address.street1 &&
        address.street2 &&
        address.city &&
        address.pincode &&
        address.state &&
        address.country
      ) {
        addAddress(address);
        setcheckOutPhase1({ current: "list" });
      } else {
        setValidateNow(true);
      }
    }
  };
  const selectAddressAndProceed = () => {
    if (selectedAddress) {
      updateCart({
        _id: currentCart._id,
        address: selectedAddress,
      });
      navigation.navigate("payment");
    } else {
      // console.error("Please select any of the address first!");
      addError("Please select any of the address first!", 3000);
    }
  };
  // const updateAddressAndNavigate = () => {
  //   addAddress(address);
  //   setAddressObj(address);
  // };
  return (
    // <CheckOutContext.Provider value={addressObj}>
    <View
      style={{
        flex: 1,
        // maxHeight:
        //   Platform.OS === "android" || Platform.OS === "ios"
        //     ? window.height - 50
        //     : window.height - 60,

        backgroundColor: checkOutPhase1.current === "list" ? "grey" : "#fff",
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
          onPressIcon={() => navigation.navigate("cart")}
          // onPress={() => navigation.navigate("home")}
          imageStyle={{ marginTop: 5 }}
          onPressLogo={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
        ></SaiWinLogo>
      </View>
      <View
        style={{
          minHeight: 15,
          maxHeight: 40,
          marginTop: 10,
        }}
      >
        <SelectionCircle
          style={{ flex: 1, minHeight: "100%" }}
          firstCircle={true}
        ></SelectionCircle>
      </View>
      <View style={{ flex: 8, marginTop: 30 }}>
        <View style={{ flex: 5 }}>
          {checkOutPhase1.current === "list" ? (
            <ScrollView
              style={{
                height: Platform.OS === "android" ? window.height / 3.2 : null,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#fff",
                  marginLeft: 10,
                  marginTop: 8,
                }}
              >
                Select Address
              </Text>
              {addresses.length !== 0
                ? addresses?.map((x, i) => (
                    <View key={x._id} style={styles.addressBox}>
                      <View style={{ flex: 9 }}>
                        <Text>{x.name}</Text>
                        <Text>
                          {x.phone}
                          {x.alternativePhone ? `, ${x.alternativePhone}` : ""}
                        </Text>
                        <Text>{x.street1}</Text>
                        <Text>{x.street2}</Text>
                        <Text>
                          {x.city}
                          {", "}
                          {x.pincode}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text>
                            {x.state}
                            {", "}
                            {x.country}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            setcheckOutPhase1(
                              { current: "contact" },
                              setAddress(x)
                            )
                          }
                          style={{ alignSelf: "flex-end" }}
                        >
                          <Icon name="edit"></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={
                            () =>
                              viewDeleteModal({
                                view: true,
                                selected: x._id,
                              })
                            // navigation.navigate("delete-address", { id: x._id })
                          }
                          style={{
                            alignSelf: "flex-end",
                            marginRight: 7,
                            marginBottom: 16,
                          }}
                        >
                          <Icon fill="grey" name="delete"></Icon>
                        </TouchableOpacity>

                        <View
                          style={{
                            width: 45,
                            alignSelf: "flex-end",
                          }}
                        >
                          <Checkbox
                            setValue={() =>
                              setSelectedAdress(
                                selectedAddress == x._id ? null : x._id
                              )
                            }
                            value={selectedAddress === x._id}
                            style={{
                              borderRadius: 100,
                              marginLeft: 15,
                            }}
                          ></Checkbox>
                        </View>
                      </View>
                    </View>
                  ))
                : checkOutPhase1.current === "contact"}
            </ScrollView>
          ) : checkOutPhase1.current === "contact" ? (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginBottom: 7,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    marginLeft: 7,
                    fontSize: 19 * (window.height * 0.001),
                  }}
                >
                  Name
                </Text>

                <TextInput
                  value={address.name}
                  onChangeText={(e) => setDataInAddress({ name: e })}
                  placeholder="Name"
                  style={{
                    padding: 8,
                    minHeight: window.height < 500 ? window.height / 25 : null,
                    borderBottomWidth: 1,
                    borderColor: "#D6D2D2",
                    fontSize: 17 * (window.height * 0.001),
                  }}
                ></TextInput>
                {validateNow ? (
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 7,
                      fontSize: 10 * (window.height * 0.002),
                    }}
                  >
                    Please provide your Name
                  </Text>
                ) : (
                  <></>
                )}
              </View>
              <View
                style={{ flex: 1, marginBottom: 7, flexDirection: "column" }}
              >
                <Text
                  style={{
                    marginLeft: 7,
                    fontSize: 19 * (window.height * 0.001),
                  }}
                >
                  Contact Number
                </Text>
                <TextInput
                  keyboardType="phone-pad"
                  maxLength={10}
                  dataDetectorTypes="phoneNumber"
                  textContentType="telephoneNumber"
                  placeholder="Contact Number"
                  value={address.phone}
                  onChangeText={(value) => {
                    let num = value.replace(".", "");
                    if (isNaN(num)) {
                      addError("Please provide contact number", 3000);
                    } else {
                      setDataInAddress({ phone: value });
                    }
                  }}
                  style={{
                    padding: 8,
                    minHeight: window.height < 500 ? window.height / 25 : null,
                    borderBottomWidth: 1,
                    borderColor: "#D6D2D2",
                    fontSize: 17 * (window.height * 0.001),
                  }}
                ></TextInput>
                {validateNow ? (
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 7,
                      fontSize: 10 * (window.height * 0.002),
                    }}
                  >
                    Please provide your Contact number
                  </Text>
                ) : (
                  <></>
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    marginLeft: 7,
                    fontSize: 19 * (window.height * 0.001),
                  }}
                >
                  Alternative Contact
                </Text>
                <TextInput
                  keyboardType="phone-pad"
                  maxLength={10}
                  dataDetectorTypes="phoneNumber"
                  textContentType="telephoneNumber"
                  placeholder="Alternative Contact"
                  value={address.alternativePhone}
                  onChangeText={(value) => {
                    let num = value.replace(".", "");
                    if (isNaN(num)) {
                      addError("Please provide contact number", 3000);
                    } else {
                      setDataInAddress({ alternativePhone: value });
                    }
                  }}
                  style={{
                    padding: 8,
                    minHeight: window.height < 500 ? window.height / 25 : null,
                    borderBottomWidth: 1,
                    borderColor: "#D6D2D2",
                    fontSize: 17 * (window.height * 0.001),
                  }}
                ></TextInput>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    marginLeft: 7,
                    fontSize: 19 * (window.height * 0.001),
                  }}
                >
                  Email
                </Text>
                <TextInput
                  value={address.email}
                  onChangeText={(e) => setDataInAddress({ email: e })}
                  placeholder="Email"
                  style={{
                    padding: 8,
                    minHeight: window.height < 500 ? window.height / 25 : null,
                    borderBottomWidth: 1,
                    borderColor: "#D6D2D2",
                    fontSize: 17 * (window.height * 0.001),
                  }}
                ></TextInput>
                {validateNow ? (
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 7,
                      fontSize: 10 * (window.height * 0.002),
                    }}
                  >
                    Please provide your Email
                  </Text>
                ) : (
                  <></>
                )}
              </View>

              {/* <FormComponent
                headerStyle={{ marginLeft: 7 }}
                textInputStyle={{ padding: 7 }}
                style={{ flex: 1, marginTop: 7 }}
                placeholder="Name"
                header="Name"
                value={address.name}
                onChangeText={(e) => setDataInAddress({ name: e })}
                inValidText="Please enter name!"
                autoFocus={true}
                validateNow={validateNow}
              ></FormComponent>
              <FormComponent
                dataDetectorTypes="phoneNumber"
                textContentType="telephoneNumber"
                headerStyle={{ marginLeft: 7 }}
                textInputStyle={{ padding: 7 }}
                maxLength={10}
                validationType="numeric"
                keyboardType="phone-pad"
                style={{ flex: 1, marginTop: 13 }}
                placeholder="Contact Number"
                header="Contact Number"
                value={address.phone}
                onChangeText={(value) => {
                  let num = value.replace(".", "");
                  if (isNaN(num)) {
                    addError("Please provide contact number", 3000);
                  } else {
                    setDataInAddress({ phone: value });
                  }
                }}
                validateNow={validateNow}
                inValidText="Please provide contact number!"
              ></FormComponent>
              <FormComponent
                dataDetectorTypes="phoneNumber"
                textContentType="telephoneNumber"
                headerStyle={{ marginLeft: 7 }}
                textInputStyle={{ padding: 7 }}
                maxLength={10}
                keyboardType="phone-pad"
                style={{ flex: 1, marginTop: 13 }}
                placeholder="Alternative Contact"
                header="Alternative Contact"
                value={address.alternativePhone}
                onChangeText={(value) => {
                  let num = value.replace(".", "");
                  if (isNaN(num)) {
                    addError("Please provide contact number", 3000);
                  } else {
                    setDataInAddress({ alternativePhone: value });
                  }
                }}
              ></FormComponent>
              <FormComponent
                textContentType="emailAddress"
                headerStyle={{ marginLeft: 7 }}
                textInputStyle={{ padding: 7 }}
                validationType="email"
                style={{ flex: 1, marginTop: 7 }}
                placeholder="Email"
                header="Email"
                value={address.email}
                inValidText="Please enter your email!"
                // onChangeText={(e) => {
                //   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                //   if (reg.test(e) === true) {
                //     setDataInAddress({ email: e });
                //   } else {
                //     addError("Please provide your email", 3000);
                //   }
                // }}
                onChangeText={(e) => setDataInAddress({ email: e })}
                validateNow={validateNow}
              ></FormComponent> */}
              <View
                style={{
                  marginLeft: 10,

                  paddingTop: 10,
                }}
              >
                <Checkbox
                  setValue={(data) => setDataInAddress({ default: data })}
                  value={address.default}
                  style={{ borderRadius: 100, marginTop: 5 }}
                  label="Save the address and contact information for faster checkouts in future."
                ></Checkbox>
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                marginTop:
                  Platform.OS === "android" || Platform.OS === "ios"
                    ? 15
                    : null,
              }}
            >
              <View
                style={{
                  marginLeft: 10,
                  maxHeight: 40,
                  marginBottom: 10,
                }}
              >
                <Checkbox
                  setValue={(data) => setDataInAddress({ billingSame: data })}
                  value={address.billingSame}
                  style={{ borderRadius: 100 }}
                  label="Billing Address is the same as delivery"
                ></Checkbox>
              </View>
              <FormComponent
                headerStyle={{ marginLeft: 7 }}
                textInputStyle={{ padding: 7 }}
                placeholder="Street 1"
                header="Street 1"
                value={address.street1}
                onChangeText={(e) => setDataInAddress({ street1: e })}
                autoFocus={true}
              ></FormComponent>
              <FormComponent
                headerStyle={{ marginLeft: 7 }}
                textInputStyle={{ padding: 7 }}
                placeholder="Street 2"
                header="Street 2"
                value={address.street2}
                onChangeText={(e) => setDataInAddress({ street2: e })}
                // autoFocus={true}
              ></FormComponent>
              <FormComponent
                headerStyle={{ marginLeft: 7 }}
                textInputStyle={{ padding: 7 }}
                placeholder="City"
                header="City"
                value={address.city}
                onChangeText={(e) => setDataInAddress({ city: e })}
              ></FormComponent>
              <FormComponent
                headerStyle={{ marginLeft: 7 }}
                textInputStyle={{ padding: 7 }}
                maxLength={6}
                validationType="pin"
                placeholder="Pincode"
                header="Pincode"
                value={address.pincode}
                keyboardType="numeric"
                inValidText="Enter Correct Pin"
                onChangeText={(e) => setDataInAddress({ pincode: e })}
              ></FormComponent>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <FormComponent
                  headerStyle={{ marginLeft: 7 }}
                  textInputStyle={{ padding: 7 }}
                  placeholder="State"
                  header="State"
                  value={address.state}
                  onChangeText={(e) => setDataInAddress({ state: e })}
                ></FormComponent>
                <FormComponent
                  headerStyle={{ marginLeft: 7 }}
                  textInputStyle={{ padding: 7 }}
                  placeholder="Country"
                  header="Country"
                  value={address.country}
                  onChangeText={(e) => setDataInAddress({ country: e })}
                ></FormComponent>
              </View>
            </View>
          )}
        </View>
        {checkOutPhase1.current !== "list" ? (
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Button
              pressFunc={() =>
                checkOutPhase1.current === "contact"
                  ? navigation.navigate("cart")
                  : setcheckOutPhase1({ current: "contact" })
              }
              style={{
                marginRight: 10,
                borderColor: "#FA4248",
                maxHeight: window.height / 15,
                minHeight: window.height / 15,
                minWidth: window.width / 2.3,
                maxWidth: window.width / 2.3,
              }}
              title="Back"
            ></Button>
            <Button
              style={{
                borderColor: "#FA4248",
                backgroundColor: "#FA4248",
                maxHeight: window.height / 15,
                minHeight: window.height / 15,
                minWidth: window.width / 2.3,
                maxWidth: window.width / 2.3,
              }}
              pressFunc={() => nextPress()}
              textStyle={{ color: "#fff" }}
              title="Next"
            ></Button>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              minHeight: window.height / 10,
              maxHeight: window.height / 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setcheckOutPhase1({ current: "contact" })}
              style={{ flex: 1, minWidth: "100%" }}
            >
              <View
                style={{
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                  flex: 1,
                  backgroundColor: "rgb(193, 56, 62)",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#fff",
                    alignSelf: "center",
                  }}
                >
                  ADD NEW ADDRESS
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectAddressAndProceed()}
              style={{
                flex: 1,
                minWidth: "100%",
                backgroundColor: "rgb(193, 56, 62)",
              }}
            >
              <View
                style={{
                  width: "100%",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 15,
                  elevation: 5,
                  alignSelf: "center",
                  zIndex: 1,
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                  flex: 1,
                  backgroundColor: "#FA4248",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#fff",
                    alignSelf: "center",
                  }}
                >
                  SELECT ADDRESS
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <ModalView
          showModal={deleteModal && deleteModal.view}
          onSelection={() => viewDeleteModal(null)}
          modalViewStyle={{
            padding: 20,
            minHeight: 120,
            maxHeight: 130,
            maxWidth: window.width - 50,
            minWidth: window.width - 150,
          }}
          add={
            <View
              style={{
                minHeight: 60,
                maxWidth: 600,
                backgroundColor: "#FFFFFF",
                alignSelf: "center",
                flex: 1,
                paddingBottom: 30,
              }}
            >
              <View
                style={{
                  minHeight: 100,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 17 }}>Are you sure to delete</Text>
                <View style={{ marginTop: 50, flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      addressDelete(deleteModal.selected);
                      viewDeleteModal(null);
                    }}
                  >
                    <Text style={{ color: "blue", fontSize: 17 }}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => viewDeleteModal(null)}>
                    <Text
                      style={{ color: "blue", marginLeft: 15, fontSize: 17 }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        ></ModalView>
      </View>
    </View>
    // </CheckOutContext.Provider>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    marginTop: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  select: {
    flex: 1,
    backgroundColor: "red",
  },
  checkbox: {
    flex: 1,
    backgroundColor: "blue",
  },

  addressBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "gray",
    padding: 15,
    marginBottom: 10,
  },
});
const mapStateToProps = ({ addresses, currentCart, business }) => ({
  addresses,
  currentCart,
  business,
});
export default connect(mapStateToProps, {
  addAddress,
  updateCart,
  addressDelete,
  addError,
  fetchRazorPayKey,
})(Checkout);
