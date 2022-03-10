import React, { useState, useEffect, Fragment } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import Icon from "../common/icon";
import Modal from "../common/modal/modal";
import Checkbox from "../common/checkBox/checkbox";
import { Styles } from "../../globalStyle";

const Item = ({ item, selected, selectItem }) => (
  <TouchableOpacity
    style={{
      flex: 1,
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#D3D3D3",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    }}
    onPress={() => {
      selectItem(item);
    }}
  >
    <Text style={styles.item}>{item.name}</Text>
    <View style={{ paddingTop: 10 }}>
      <Checkbox
        disable={selected}
        value={selected.findIndex((x) => x._id === item._id) !== -1}
      ></Checkbox>
    </View>
  </TouchableOpacity>
);

export default function MultiplePopUp({
  placeholder,
  label,
  renderData,
  onSelection,
  selectionValue,
  visible,
  style,
  placeholderStyle,
  displayField,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [renderDatas, setRenderDatas] = useState([]);
  const selectItem = (newElement) => {
    let index = selected.findIndex((x) => x._id === newElement._id);
    if (index === -1) {
      setSelected([...selected, newElement]);
    } else {
      setSelected(selected.filter((x) => x._id !== newElement._id));
    }
  };

  useEffect(() => {
    setSelected(selectionValue ? [...selectionValue] : []);
  }, [selectionValue]);
  useEffect(() => {
    setRenderDatas(renderData ? [...renderData] : []);
  }, [renderData]);

  const toggle = () => {
    onSelection(selected);
    setModalVisible(false);
  };

  useEffect(() => {
    setModalVisible(visible ? true : false);
  }, [visible]);

  const removeSelected = (index) => {
    setSelected([...selected.filter((x, i) => i != index)]);
    onSelection([...selected.filter((x, i) => i != index)]);
  };

  return (
    <Fragment>
      <Text style={{ padding: 2 }}>{label}</Text>
      <View
        style={[
          {
            flex: 1,
            borderWidth: 1,
            borderColor: "#E8E9EC",
            minHeight: 30,
            flexDirection: "row",
            justifyContent: "space-between",
          },
          style,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={{
            flex: 1,
            paddingLeft: 0,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            zIndex: 1,
            flexWrap: "wrap",
          }}
        >
          {selected.length > 0 ? (
            selected.map((element, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 20,
                    backgroundColor: "#DBDBDB",
                    marginLeft: 5,
                    justifyContent: "space-between",
                    marginTop: 2,
                    paddingTop: 2,
                    paddingBottom: 2,
                    maxHeight: 30,
                    paddingLeft: 5,
                  }}
                >
                  <View>
                    <Text style={[styles.selected, { marginRight: 5 }]}>
                      {displayField ? eval(displayField) : element.name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 25,
                      height: 25,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      borderColor: "#000000",
                      borderRadius: 200 / 2,
                      margin: 2,
                      marginRight: 5,
                    }}
                    onPress={() => removeSelected(index)}
                  >
                    <Icon
                      fill="red"
                      name="cross"
                      style={{ marginLeft: 5, marginTop: 2, color: "#fff" }}
                    ></Icon>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text
              style={[styles.placeholder, placeholderStyle, { color: "gray" }]}
            >
              {placeholder}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={{
            justifyContent: "flex-end",

            // justifyContent: "flex-start",
            // marginRight: 5,
            // marginTop: 16,
          }}
        >
          <Icon style={{ alignSelf: "center" }} name="selectDownArrow"></Icon>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        presentationStyle="overFullScreen"
        visible={modalVisible}
        onRequestClose={() => {}}
        ariaHideApp={false}
      >
        <TouchableWithoutFeedback onPress={() => toggle()}>
          <View style={styles.centeredView}>
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
                Select &nbsp;{label}
              </Text>

              <ScrollView style={{ width: "60%" }}>
                {renderDatas.map((item) => (
                  <Item
                    key={item._id}
                    item={item}
                    selected={selected}
                    selectItem={selectItem}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Fragment>
  );
}
const styles = StyleSheet.create({
  selected: {
    color: "#000000",
    // borderRadius: 5,
    // backgroundColor: "#65ACCB",
    justifyContent: "center",
    marginLeft: 2,
  },
  item: {
    padding: 10,
    height: 44,
    marginTop: 3,
  },

  label: {
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
  placeholder: {
    marginLeft: 10,
  },
});
