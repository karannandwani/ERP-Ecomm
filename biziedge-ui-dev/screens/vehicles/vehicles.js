import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import SearchBar from "../../components/common/serchBar/searchBar";
import { connect } from "react-redux";
import AddModal from "../../components/addModal/addModal";
import { fetchVehicles } from "../../redux/actions/vehicles.action";
import { addVehicleAction } from "../../redux/actions/vehicles.action";
import Button from "../../components/common/buttom/button";
import AddEditVehicle from "./add-edit-vehicle";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";

const Vehicles = ({
  vehicles,
  fetchVehicles,
  selectedBusiness,
  addVehicleAction,
  selectedFacility,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  const [resetField, setResetField] = useState(false);

  useEffect(() => {
    if (selectedFacility) {
      setFilterdata(phrase);
    } else {
      setFilteredVehicles(vehicles.map((x) => x));
    }
  }, [vehicles, selectedFacility]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);

  const setFilterdata = (text) => {
    if (vehicles)
      setFilteredVehicles([
        ...vehicles.filter(
          (x) =>
            x.name.toLowerCase().startsWith(text.toLowerCase()) &&
            x.facility === selectedFacility._id
        ),
      ]);
  };
  const searchVehicleByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchVehicles({
      facilities: selectedBusiness.facilities.map((x) => x._id),
      business: selectedBusiness.business._id,
    });
  };
  const handleCallback = (childData) => {
    setResetField(!resetField);
    setModalVisible(childData);
  };
  const handleItemCallback = (childData) => {
    if (selectedFacility) {
      setSelected(childData);
      setModalVisible(true);
    }
  };

  return (
    <View style={[Styles.container]}>
      {selectedFacility ? (
        <View
          style={{
            flexDirection: "row-reverse",
          }}
        >
          <View>
            <Button
              title={"Add Vehicle"}
              pressFunc={() => {
                // setSelected(false);
                setSelected({});
                setModalVisible(true);
              }}
            ></Button>
          </View>
        </View>
      ) : (
        <></>
      )}
      <View
        style={{
          width:
            window.width >= 1040
              ? window.width / 4
              : window.width >= 960 && window.width < 1040
              ? window.width / 3
              : window.width >= 641 && window.width < 960
              ? window.width / 2
              : window.width - 20,
          paddingTop: 20,
        }}
      >
        <SearchBar
          placeholder="Search Vehicle"
          renderData={filteredVehicles}
          onSelection={handleItemCallback}
          onChangeText={searchVehicleByPhrase}
        ></SearchBar>
      </View>

      <AddModal
        showModal={modalVisible}
        onSelection={handleCallback}
        modalViewStyle={{
          maxWidth:
            window.width > 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 360
              ? window.width / 1.2
              : window.width - 60,
          minWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 360
              ? window.width / 1.2
              : window.width - 60,
          flexDirection: "column",
          paddingTop: 20,
          paddingBottom: window.width > 360 ? 20 : 10,
          paddingLeft: window.width > 360 ? 40 : 10,
          paddingRight: window.width > 360 ? 40 : 10,
          borderRadius: 6,
          backgroundColor: "#fefefe",
        }}
        add={
          <AddEditVehicle
            vehicleInfo={selected}
            resetField={resetField}
            selectedBusiness={selectedBusiness}
            onChange={(vehicle) => {
              if (vehicle._id) {
                addVehicleAction(vehicle).then(() => setSelected(false));
                setModalVisible(false);
              } else {
                addVehicleAction({
                  ...vehicle,
                  facility: selectedFacility._id,
                  business: selectedBusiness.business._id,
                }).then(() => setSelected(false));
                setModalVisible(false);
                setResetField(!resetField);
              }
            }}
          ></AddEditVehicle>
        }
      ></AddModal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = ({ vehicles, selectedBusiness, selectedFacility }) => ({
  vehicles,
  selectedBusiness,
  selectedFacility,
});

export default connect(mapStateToProps, { fetchVehicles, addVehicleAction })(
  Vehicles
);
