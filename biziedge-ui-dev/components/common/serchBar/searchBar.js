import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { Styles } from "../../../globalStyle";
import { DimensionContext } from "../../dimensionContext";
import Icon from "../icon";

const Item = ({
  item,
  index,
  activeIndex,
  isImage,
  iconCondition,
  selectItem,
  actionIconName,
  handleAction,
  onSelection,
}) => {
  return (
    <View
      style={[
        styles.listStyle,
        {
          backgroundColor: index === activeIndex ? "gray" : "#fff",
          width: "100%",
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => selectItem(item, index)}
        style={{ flexDirection: "row" }}
      >
        {isImage ? (
          <View style={styles.imageBox}>
            <Image
              style={styles.itemImage}
              source={
                item.image.find((x) => x.featured === true)
                  ? {
                      uri: `data:${
                        item.image.find((x) => x.featured === true).mimType
                      };base64,${
                        item.image.find((x) => x.featured === true).image
                      }`,
                    }
                  : item.image[0]
                  ? {
                      uri: `data:${item.image[0].mimType};base64,${item.image[0].image}`,
                    }
                  : require("../../../assets/img.jpeg")
              }
              defaultSource={require("../../../assets/img.jpeg")}
            />
          </View>
        ) : (
          <></>
        )}
        <View style={{ flexWrap: "wrap", padding: 10 }}>
          <Text style={[Styles.h3]}>
            {item.name ? item.name : item.hsn}
            {item["Product Name"] ? item["Product Name"] : ""}
          </Text>

          {item.percentage != null ? (
            <Text>{`${item.percentage}`}</Text>
          ) : (
            <></>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 10 }}
        onPress={() => handleAction(item)}
      >
        {eval(iconCondition) ? (
          <Icon
            name={actionIconName ? actionIconName : ""}
            style={{ paddingRight: 10 }}
          ></Icon>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    </View>
  );
};

const searchBar = ({
  renderData,
  listStyle,
  onSelection,
  renderItem,
  onChangeText,
  actionIconName,
  actionIconPress,
  hideScrollbar,
  header,
  foot,
  iconCondition,
  isImage,
  isSelected,
  selected,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    setActiveIndex(renderData.findIndex((x) => x._id === selected?._id));
    return () => {
      setActiveIndex(null);
    };
  }, [selected]);
  const selectItem = (item, index) => {
    onSelection(item, index);
    setActiveIndex(index);
  };

  const handleAction = (item) => {
    if (actionIconPress) {
      actionIconPress(item);
    }
  };
  const { window } = useContext(DimensionContext);
  return (
    <View style={{ width: "100%" }}>
      <TouchableOpacity
        style={[styles.searchBarStyle]}
        // onPress={() => setSearch(true)}
      >
        <View style={{ alignSelf: "center" }}>
          <Icon
            name="search"
            style={{ height: 20, width: 20, marginTop: 5 }}
          ></Icon>
        </View>
        <TextInput
          style={{ flex: 1, padding: 7 }}
          placeholder="Search"
          onChangeText={onChangeText}
        ></TextInput>
      </TouchableOpacity>
      <View
        style={{
          height: window.height - (window.width > 720 ? 200 : 300),
        }}
        // ref={wrapperRef}
      >
        {renderItem ? (
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={hideScrollbar}
            style={{ marginTop: 5, maxHeight: window.height / 1.5 }}
            keyExtractor={(item, index) => index.toString()}
            data={renderData}
            renderItem={renderItem}
          />
        ) : (
          <FlatList
            pagingEnabled={true}
            scrollEventThrottle={0.9}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Item
                key={`key=${item._id.toString()}`}
                item={item}
                index={index}
                activeIndex={activeIndex}
                isImage={isImage}
                selectItem={selectItem}
                iconCondition={iconCondition}
                handleAction={handleAction}
                actionIconName={actionIconName}
                onSelection={onSelection}
              ></Item>
            )}
            // renderItem={renderData?.map((e, index) => {
            //   return (
            //     <Item
            //       key={`key=${e._id.toString()}`}
            //       item={e}
            //       index={index}
            //       activeIndex={activeIndex}
            //       isImage={isImage}
            //       selectItem={selectItem}
            //       iconCondition={iconCondition}
            //       handleAction={handleAction}
            //       actionIconName={actionIconName}
            //       onSelection={onSelection}
            //     ></Item>
            //   );
            // })}
            data={renderData}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
          // <ScrollView
          //   showsVerticalScrollIndicator={false}
          //   style={scrollViewStyle}
          //   contentContainerStyle={{ paddingBottom: 60 }}
          // >
          //   {renderData?.map((e, index) => {
          //     return (
          //       <Item
          //         key={`key=${e._id.toString()}`}
          //         item={e}
          //         index={index}
          //         activeIndex={activeIndex}
          //         isImage={isImage}
          //         selectItem={selectItem}
          //         iconCondition={iconCondition}
          //         handleAction={handleAction}
          //         actionIconName={actionIconName}
          //         onSelection={onSelection}
          //       ></Item>
          //     );
          //   })}
          // </ScrollView>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  searchBarStyle: {
    flexDirection: "row",
    maxHeight: 70,
    minHeight: 50,
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 3,
  },
  listStyle: {
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 30,
    minHeight: 30,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  imageBox: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    minHeight: 30,
    minWidth: 30,
    maxHeight: 30,
    maxWidth: 30,
    borderRadius: 10,
  },
});
export default searchBar;
