import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "../common/icon";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../dimensionContext";
import { useContext } from "react";

const Item = ({ item, onAdd, onSelection }) => {
  const selectdItem = (item) => {
    onSelection(item);
  };
  const [expanded, setExpanded] = useState(false);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 5,
          maxHeight: 70,
          minHeight: 50,
          backgroundColor: "#FFFFFF",
          justifyContent: "space-between",
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            {expanded ? (
              <Icon name="downChevron" style={{ marginTop: 15 }}></Icon>
            ) : (
              <Icon name="rightArrow" style={{ marginTop: 15 }}></Icon>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingTop: 15 }}
            onPress={() => selectdItem(item)}
          >
            <Text style={[Styles.h3]}>{item ? item.name : ""}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ marginTop: 6 }}
          onPress={() => onAdd({ parentCategory: item._id })}
        >
          <Text style={{ fontSize: 30, color: "#bcbccb" }}>+</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          marginLeft: 30,
        }}
      >
        {expanded && item.children ? (
          item.children.map((e) => (
            <Item
              key={e}
              onSelection={onSelection}
              onAdd={onAdd}
              item={e}
            ></Item>
          ))
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

const parseCategoryToTree = (categoryList, parentId = null) => {
  const roots = categoryList.filter((c) =>
    parentId
      ? c.parentCategory && c.parentCategory._id === parentId
      : !c.parentCategory
  );
  roots.forEach((root) => {
    root.children = parseCategoryToTree(categoryList, root._id);
  });
  return roots;
};

const Accordion = ({
  textInputStyle,
  items,
  onSelection,
  onAdd,
  onPress,
  onChangeText,
}) => {
  const [search, setSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  const [categoryTree, setCategoryTree] = useState([]);

  useEffect(() => {
    const tree = parseCategoryToTree(items);
    setCategoryTree(tree);
  }, [items]);
  const { window } = useContext(DimensionContext);
  return (
    <View style={{ width: "100%" }}>
      <TouchableOpacity
        style={[styles.searchBarStyle]}
        onPress={() => setSearch(true)}
      >
        <View style={{ alignSelf: "center" }}>
          <Icon
            name="search"
            style={{ height: 20, width: 20, marginTop: 5 }}
          ></Icon>
        </View>
        <TextInput
          style={{ width: "90%" }}
          placeholder="Search"
          onChangeText={onChangeText}
        ></TextInput>
      </TouchableOpacity>

      <ScrollView
        style={{
          flex: 1,
          maxHeight: window.height / 1.5,
        }}
      >
        {/* <View> */}
        {categoryTree.map((e) => {
          return (
            <Item
              key={Math.random()}
              onSelection={onSelection}
              onAdd={onAdd}
              item={e}
            ></Item>
          );
        })}
        {/* </View> */}
      </ScrollView>
    </View>
  );
};
export default Accordion;

const styles = StyleSheet.create({
  searchBarStyle: {
    flexDirection: "row",
    maxHeight: 70,
    minHeight: 50,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
});
