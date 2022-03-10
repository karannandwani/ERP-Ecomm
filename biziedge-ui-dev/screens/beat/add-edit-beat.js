import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import { Styles } from "../../globalStyle";
import CheckBox from "../../components/common/checkBox/checkbox";
import MapContainer from "../../components/common/map/map";
const AddEditBeat = ({ BeatInfo, selectedBusiness, onChange, resetField }) => {
  const [name, setName] = useState("");
  const [areas, setAreas] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [value, setCheckBoxValue] = useState(true);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const handleItemCallback = (checked) => {
    setCheckBoxValue(checked);
  };
  useEffect(() => {
    setName(BeatInfo && BeatInfo.name ? BeatInfo.name : "");
    setAreas(BeatInfo && BeatInfo.areas ? BeatInfo.areas : "");
    setCheckBoxValue(BeatInfo && BeatInfo.active);
    setCoordinates(
      BeatInfo && BeatInfo.location
        ? JSON.stringify(BeatInfo.location.coordinates)
        : ""
    );
  }, [BeatInfo]);

  const onMarkerClick = (props, marker, e) => {};

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {BeatInfo._id ? "Update " : "Add " + "Beat"}
        </Text>
      </View>
      {/* <View style={{ minHeight: 400 }}>
        <MapContainer
          coordinates={[
            { lat: 85.85437774658203, lng: 20.306275166744015 },
            { lat: 85.85410952568054, lng: 20.306164484166608 },
            { lat: 85.85334777832031, lng: 20.305872684265104 },
            { lat: 85.8535087108612, lng: 20.305369579695267 },
            { lat: 85.85395932197571, lng: 20.305470200740007 },
            { lat: 85.85413098335266, lng: 20.30516833740964 },
            { lat: 85.85463523864746, lng: 20.305419890225817 },
            { lat: 85.85437774658203, lng: 20.306275166744015 },
          ]}
          onMarkerClick={onMarkerClick}
        ></MapContainer>
      </View> */}
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          onChangeText={(e) => setName(e)}
          value={name}
          placeholderTextColor="#AFAEBF"
          placeholder="Name"
          label="Name"
          inValidText="Name should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
          resetField={resetField}
        ></InputboxWithBorder>
      </View>

      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setAreas(e)}
          value={areas}
          placeholderTextColor="#AFAEBF"
          placeholder="Areas"
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Areas"
          // inValidText="Area Should Not Be Blank"
          // required={true}
          // validateNow={validateNow}
          // isValid={(n) => setForm({ ...form, areas: n })}
        />
      </View>
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          onChangeText={(e) => setCoordinates(e)}
          value={coordinates}
          placeholderTextColor="#AFAEBF"
          placeholder="Coordinates"
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Coordinates"
          multiline={true}
          style={{ minHeight: 50 }}
        />
      </View>
      <View style={{ padding: 10 }}>
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
      </View>
      <View style={[{ padding: 10 }]}>
        <Button
          pressFunc={() => {
            if (form && form.name) {
              onChange({
                ...BeatInfo,
                name: name,
                areas: areas,
                active: value,
                location: {
                  type: "Polygon",
                  coordinates: coordinates,
                },
              });
            } else {
              setValidateNow(true);
            }
          }}
          title={"Submit"}
        ></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});

export default AddEditBeat;
