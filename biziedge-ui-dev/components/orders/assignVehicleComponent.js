import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import CardWithoutGraph from "../../components/common/cards/CardWithoutGraph";
import Button from "../common/buttom/button";
import SearchBar from "../common/serchBar/searchBar";
import AddModal from "../addModal/addModal";
import Modal from "../common/modal/modal";
import InputboxWithBorder from "../common/inputBox/inputBoxWithBorder";
import { addVehicleAction } from "../../redux/actions/vehicles.action";
import CheckBox from "../common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import AddEditVehicle from "../../screens/vehicles/add-edit-vehicle";
import { DimensionContext } from "../../components/dimensionContext";
const AssignVehicleComponent = ({
  pressFunc,
  onChangeText,
  style,
  renderData,
  onPress,
  selectedVehicleObj,
  navigation,
  selectedFacility,
  selectedBusiness,
  addVehicleAction,
  cancelModalVisible,
}) => {
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(false);
  const [addVehicle, setAddVehicle] = useState(false);
  const [vehicleName, setVehicleName] = useState(false);
  const [vehicleModel, setVehicleModel] = useState(false);
  const [value, setCheckBoxValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [resetField, setResetField] = useState(false);

  const { window } = useContext(DimensionContext);
  const handleCallBack = (childData) => {
    setVehicleModalVisible(true);
    setAddVehicle(false);
    setSelectedVehicle(childData);
    selectedVehicleObj(childData);
  };
  const closeModal = () => {
    setVehicleModalVisible(false);
  };
  const handleItemCallback = (checked) => {
    setCheckBoxValue(checked);
  };

  const handleCallback = (childData) => {
    setResetField(!resetField);
    setModalVisible(childData);
  };

  let addVehicleObj = {
    business: selectedBusiness.business._id,
    facility: selectedFacility?._id,
    active: "true",
    name: vehicleName,
    model: vehicleModel,
    active: value,
  };
  return (
    <View>
      <Text style={Styles.h1}>Assign Vehicle</Text>
      <View
        style={{
          height: window.height / 1.6,
          right: 10,
        }}
      >
        <SearchBar
          scrollViewStyle={{ maxHeight: window.height / 2 }}
          hideScrollbar={false}
          renderData={renderData}
          onSelection={handleCallBack}
        ></SearchBar>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <View>
          <Button
            title="Cancel"
            pressFunc={
              cancelModalVisible
              // setAddVehicle(true);
              // setVehicleModalVisible(true);
            }
          ></Button>
        </View>
        <View style={{ marginLeft: 10, paddingRight: 10 }}>
          <Button
            title="Add Vehicle"
            pressFunc={() => {
              setAddVehicle(true);
              setVehicleModalVisible(true);
              setModalVisible(true);
            }}
          ></Button>
        </View>
      </View>

      {/* <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>Assign Vehicle</Text>
      </View> */}
      {/* <View nestedScrollEnabled={true} style={{ height: window.height / 1.7 }}>
        <SearchBar
          disableSearchBar={true}
          hideScrollbar={false}
          renderData={renderData}
          onSelection={handleCallBack}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => handleCallBack(item)}>
                <View style={{ padding: 10 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        ></SearchBar>
      </View> */}

      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <View>
          <Button
            title="Cancel"
            pressFunc={
              cancelModalVisible
              // setAddVehicle(true);
              // setVehicleModalVisible(true);
            }
          ></Button>
        </View>
        <View style={{ marginLeft: 10, paddingRight: 10 }}>
          <Button
            title="Add Vehicle"
            pressFunc={() => {
              setAddVehicle(true);
              setVehicleModalVisible(true);
              setModalVisible(true);
            }}
          ></Button>
        </View>
      </View> */}

      {addVehicle ? (
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
              resetField={resetField}
              selectedBusiness={selectedBusiness}
              vehicleInfo={{}}
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
      ) : (
        <Modal
          animationType="fade"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={vehicleModalVisible}
          onRequestClose={() => {
            closeModal();
          }}
          // ariaHideApp={false}
        >
          <TouchableWithoutFeedback onPress={() => closeModal()}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View
                  style={
                    addVehicle
                      ? {
                          maxHeight: "50%",
                          backgroundColor: "#fff",
                          minHeight: 400,
                          minWidth: 600,
                          maxWidth: Platform.OS === "web" ? "60%" : "90%",
                        }
                      : styles.modalView
                  }
                >
                  <View style={{ flex: 1 }}>
                    {/* <View
                      style={{
                        flex: 1.5,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    > */}
                    <Text style={{ fontSize: 18 }}>
                      Are you sure you want to select this vehicle
                    </Text>
                    <Text style={{ color: "#65ACCB", fontSize: 18 }}>
                      {` ${selectedVehicle?.name} ?`}
                    </Text>
                    {/* </View> */}

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignSelf: "flex-end",
                        marginRight: 22,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          onPress();
                          closeModal();
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            marginRight: 20,
                            color: "#65ACCB",
                            marginTop: 20,
                          }}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setVehicleModalVisible(false)}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            color: "#65ACCB",
                            marginTop: 20,
                          }}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#DFE0E3",
    padding: 10,
    justifyContent: "space-around",
    alignItems: "center",
    maxHeight: "20%",
  },
  listStyle: {
    backgroundColor: "#fff",
    marginBottom: 3,
    maxWidth: 300,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkBox: {
    minWidth: 30,
    maxWidth: 30,
    minHeight: 30,
    maxHeight: 30,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
const mapStateToProps = ({ selectedBusiness, selectedFacility }) => ({
  selectedBusiness,
  selectedFacility,
});

export default connect(mapStateToProps, { addVehicleAction })(
  AssignVehicleComponent
);
