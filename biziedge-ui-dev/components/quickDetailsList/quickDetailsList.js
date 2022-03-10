import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Icon from "../common/icon";


const quickDetailList = ({
  style,
  renderData,
  level,
  headerStyle,
  item,
  onNavigation,
  isAddIcon,
  xyz,
}) => {
  const selectItem = (item) => {
    onNavigation(item);
  };

  const emptyData = () => {
    return (
      <View
        style={{
          padding: 10,
          height: 40,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          No Data Available...
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.header]}>
        <Text style={headerStyle}>{level}</Text>
      </View>
      <FlatList
        style={{ padding: 10 }}
        keyExtractor={(item, index) => index.toString()}
        data={renderData}
        ListEmptyComponent={emptyData}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => selectItem(item)}
            style={{ minHeight: 50 }}
          >
            <View style={styles.details}>
              <View style={{ flexDirection: "row" }}>
                <Icon name={item?.details?.icon}></Icon>
                <View>
                  {item.product ? (
                    <Text style={styles.text}>
                      {item.product ? item.product.name : ""}
                    </Text>
                  ) : (
                    <Text style={styles.text}>{item?.name}</Text>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                {item.product && !isAddIcon ? (
                  <Text style={{ color: "red" }}>
                    {item?.product ? "expired" : ""}
                  </Text>
                ) : (
                  <Text style={styles.text}>
                    {item?.details?.count ? item.details.count : ""}
                  </Text>
                )}

                {isAddIcon ? (
                  item.toBeExpired ? (
                    <TouchableOpacity
                      onPress={() => {
                        onNavigation(item);
                      }}
                    >
                      <Icon
                        name="plus"
                        fill="#808080"
                        style={{ width: 30, height: 20, marginTop: 7 }}
                      ></Icon>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        onNavigation(item);
                      }}
                    >
                      <Icon
                        name="remove"
                        fill="#808080"
                        style={{ width: 30, height: 20, marginTop: 7 }}
                      ></Icon>
                    </TouchableOpacity>
                  )
                ) : (
                  <></>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flex: 1,
    borderBottomWidth: 1,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    borderBottomColor: "#DCDCDC",
    padding: 10,
    alignItems: "center",
    minHeight: 50,
    maxHeight: 50,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#F1F1F3",
    borderBottomWidth: 1,
    padding: 10,
  },
  icon: {
    // height: 40,
    // width: 40,
    // borderRadius: 20,
  },
  text: {
    color: "#000",
  },
});
export default quickDetailList;
