import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import PopUp from "../../components/popUp/popUp";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import BeatModal from "../../components/common/beatModal";
import { DimensionContext } from "../../components/dimensionContext";

const AddEditFacility = ({
  facility,
  onChange,
  countries,
  states,
  suppliers,
  beats,
  searchBeatByPhrase,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [shortName, setShortName] = useState("");
  const [state, setState] = useState(null);
  const [supplier, setSupplier] = useState([]);
  const [country, setCountry] = useState(null);
  const [type, setType] = useState(null);
  const [active, setActive] = useState(null);
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const [autofeildValidation, setAutoFieldValidation] = useState(false);
  const { window } = useContext(DimensionContext);

  let types = [
    { _id: "Warehouse", name: "Warehouse" },
    { _id: "Store", name: "Store" },
  ];
  let supplierIds = supplier?.map((x) => {
    return x._id;
  });
  useEffect(() => {
    if (facility) {
      setForm({ ...facility });
      setName(facility.name || "");
      setAddress(facility.address || "");
      setShortName(facility.shortName || "");
      setState(facility.state);
      setCountry(facility.country);
      setType(facility.type ? { _id: facility.type, name: facility.type } : "");
      setSupplier(facility.suppliers ? facility.suppliers : null);
      // setAreas(facility.areas ? facility.areas.map((x) => x.area) : []);
      setAreas(facility.areas ? facility.areas : []);
      setActive(facility.active || false);
    }
  }, [facility]);

  return (
    <View style={[Styles.MainContainer]}>
      <View>
        <View style={Styles.headerContainer}>
          <Text style={Styles.h1}>
            {(facility && facility._id ? "Update " : "Add") + " " + "Facility"}
          </Text>
        </View>

        <View style={{ marginTop: 10, minheight: 40 }}>
          <PopUp
            style={{ minHeight: 40 }}
            onSelection={(data) => setType(data)}
            selectionValue={type}
            renderData={types}
            label={"Type"}
            placeholder="Select Type"
            containerStyle={{ marginBottom: 10 }}
          ></PopUp>
        </View>
        <View>
          <InputboxWithBorder
            onChangeText={(e) => setName(e)}
            label="Name"
            placeholder="Name"
            value={name}
            style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
            inValidText="Name should not be blank"
            required={true}
            validateNow={validateNow}
            isValid={(n) => setForm({ ...form, name: n })}
          ></InputboxWithBorder>
        </View>
        <View>
          <InputboxWithBorder
            onChangeText={(e) => setAddress(e)}
            style={{
              borderWidth: 1,
              borderColor: "#E8E9EC",
            }}
            label="Address"
            placeholder="Address"
            value={address}
            inValidText="Address should not be blank"
            required={true}
            validateNow={validateNow}
            isValid={(n) => setForm({ ...form, address: n })}
          ></InputboxWithBorder>
        </View>
        <View>
          <InputboxWithBorder
            onChangeText={(e) => setShortName(e)}
            style={{
              borderWidth: 1,
              borderColor: "#E8E9EC",
            }}
            label="Short Name"
            placeholder="Short Name"
            value={shortName}
            inValidText="Shortname should not be blank"
            required={true}
            validateNow={validateNow}
            isValid={(n) => setForm({ ...form, shortName: n })}
          ></InputboxWithBorder>
        </View>
        <View style={{ marginTop: 10, minheight: 40 }}>
          <PopUp
            style={{ minHeight: 40 }}
            onSelection={(data) => setCountry(data)}
            selectionValue={country}
            renderData={countries}
            label="Country"
            placeholder="Select Country"
            validate={autofeildValidation}
            invalidText="Country should not be blank"
          ></PopUp>
        </View>
        <View style={{ marginTop: 10, minheight: 40 }}>
          <PopUp
            style={{ minHeight: 40 }}
            label={"State"}
            onSelection={(data) => setState(data)}
            selectionValue={state}
            renderData={states}
            placeholder="Select State"
            validate={autofeildValidation}
            invalidText="State should not be blank"
          ></PopUp>
        </View>
        <View style={{ marginTop: 10, minheight: 40 }}>
          <PopUp
            style={{ minHeight: 40 }}
            onSelection={(data) => setSupplier(data)}
            selectionValue={supplier}
            renderData={suppliers}
            label={"Supplier"}
            placeholder="Select Supplier"
            multiSelect={true}
            validate={autofeildValidation}
            invalidText="Supplier should not be blank"
          ></PopUp>
        </View>
        <View style={{ marginTop: 10 }}>
          <BeatModal
            label={"Areas"}
            placeholder="Select Areas"
            renderData={beats.filter((x) => x.active === true)}
            displayField={"(index+1) + ' - '+ element?.name"}
            onSelection={(data) => setAreas(data)}
            selectionValue={areas}
            selectedFacility={facility}
            searchBeatByPhrase={searchBeatByPhrase}
          ></BeatModal>
        </View>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <CheckBox
            setValue={(data) => setActive(data)}
            value={active}
            isLabel={true}
            label={"Available"}
          ></CheckBox>
        </View>
      </View>
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
            if (
              (form && form.name,
              form.address,
              (form.shortName && country && state) ||
                (areas.length > 0 && supplier.length > 0))
            ) {
              onChange({
                ...facility,
                name: name,
                suppliers: supplier?.map((x) => x._id),
                shortName: shortName,
                state: state?._id,
                country: country?._id,
                address: address,
                type: type?._id,
                areas: areas?.map((x, i) => ({
                  area: x.area._id,
                  priority: x.priority,
                })),
                active: active,
              });
            } else {
              setValidateNow(true);
              setAutoFieldValidation(true);
            }
          }}
          title={"Submit"}
        />
      </View>
    </View>
  );
};

export default AddEditFacility;
