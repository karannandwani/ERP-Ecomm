import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import Button from "../common/buttom/button";
import SearchBar from "../common/serchBar/searchBar";
import Modal from "../common/modal/modal";
import InputboxWithBorder from "../common/inputBox/inputBoxWithBorder";
import { addUser } from "../../redux/actions/user.action";
import CheckBox from "../common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import AddEditUser from "../../screens/user_management/add-edit-user";
import AddModal from "../../components/addModal/addModal";
import Avatar from "../common/avatar";
import { DimensionContext } from "../dimensionContext";
import { useContext } from "react";

const AssignDriverComponent = ({
  pressFunc,
  onChangeText,
  style,
  renderData,
  onPress,
  selectedVehicleObj,
  navigation,
  selectedFacility,
  selectedBusiness,
  addUser,
  cancelModalVisible,
  roles,
}) => {
  const [driverModalVisible, setDriverModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(false);
  const [addDriver, setAddDriver] = useState(false);
  const [selected, setSelected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { window } = useContext(DimensionContext);
  const handleCallBack = (childData) => {
    setDriverModalVisible(true);
    setAddDriver(false);
    setSelectedDriver(childData);
    selectedVehicleObj(childData);
  };
  const closeModal = () => {
    setDriverModalVisible(false);
  };
  const handleCallback = (childData) => {
    setModalVisible(childData);
  };
  // useEffect(() => {
  //   setSelected({
  //     businessId: selectedBusiness.business._id,
  //     // facilityId: selectedFacility ? selectedFacility._id : null,
  //     active: true,
  //     // roles
  //   });
  // })
  return (
    <View>
      <Text style={Styles.h1}>Assign Driver</Text>
      <View
        style={{
          height: window.height / 1.6,
          right: 10,
        }}
      >
        <SearchBar
          hideScrollbar={false}
          renderData={renderData}
          onSelection={handleCallBack}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => handleCallBack(item)}>
                <View
                  style={{
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    style={{
                      height: 40,
                      width: 35,
                      borderRadius: 20,
                      alignSelf: "center",
                    }}
                    source={
                      item.image
                        ? {
                            uri: item?.image
                              ? `data:image/jpeg;base64,${item.image}`
                              : "",
                          }
                        : null
                    }
                  />

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
      </View>

      <View
        style={{
          marginRight: 15,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Button
          title="Cancel"
          pressFunc={
            cancelModalVisible
            // setAddDriver(true);
            // setVehicleModalVisible(true);
          }
        ></Button>
        {/* <View style={{ marginRight: 20 }}>
          <Button
            title="Cancel"
            pressFunc={
              cancelModalVisible
              // setAddDriver(true);
              // setVehicleModalVisible(true);
            }
          ></Button>
        </View> */}
        {/* <View style={{ marginLeft: 10, paddingRight: 10 }}>
          <Button
            title="Add Driver"
            pressFunc={() => {
              setAddDriver(true);
              setDriverModalVisible(false);
              setModalVisible(true);
              setSelected({
                businessId: selectedBusiness.business._id,
                facilityId: selectedFacility ? selectedFacility._id : null,
                active: true,
              });
            }}
          ></Button>
        </View> */}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        presentationStyle="overFullScreen"
        visible={driverModalVisible}
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
                  addDriver
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
                {addDriver ? (
                  <AddModal
                    showModal={modalVisible}
                    onSelection={handleCallback}
                    modalViewStyle={{
                      maxWidth:
                        window.width > 960
                          ? window.width / 3
                          : window.width > 641 && window.width < 960
                          ? window.width / 2
                          : window.width < 641 && window.width > 500
                          ? window.width / 1.5
                          : window.width < 500 && window.width > 360
                          ? window.width / 1.2
                          : window.width - 60,
                      minWidth:
                        window.width > 960
                          ? window.width / 3
                          : window.width > 641 && window.width < 960
                          ? window.width / 2
                          : window.width < 641 && window.width > 500
                          ? window.width / 1.5
                          : window.width < 500 && window.width > 360
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
                      <AddEditUser
                        userInfo={selected}
                        roles={roles.filter((x) => x.name === "Driver")}
                        business={selectedBusiness.business._id}
                        onChange={(userInfo) => {
                          addUser(userInfo).then(() => setSelected(false));
                          setModalVisible(false);
                        }}
                      ></AddEditUser>
                    }
                  ></AddModal>
                ) : (
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 1.5,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>
                        Are you sure to assign{" "}
                        {" " + selectedDriver?.name + " "} for this order?
                      </Text>
                    </View>

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
                        onPress={() => setDriverModalVisible(false)}
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
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
const mapStateToProps = ({ selectedBusiness, selectedFacility, roles }) => ({
  selectedBusiness,
  selectedFacility,
  roles,
});

export default connect(mapStateToProps, { addUser })(AssignDriverComponent);
