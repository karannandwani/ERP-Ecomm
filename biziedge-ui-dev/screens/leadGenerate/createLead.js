import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import { createLead } from "../../redux/actions/leads.action";
import { fetchCountry } from "../../redux/actions/country.action";
import { fetchState } from "../../redux/actions/states.action";
import Modal from "../../components/common/modal/modal";
import PopUp from "../../components/popUp/popUp";

const CreateLead = ({
  selectedBusiness,
  states,
  country,
  fetchState,
  fetchCountry,
  createLead,
}) => {
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [state, setState] = useState(null);
  const [countryInput, setCountry] = useState(null);
  const [pinCode, setPincode] = useState(null);
  const [phoneNumber, setPhoneNo] = useState(null);
  const [email, setEmail] = useState(null);
  const [showStateSelectionModal, setStateSelectionModal] = useState(false);
  const [showCountrySelectionModal, setCountrySelectionModal] = useState(false);

  useEffect(() => {
    fetchState();
  }, [!states || states.length == 0]);

  useEffect(() => {
    fetchCountry();
  }, [!country || country.length == 0]);

  const submitForm = () => {
    const finalForm = {
      business: selectedBusiness.business._id,
      name,
      phoneNumber,
      email,
      address: {
        line1: address,
        pinCode,
        city,
        state,
        district,
        country: countryInput,
      },
      storeLocation: {},
    };
    createLead(finalForm);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        {/* <ImagePickerCard
          onSelection={(e) => setImage(e)}
          style={styles.imageHolder}
          multiple={false}
          data={image}
        /> */}
        <InputWithLabel
          label={"Name"}
          placeholder={"Name"}
          onChange={(txt) => setName(txt)}
        />
        <InputWithLabel
          label={"Address"}
          placeholder={"Address"}
          multiline={true}
          onChange={(txt) => setAddress(txt)}
        />
        <InputWithLabel
          label={"City"}
          placeholder={"City"}
          onChange={(txt) => setCity(txt)}
        />
        <InputWithLabel
          label={"District"}
          placeholder={"District"}
          onChange={(txt) => setDistrict(txt)}
        />
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 3,
              alignItems: "flex-end",
              justifyContent: "center",
              marginRight: 6,
            }}
          >
            <Text style={{ fontSize: 16 }}>State</Text>
          </View>

          <View style={{ flex: 7, alignItems: "flex-start", height: 40 }}>
            <PopUp
              label="State"
              placeholder="State"
              renderData={states}
              onSelection={(e) => setState(e.name)}
              selectionValue={states}
              visible={showStateSelectionModal}
              style={{
                height: 40,
                minWidth: 80,
                width: 344,
                maxWidth: 344,
                margin: 0,
                padding: 0,
              }}
            ></PopUp>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 3,
              alignItems: "flex-end",
              justifyContent: "center",
              marginRight: 6,
            }}
          >
            <Text style={{ fontSize: 16 }}>Country</Text>
          </View>

          <View style={{ flex: 7, alignItems: "flex-start", height: 40 }}>
            <PopUp
              label="Country"
              placeholder="Country"
              renderData={country}
              onSelection={(e) => setCountry(e.name)}
              selectionValue={country}
              visible={showCountrySelectionModal}
              style={{
                height: 40,
                minWidth: 80,
                width: 344,
                maxWidth: 344,
                margin: 0,
                padding: 0,
              }}
            ></PopUp>
          </View>
        </View>
        <InputWithLabel
          label={"Pincode"}
          placeholder={"Pincode"}
          onChange={(txt) => setPincode(txt)}
        />
        <InputWithLabel
          label={"Phone No."}
          placeholder={"Phone No."}
          onChange={(txt) => setPhoneNo(txt)}
        />
        <InputWithLabel
          label={"Email"}
          placeholder={"Email"}
          onChange={(txt) => setEmail(txt)}
        />

        <View style={{ alignItems: "center" }}>
          <Button
            style={{ width: 200 }}
            title={"Submit"}
            pressFunc={() => submitForm()}
          />
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = ({ selectedBusiness, states, country }) => ({
  selectedBusiness,
  states,
  country,
});
export default connect(mapStateToProps, {
  fetchState,
  fetchCountry,
  createLead,
})(CreateLead);

const InputWithLabel = ({
  label = "Label",
  placeholder = "Placeholder",
  multiline = false,
  onChange,
}) => {
  const [focus, setFocus] = useState(false);
  const customStyle = focus ? styles.textFocusStyle : styles.textStyle;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <View
        style={{
          flex: 3,
          alignItems: "flex-end",
          justifyContent: "flex-start",
          marginRight: 6,
        }}
      >
        <Text style={{ fontSize: 16 }}>{label}</Text>
      </View>

      <View style={{ flex: 7, alignItems: "flex-start", marginLeft: 6 }}>
        <TextInput
          onChangeText={(txt) => onChange(txt)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          multiline={multiline}
          numberOfLines={4}
          style={[
            {
              height: multiline ? 80 : 40,
              minWidth: 80,
              width: 344,
              maxWidth: 344,
            },
            customStyle,
          ]}
          placeholder={placeholder}
        ></TextInput>
      </View>
    </View>
  );
};

// const DropDownView = ({modalVisible}) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       presentationStyle="overFullScreen"
//       visible={modalVisible}
//       onRequestClose={() => {
//         setModalVisible(false);
//       }}
//       ariaHideApp={false}
//     >
//       <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text
//               style={{
//                 width: "80%",
//                 fontWeight: "bold",
//                 textAlign: "center",
//                 marginTop: 15,
//                 fontSize: 18,
//               }}
//             >
//               {label}
//             </Text>
//             <FlatList
//               keyExtractor={(item, index) => index.toString()}
//               data={renderData}
//               renderItem={({ item, index }) => {
//                 return (
//                   <RenderItem
//                     item={item}
//                     index={index}
//                     selectItem={selectItem}
//                     displayField={displayField}
//                   />
//                 );
//               }}
//             />
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  formBox: {
    minWidth: 400,
    width: 900,
    maxWidth: 1000,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    padding: 10,
  },
  textStyle: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  textFocusStyle: {
    borderColor: "blue",
    borderBottomWidth: 1,
  },
});
