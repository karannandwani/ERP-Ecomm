import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  useWindowDimensions,
  Keyboard,
  ScrollView,
} from "react-native";

import Modal from "../modal/modal";
import { Styles } from "../../../globalStyle";
import Icon from "../icon";
import Button from "../buttom/button";
import { add } from "react-native-reanimated";
import Footer from "../footer";
import AddModal from "../../addModal/addModal";
import Checkbox from "../checkBox/checkbox";
import { DimensionContext } from "../../dimensionContext";
import InputTextAreaWithBorder from "../../textArea/textArea";
const Item = ({ item, selected, selectItem }) => (
  <TouchableOpacity
    style={{ flexDirection: "row", justifyContent: "space-between" }}
    onPress={() => {
      selectItem(item);
    }}
  >
    <View>
      <Text style={{ margin: 3 }}>{item.name}</Text>
    </View>
    <View style={{ paddingBottom: 2 }}>
      <View>
        <Checkbox
          disable={selected}
          value={selected.findIndex((x) => x._id === item._id) !== -1}
        ></Checkbox>
      </View>
    </View>
  </TouchableOpacity>
);

export default function AutoCompleteModal({
  // showAutoCompleteModal,
  onSelection,
  modalViewStyle,
  name,
  displayField,
  textInputStyle,
  searchApi,
  renderData,
  addParentData,
  addComponent,
  toggleAddModal,
  data,
  isSubmitButtom,
  onRequestClose,
  multiSelect,
  selectionValue,
  label,
  styleSingleSelect,
  validate,
  value,
  inValidText,
  viewLabel,
}) {
  const [renderList, setRenderList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAutoCompleteModal, setShowAutoCompleteModal] = useState(false);
  const [result, setResult] = useState("");
  const [selected, setSelected] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const { window } = useContext(DimensionContext);
  const [valid, setValid] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setResult(data ? data.data[data.displayField] : "");
  }, [data]);
  const size = useWindowDimensions();

  useEffect(() => {
    // setResult("");
    setRenderList(renderData);
  }, [renderData]);

  useEffect(() => {
    if (validate) {
      checkValidation(value);
    }
  }, [validate, value]);

  const checkValidation = (value) => {
    if (value) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const handleCallback = (data) => {
    setModalVisible(data);
  };

  useEffect(() => {
    // onSelection(false);
    setModalVisible(false);
  }, [onRequestClose]);

  const selectItem = (item) => {
    onSelection(item);
    setResult(displayField ? item[displayField] : item.name);
    setShowAutoCompleteModal(false);
    setSearch("");
  };

  const passData = (data) => {
    selectItem(data);
    checkValidation(data);
  };

  const closeModal = () => {
    // onSelection(false);
    setShowAutoCompleteModal(false);
    // setResult("");
    setSearch("");
  };

  const addData = () => {
    addParentData(true);
    // closeModal();
    // setModalDisplay(false);
  };
  const searchApiFunc = (phrase) => {
    searchApi ? searchApi(phrase) : "";
  };
  useEffect(() => {
    if (toggleAddModal) {
      closeModal();
    }
  }, []);
  useEffect(() => {
    if (selectionValue) {
      setSelected(selectionValue);
    }
  }, [selectionValue]);

  const selectedItem = (newElement) => {
    let index = selected.findIndex((x) => x._id === newElement._id);
    if (index == -1) {
      setSelected([...selected, newElement]);
    } else {
      setSelected(selected.filter((x) => x._id !== newElement._id));
    }
  };
  const save = () => {
    setSelected([...selected]);
    onSelection(selected);
  };
  return (
    <View style={{ flex: 1 }}>
      {multiSelect ? (
        viewLabel ? (
          <View>
            <TouchableOpacity onPress={() => setShowAutoCompleteModal(true)}>
              {viewLabel}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {label ? <Text style={{ padding: 2 }}>{label}</Text> : <></>}
            <TouchableOpacity
              onPress={() => {
                setShowAutoCompleteModal(true);
              }}
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                flex: 1,
                maxHeight: 38,
                minHeight: 38,
                borderWidth: 1,
                borderColor: "#E8E9EC",
                padding: 10,
              }}
            >
              {selected.length > 0 ? (
                selected?.map((element) => {
                  return (
                    <Text key={element._id}>{element.name + "" + ","}</Text>
                  );
                })
              ) : name ? (
                <Text style={{ color: "#747476" }}> {name} </Text>
              ) : (
                <Text style={{ color: "#747476" }}> "Select" </Text>
              )}
            </TouchableOpacity>
          </View>
        )
      ) : (
        <View style={{ flex: 1 }}>
          {label ? <Text style={{ padding: 2 }}>{label}</Text> : <></>}
          <TextInput
            value={result || ""}
            style={[styles.textInputStyle, textInputStyle]}
            placeholder={name ? name : "Select"}
            onFocus={(text) => {
              setShowAutoCompleteModal(true);
            }}
            showSoftInputOnFocus={false}
          ></TextInput>
          {!valid && inValidText ? (
            <Text style={styles.error}>{inValidText}</Text>
          ) : (
            <></>
          )}
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        presentationStyle="overFullScreen"
        visible={showAutoCompleteModal}
        onRequestClose={() => {
          closeModal();
        }}
        ariaHideApp={false}
      >
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  maxWidth:
                    window.width >= 960
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
                  paddingBottom: window.width >= 360 ? 20 : 10,
                  paddingLeft: window.width >= 360 ? 40 : 10,
                  paddingRight: window.width >= 360 ? 40 : 10,
                  borderRadius: 6,
                  backgroundColor: "#fefefe",
                }}
                onPress={() => setSearch(true)}
              >
                <View style={Styles.headerContainer}>
                  <Text style={Styles.h1}>Select {name}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.searchBarStyle,
                    { paddingLeft: 5, marginTop: 20 },
                  ]}
                  // onPress={() => setSearch(true)}
                >
                  <View style={{ alignSelf: "center" }}>
                    <Icon
                      name="search"
                      style={{ height: 20, width: 20, marginTop: 5 }}
                    ></Icon>
                  </View>
                  <TextInput
                    style={{ flex: 1, paddingLeft: 10 }}
                    // autoFocus={true}
                    placeholder="Search"
                    value={`${search}`}
                    onChangeText={
                      (phrase) => {
                        setSearch(phrase);
                        searchApiFunc(phrase);
                      }
                      // searchApi ? searchApi(phrase) : ""
                    }
                  ></TextInput>
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: "#fff",
                    maxHeight: 0.5 * size.height,
                  }}
                >
                  {multiSelect ? (
                    <View>
                      <View style={{ margin: 5, flexDirection: "row" }}>
                        <Text>{selected.map((x) => x.name).join(", ")}</Text>
                      </View>
                      {renderList.map((item) => (
                        <View
                          key={item._id}
                          style={{
                            padding: 0,
                            margin: 5,
                            borderBottomWidth: 1,
                            borderBottomColor: "lightgray",
                          }}
                        >
                          <Item
                            key={item._id}
                            item={item}
                            selected={selected}
                            selectItem={selectedItem}
                          />
                        </View>
                      ))}
                      {/* <FlatList
                        style={{ flex: 1 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={renderList}
                        
                      /> */}
                    </View>
                  ) : (
                    <ScrollView keyboardShouldPersistTaps={"handled"}>
                      {renderList.map((item, index) => (
                        <View key={Math.random()} style={{ minHeight: 40 }}>
                          <TouchableOpacity
                            onPress={() => {
                              selectItem(item);
                              checkValidation(item);
                            }}
                            style={[styles.listStyle, { flex: 1 }]}
                            key={index}
                          >
                            <View
                              style={{
                                flexWrap: "wrap",
                                padding: 10,
                                borderBottomColor: "lightgray",
                                borderBottomWidth: 1,
                                flex: 1,
                                maxHeight: 40,
                              }}
                            >
                              <Text>
                                {displayField ? item[displayField] : item.name}
                              </Text>

                              {item.title ? <Text>{item.title}</Text> : <></>}
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>

                    // <FlatList
                    //   keyExtractor={(item, index) => index.toString()}
                    //   data={renderList}
                    //   renderItem={({ item, index }) => (
                    //     <TouchableOpacity
                    //       onPress={() => {
                    //         console.log('ccccccc')
                    //         selectItem(item);
                    //         checkValidation(item);
                    //       }}
                    //       style={[styles.listStyle, { flex: 1 }]}
                    //     >
                    //       <View
                    //         style={{
                    //           flexWrap: "wrap",
                    //           padding: 10,
                    //           borderBottomColor: "lightgray",
                    //           borderBottomWidth: 1,
                    //           width: "100%",
                    //         }}
                    //       >
                    //         <Text>
                    //           {displayField ? item[displayField] : item.name}sss
                    //         </Text>

                    //         {item.title ? <Text>{item.title}aaa</Text> : <></>}
                    //       </View>
                    //     </TouchableOpacity>
                    //   )}
                    // />
                  )}
                </View>
                <Footer
                  name={name}
                  displayItems={
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      {isSubmitButtom ? (
                        <></>
                      ) : (
                        <Button
                          title={"Add" + "  " + name}
                          style={{
                            width: "22%",
                            height: 40,
                            marginRight: 10,
                          }}
                          pressFunc={() => {
                            addData();
                            setModalVisible(true);
                          }}
                        ></Button>
                      )}
                      {multiSelect ? (
                        <Button
                          title={"Save"}
                          style={{
                            width: "22%",
                            height: 40,
                            marginRight: 10,
                          }}
                          pressFunc={() => {
                            save();
                            closeModal();
                          }}
                        ></Button>
                      ) : (
                        <></>
                      )}
                      <Button
                        style={{
                          width: "22%",
                          height: 40,
                        }}
                        title="Cancel"
                        pressFunc={() => {
                          closeModal();
                        }}
                      ></Button>
                    </View>
                  }
                ></Footer>
                <AddModal
                  showModal={modalVisible}
                  onSelection={handleCallback}
                  add={addComponent}
                ></AddModal>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    flexDirection: "row",
    maxWidth: 500,
    minWidth: "100%",
    maxHeight: 40,
    minHeight: 30,
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    margin: 2,
  },
  modalView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#DFE0E3",
    padding: 10,
  },
  centeredView: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  listStyle: {
    backgroundColor: "#fff",
    marginBottom: 3,
    flexDirection: "row",
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#E8E9EC",
    padding: 10,
    alignSelf: "stretch",
    maxHeight: 38,
    minHeight: 38,
  },
  selected: {
    borderRadius: 5,
    marginRight: 5,
    padding: 5,
    maxHeight: 35,
    justifyContent: "center",
  },
  searchBarStyle: {
    flexDirection: "row",
    maxHeight: 70,
    minHeight: 50,
    backgroundColor: "#efebeb9c",
  },
  error: {
    // position: "absolute",
    // bottom: 0,
    color: "red",
    fontSize: 12,
    margin: 1,
  },
});
