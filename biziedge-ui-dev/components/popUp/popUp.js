import React, { useEffect, useState, Fragment } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "../common/icon";
import Modal from "../common/modal/modal";
import MultiplePopUp from "./multiplePopUp";
import { Styles } from "../../globalStyle";
export default function PopUp({
  placeholder,
  containerStyle,
  label,
  style,
  renderData,
  placeholderStyle,
  placeholderContainerStyle,
  selectedItemStyle,
  labelStyle,
  iconStyle,
  onSelection,
  selectionValue,
  readOnly,
  multiSelect,
  visible = false,
  removeOnpress,
  displayField,
  validate,
  invalidText,
  viewStyle,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [valid, setValid] = useState(true);
  const [selected, setSelected] = useState(
    selectionValue ? selectionValue : ""
  );
  const selectItem = (item) => {
    setSelected(item);
    onSelection(item);
    setModalVisible(false);
  };

  useEffect(() => {
    setModalVisible(visible ? true : false);
  }, [visible]);

  useEffect(() => {
    setSelected(selectionValue);
  }, [selectionValue]);

  useEffect(() => {
    if (validate) {
      checkValidation(selectionValue);
    }
  }, [!validate, selectionValue]);

  const checkValidation = (selectionValue) => {
    if (selectionValue) {
      setValid(true);
    } else {
      setValid(false);
    }
  };
  return (
    <Fragment>
      {multiSelect ? (
        <MultiplePopUp
          placeholder={placeholder}
          label={label}
          style={style}
          renderData={renderData}
          placeholderStyle={placeholderStyle}
          placeholderContainerStyle={placeholderContainerStyle}
          selectedItemStyle={selectedItemStyle}
          labelStyle={labelStyle}
          iconStyle={iconStyle}
          onSelection={onSelection}
          selectionValue={selected}
          readOnly={readOnly}
          visible={visible}
          removeOnpress={removeOnpress}
          displayField={displayField}
        ></MultiplePopUp>
      ) : (
        <View style={[containerStyle, { flex: 1 }]}>
          {label ? <Text style={{ padding: 2 }}>{label}</Text> : <></>}
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            style={[
              {
                borderWidth: 1,
                borderColor: "#E8E9EC",
                flex: 1,
              },
              style,
            ]}
          >
            {readOnly ? (
              <View
                style={[
                  {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  placeholderContainerStyle,
                ]}
              >
                <View style={{ marginRight: 20 }}>
                  {selected ? (
                    <View style={{ justifyContent: "center", paddingLeft: 5 }}>
                      <Text
                        style={[
                          styles.selected,
                          selectedItemStyle,
                          { paddingLeft: 10 },
                        ]}
                      >
                        {displayField ? displayField(selected) : selected.name}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ justifyContent: "center", paddingLeft: 5 }}>
                      <Text
                        style={[
                          styles.placeholder,
                          placeholderStyle,
                          { paddingLeft: 10 },
                        ]}
                      >
                        {placeholder}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      position: "absolute",
                      top: 15,
                      right: 0,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Icon
                      name="selectDownArrow"
                      style={[{ color: "gray" }, iconStyle]}
                    ></Icon>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={[
                  {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                  placeholderContainerStyle,
                ]}
              >
                {/* <View
                  style={{ flex: 8, justifyContent: "center", marginRight: 20 }}
                >
                  {selected ? (
                    <Text
                      style={[
                        placeholderStyle,
                        { color: "#000", alignSelf: "center" },
                        selectedItemStyle,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {displayField ? displayField(selected) : selected.name}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        placeholderStyle,
                        { color: "gray", alignSelf: "center" },
                      ]}
                    >
                      {placeholder}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flex: 2,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="selectDownArrow"
                    style={[
                      {
                        color: "gray",
                        alignSelf: "center",
                        paddingLeft: 10,
                        marginTop: 15,
                        marginRight: 5,
                      },
                      iconStyle,
                    ]}
                  ></Icon>
                </View> */}
                <View
                  style={{
                    minWidth: 120,
                    justifyContent: "center",
                    maxWidth: 150,
                  }}
                >
                  {selected ? (
                    <Text
                      style={[
                        placeholderStyle,
                        {
                          color: "#000",
                          alignSelf: "flex-start",
                          marginLeft: 10,
                        },
                        selectedItemStyle,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {displayField ? displayField(selected) : selected.name}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        placeholderStyle,
                        {
                          color: "gray",
                          alignSelf: "flex-start",
                          marginLeft: 12,
                        },
                      ]}
                    >
                      {placeholder}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="selectDownArrow"
                    style={[
                      {
                        color: "gray",
                        alignSelf: "center",
                        paddingLeft: 10,
                        marginTop: 15,
                        marginRight: 10,
                      },
                      iconStyle,
                    ]}
                  ></Icon>
                </View>
              </View>
              // <View
              //   style={[
              //     {
              //       flexDirection: "row",
              //       justifyContent: "space-between",
              //       flex: 1,
              //     },
              //     placeholderContainerStyle,
              //   ]}
              // >
              //   {selected ? (
              //     <View style={{ justifyContent: "center", paddingLeft: 5 }}>
              //       <Text
              //         style={[
              //           placeholderStyle,
              //           { color: "#000" },
              //           selectedItemStyle,
              //         ]}
              //       >
              //         {displayField ? displayField(selected) : selected.name}
              //       </Text>
              //     </View>
              //   ) : (
              //     <View style={{ justifyContent: "center", paddingLeft: 5 }}>
              //       <Text style={[placeholderStyle, { color: "gray" }]}>
              //         {placeholder}
              //       </Text>
              //     </View>
              //   )}

              // </View>
            )}
          </TouchableOpacity>
          {!valid && invalidText ? (
            <Text style={styles.error}>{invalidText}</Text>
          ) : (
            <></>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            presentationStyle="overFullScreen"
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
            ariaHideApp={false}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={[styles.centeredView, viewStyle]}>
                <View style={styles.modalView}>
                  <Text
                    style={[
                      {
                        width: "80%",
                        textAlign: "center",
                        marginTop: 15,
                      },
                      Styles.h1,
                    ]}
                  >
                    {label}
                  </Text>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={renderData}
                    renderItem={({ item, index }) => {
                      return (
                        <RenderItem
                          item={item}
                          key={index}
                          index={index}
                          selectItem={selectItem}
                          displayField={displayField}
                          checkValidation={checkValidation}
                        />
                      );
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}
    </Fragment>
  );
}

const RenderItem = ({
  item,
  index,
  selectItem,
  displayField,
  checkValidation,
}) => (
  <TouchableOpacity
    key={"menu" + index}
    style={{ flex: 1 }}
    onPress={() => {
      selectItem(item);
      checkValidation(item);
    }}
  >
    <Text style={[styles.item]}>
      {displayField ? displayField(item) : item.name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 16,
    height: 44,
    borderBottomWidth: 1,
    borderColor: "#D3D3D3",
    minWidth: "95%",
    textAlign: "center",
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
    // position: "absolute",
    // bottom: 0,
    color: "red",
    fontSize: 12,
    margin: 1,
  },
});
