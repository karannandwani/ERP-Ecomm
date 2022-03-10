import React, { useState, useEffect, useReducer } from "react";
import Icon from "../../components/common/icon";
import Checkbox from "../common/checkbox/Checkbox";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";

const DisplayData = ({
  renderData,
  onSelection,
  renderItem,
  hideScrollbar,
  textInputStyle,
  onChangeText,
  onSelectItem,
  values,
  selected,
}) => {
  const [selectedFilter, setSelectedFilter] = useState([]);

  useEffect(() => {
    setSelectedFilter(values);
  }, [values]);
  const selectedItem = (id) => {
    let newArray = [...selectedFilter];
    let index = selectedFilter.findIndex((x) => x == id);
    if (index >= 0) {
      let filteredArray = newArray.filter((x) => x != id);
      setSelectedFilter(filteredArray);
    } else {
      newArray.push(id);
      setSelectedFilter(newArray);
    }

    onSelectItem(id);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.textInput, textInputStyle]}>
        <View style={{ alignSelf: "center" }}>
          <Icon name="search"></Icon>
        </View>
        <TextInput
          placeholder="Search"
          // autoFocus={true}
          style={{ flex: 1 }}
          onChangeText={onChangeText}
        ></TextInput>
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={hideScrollbar}
        style={{ marginTop: 3, flex: 1 }}
        keyExtractor={(item, index) => index.toString()}
        data={renderData}
        renderItem={({ item, index }) => (
          <View style={[styles.listStyle]}>
            <View
              style={{
                flex: 1,
                // backgroundColor: "red",
                flexWrap: "wrap",
                padding: 10,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  flex: 9,
                  fontSize: 13,
                  fontWeight: "bold",
                  marginBottom: 10,
                  // backgroundColor: "red"
                }}
              >
                {item.name}
              </Text>
              <View
                style={{
                  flex: 1,
                  maxHeight: 20,
                  minHeight: 20,
                  maxWidth: 20,
                  // alignSelf: "flex-end"
                  // backgroundColor: "red"
                }}
              >
                <Checkbox
                  setValue={() => (selected ? selected(item) : <></>)}
                  // setValue={() => selectedItem(item._id)}
                  value={selectedFilter?.includes(item._id) ? true : false}
                  // value={value}
                  style={{
                    maxHeight: 20,
                    minHeight: 20,
                    maxWidth: 20,
                    minWidth: 20,
                    position: "absolute",
                  }}
                ></Checkbox>
              </View>
            </View>
            {/* </TouchableOpacity> */}
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#E2E5DE",
    // marginTop: 40
  },
  listStyle: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 1,
    // maxWidth: 300,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    flex: 1,
    flexDirection: "row",
    // maxWidth: 300,
    maxHeight: 40,
    minHeight: 40,
    backgroundColor: "#E7ECE1",
    padding: 10,
  },
});
export default DisplayData;
