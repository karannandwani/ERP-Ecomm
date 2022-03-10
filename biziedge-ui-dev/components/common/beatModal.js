import React, { useState, useEffect, useContext } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Styles } from "../../globalStyle";
import { DataTable } from "../dataTable/dataTable";
import AutoCompleteModal from "./autocompleteModal/auto-complete-modal";
import Button from "./buttom/button";
import Icon from "./icon";
import Modal from "./modal/modal";
import { connect } from "react-redux";
import { addError } from "../../redux/actions/toast.action";
import { DimensionContext } from "../../components/dimensionContext";
import AddModal from "../../components/addModal/addModal";
import AddEditBeat from "../../screens/beat/add-edit-beat";
import { addBeatAction } from "../../redux/actions/beat.action";
// const reducer = (state, action) => {
//   state.push(...action);
//   return [...state];
// };

const BeatModal = ({
  label,
  placeholder,
  renderData,
  displayField,
  selectionValue,
  onSelection,
  selectedBusiness,
  facility,
  selectedFacility,
  addError,
  searchBeatByPhrase,
  addBeatAction,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  // const [beatPriority, setBeatPriority] = useReducer(reducer, []);
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const [beatSelected, setBeatSelected] = useState({});
  const [childModal, setChildModalVisiblity] = useState(false);
  const [resetField, setResetField] = useState(false);
  let rowData = [{ _id: "", name: "", priority: "", isPriority: false }];
  const [data, setData] = useState([
    { _id: null, name: "", priority: "", isPriority: false },
  ]);
  const [assignedAreas, setAssignedAreas] = useState([]);
  const { window } = useContext(DimensionContext);
  const onChange = ({ window }) => {
    setWidth(window.width);
    setHeight(window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);
  const modalAddParentDataCallBack = (childData) => {
    setChildModalVisiblity(false);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (facility && facility.length > 0) {
      setAssignedAreas(
        facility
          .filter((x) => x._id !== selectedFacility._id)
          .map((x) => x.areas)
          .flat()
      );
    }
    setSelected({
      business: selectedBusiness.business._id,
      active: true,
    });
  }, [facility, selectedFacility]);

  useEffect(() => {
    setBeatSelected({
      business: selectedBusiness.business._id,
      active: true,
    });
  }, [selectedBusiness]);

  useEffect(() => {
    setSelected(selectionValue);
    if (selectionValue.length > 0) {
      setData([...selectionValue]);
    }
  }, [selectionValue]);

  const selectItem = () => {
    let acceptedAreas = data.filter((x) => !x.isPriority);
    if (data.reduce((a, b) => a || b.isPriority, false)) {
      addError(
        "Sorry, the priority is already assigned to this area by another facility",
        3000
      );
    } else {
      onSelection(acceptedAreas);
      setModalVisible(false);
    }
  };

  const validate = (num, row, index) => {
    data[index].isPriority = assignedAreas.find(
      (x) => x.area._id === row.area._id && x.priority == num
    );
    data[index].priority = num;
    setData([...data]);
  };

  const modalCallBack = (row, result, index) => {
    let temp = data;
    temp[index].area = result;
    setData([...temp]);
    if (temp[index].priority) {
      validate(temp[index].priority, row, index);
    }
  };
  const extractionLogic = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <AutoCompleteModal
            name={"Area"}
            data={{
              // data: { name: row.item ? row.item : row.area.name },
              data: { name: row.area ? row.area.name : row.name },
              displayField: "name",
            }}
            onSelection={(result) => modalCallBack(row, result, index)}
            styleSingleSelect={{
              backgroundColor: "#fff",
            }}
            searchApi={searchBeatByPhrase}
            renderData={renderData}
            // isSubmitButtom={true}
            onRequestClose={childModal}
            addParentData={modalAddParentDataCallBack}
            addComponent={
              <View
                style={{
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
              >
                <AddEditBeat
                  resetField={resetField}
                  BeatInfo={beatSelected}
                  onChange={(beat) => {
                    addBeatAction(beat);
                    setChildModalVisiblity(!childModal);
                  }}
                ></AddEditBeat>
              </View>
            }
          ></AutoCompleteModal>
        ),
      },

      {
        value: null,
        component: () => (
          <TextInput
            placeholder={"Select Priority"}
            value={`${row.priority}`}
            keyboardType={"numeric"}
            onChangeText={(num) => {
              validate(num, row, index);
              // setData(
              //   data.map((r) => (r === row ? { ...r, priority: num } : r))
              // );
            }}
            style={styles.textInputStyle}
          ></TextInput>
        ),
      },
      {
        value: null,
        component: () => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
              flexDirection: "row",
            }}
          >
            {data.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  if (data.length > 1) {
                    setData([...data.filter((item, ind) => ind !== index)]);
                  } else {
                    setData(rowData);
                  }
                }}
              >
                <Icon
                  name="remove"
                  fill="#808080"
                  style={{ width: 35, height: 35 }}
                ></Icon>
              </TouchableOpacity>
            ) : (
              <></>
            )}
            {row.isPriority ? (
              <TouchableOpacity
                onPress={
                  () =>
                    alert(
                      "Sorry, the priority is already assigned to this area by another facility"
                    )
                  // addError(
                  //   "Sorry, the priority is already assigned by another facility to this area",
                  //   3000
                  // )
                }
              >
                <Icon
                  name="info"
                  fill={"red"}
                  style={{
                    width: 35,
                    height: 25,
                  }}
                ></Icon>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        ),
      },
    ];
  };
  return (
    <View style={{ flex: 1 }}>
      {label ? <Text style={{ padding: 2 }}>{label}</Text> : <></>}
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={[
          {
            borderWidth: 1,
            borderColor: "#E8E9EC",
            padding: 10,
            flexDirection: "row",
          },
        ]}
      >
        {selected.length > 0 ? (
          selected.map((element) => {
            return (
              <View
                key={Math.random()}
                style={{
                  borderRadius: 20,
                  backgroundColor: "#DBDBDB",
                  marginRight: 3,
                }}
              >
                <Text style={{ padding: 5 }}>
                  {element.priority + " - " + element.area.name}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={[styles.placeholder]}>{placeholder}</Text>
        )}
        {/* <Text style={[styles.placeholder]}>{placeholder}</Text> */}
      </TouchableOpacity>
      <AddModal
        showModal={modalVisible}
        onSelection={() => {
          closeModal();
        }}
        modalViewStyle={{
          padding: 5,
          height: "100%",
        }}
        add={
          <View
            style={[
              Styles.tableContainer,
              {
                maxWidth:
                  window.width >= 960
                    ? window.width / 3
                    : window.width >= 641 && window.width <= 960
                    ? window.width / 2
                    : window.width <= 641 && window.width >= 500
                    ? window.width / 1.5
                    : window.width <= 500 && window.width >= 360
                    ? window.width - 20
                    : window.width - 10,
                minWidth:
                  window.width >= 960
                    ? window.width / 3
                    : window.width >= 641 && window.width <= 960
                    ? window.width / 2
                    : window.width <= 641 && window.width >= 500
                    ? window.width / 1.5
                    : window.width <= 500 && window.width >= 360
                    ? window.width - 20
                    : window.width - 10,
                flexDirection: "column",
                borderRadius: 6,
                backgroundColor: "#fefefe",
                padding: 5,
              },
            ]}
          >
            <DataTable
              headers={[
                { value: "Area", minWidth: 200 },
                { value: "Priority", minWidth: 200 },
                { value: "Action", minWidth: 200 },
              ]}
              data={data}
              extractionLogic={extractionLogic}
              headerStyle={[Styles.headerStyle]}
              cellStyle={[Styles.cellStyle]}
              rowStyle={[Styles.rowStyle]}
              width={
                window.width >= 960
                  ? window.width / 3 - 10
                  : window.width >= 641 && window.width <= 960
                  ? window.width / 2 - 10
                  : window.width <= 641 && window.width >= 500
                  ? window.width / 1.5 - 10
                  : window.width <= 500 && window.width >= 360
                  ? window.width - 30
                  : window.width - 20
              }
            ></DataTable>
            <View
              style={{
                alignItems: "flex-end",
                paddingTop: 5,
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgb(67, 66, 93)",
                  borderColor: "#000000",
                  borderRadius: 200 / 2,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setData([
                      ...data,
                      {
                        _id: null,
                        area: null,
                        priority: data.length + 1,
                        isPriority: false,
                      },
                    ]);
                  }}
                >
                  <Icon name="plus" fill="#fff"></Icon>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: "10%",
                }}
              >
                <Button
                  // style={styles.ButtonStyle}
                  textStyle={{ flexDirection: "row", fontSize: 12 }}
                  title={"Save"}
                  pressFunc={() => selectItem()}
                ></Button>
              </View>
            </View>
          </View>
        }
      ></AddModal>
    </View>
  );
};
const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 16,
    height: 44,
    minWidth: "95%",
    textAlign: "left",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalView: {
    width: "100%",
    maxWidth: 400,
    maxHeight: 400,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
    bottom: 0,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    margin: 1,
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#E8E9EC",
    padding: 10,
    alignSelf: "stretch",
    backgroundColor: "#fff",
  },
  ButtonStyle: {
    maxWidth: "10%",
    marginRight: 10,
  },
});
const mapStateToProps = ({ selectedBusiness, facility }) => ({
  selectedBusiness,
  facility,
});
export default connect(mapStateToProps, { addError, addBeatAction })(BeatModal);
