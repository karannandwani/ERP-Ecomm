import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import Icon from "./icon";

const ItemView = ({ item, index, onClickItem }) => {
  return (
    <View style={[styles.searchContainer, { marginBottom: 1 }]}>
      {item?.isHistory ? (
        <View style={[styles.vwSearch, { paddingLeft: 20 }]}>
          <TouchableOpacity
            onPress={() => remove(item)}
            style={{
              flex: 0.1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name="cross"
              name="cross"
              style={{
                marginTop: 32,
                justifyContent: "center",
                alignItems: "center",
              }}
              fill={"gray"}
            ></Icon>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      <TouchableOpacity
        style={{
          flex: 1,
          paddingTop: 10,
          paddingLeft: 10,
          flexDirection: "row",
        }}
        onPress={() => onClickItem(item, item.itemName)}
      >
        <Text>{String(item.itemName).capitalize()}</Text>
        <Text style={{ color: "gray", fontSize: 12, opacity: 0.5 }}>
          {" in " + item.type}
        </Text>
      </TouchableOpacity>
      <View>
        {item.isHistory ? (
          <TouchableOpacity
            onPress={() => {
              onClickItem(item, item.itemName);
            }}
            style={styles.vwClear}
          >
            <Icon
              name="history"
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              fill={"gray"}
            ></Icon>
          </TouchableOpacity>
        ) : (
          // <TouchableOpacity
          //   onPress={() => {
          //     onClickItem(item, query ? query : item.itemName);
          //   }}
          //   style={styles.vwClear}
          // >
          //   <Icon
          //     name="arrowRight"
          //     style={{
          //       justifyContent: "center",
          //       alignItems: "center",
          //     }}
          //     fill={"#2089dc"}
          //   ></Icon>
          // </TouchableOpacity>
          <></>
        )}
      </View>
    </View>
  );
};
const ItemSeparatorView = () => {
  return (
    <View
      style={{
        height: 0.5,
        width: "100%",
        backgroundColor: "#C8C8C8",
      }}
    />
  );
};

const SearchBar = ({
  viewStyle,
  params,
  style,
  onChangeText,
  onPressCross,
  placeholder,
  updateSearch,
  filteredDataSource,
  onFocus,
  value,
  remove,
  onClickItem,
}) => {
  const [query, setQuery] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const ListEmptyView = () => {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ textAlign: "center" }}>
          Sorry, No Data Present... Try Again.
        </Text>
      </View>
    );
  };

  // const getItem = (item) => {};

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.mainContainer]}>
        <View style={styles.searchContainer}>
          {/* <View style={styles.vwSearch}>
            <Icon name="search"></Icon>
          </View> */}
          <TextInput
            value={query || ""}
            placeholder="Search"
            style={styles.textInput}
            onChangeText={(text) => {
              // var letters = /^$|^[a-zA-Z._\b ]+$/;
              // if (text.match(letters)) {
              setQuery(text);
              updateSearch(text);
              // } else {
              //   addError("Please only enter alphabets");
              // }
            }}
            onFocus={onFocus}
          />
          {query ? (
            <TouchableOpacity
              onPress={() => onClickItem({}, query)}
              style={{
                flex: 0.1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                name="search"
                style={{
                  justifyContent: "center",
                }}
                fill={"gray"}
              ></Icon>
            </TouchableOpacity>
          ) : (
            <View style={styles.vwClear} />
          )}
        </View>
        {error && <Text style={styles.txtError}>{error}</Text>}
      </View>
      <View style={{ marginTop: 10, zIndex: 999, paddingTop: 10 }}>
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ItemView
              item={item}
              index={index}
              onClickItem={onClickItem}
            ></ItemView>
          )}
          ListEmptyComponent={ListEmptyView}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  txtError: {
    marginTop: "2%",
    width: "89%",
    color: "white",
  },
  vwClear: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 17,
  },
  textInput: {
    flex: 1,
    paddingLeft: 15,
    color: "#000",
    borderColor: "#fff",
    borderWidth: 1,
  },

  vwSearch: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    backgroundColor: "#fff",
    color: "#fff",
    height: 40,
    flexDirection: "row",
  },

  mainContainer: {
    height: 58,
    backgroundColor: "#fff",
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    borderTopColor: "#fff",
    borderTopWidth: 1,
    padding: 8,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    margin: 10,
  },
});

export default SearchBar;
