import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "../common/icon";
import moment from "moment";

const productHistory = ({ style, renderData, label }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.header]}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#4D4F5C",
            padding: 10,
          }}
        >
          {label}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flexGrow: 1,
        }}
      >
        <FlatList
          style={{ padding: 10 }}
          keyExtractor={(item, index) => index.toString()}
          data={renderData}
          renderItem={({ item, index }) => (
            <View
              style={{
                flex: 1,
                flexWrap: "wrap",
                flexDirection: "row",
                borderBottomColor: "#F1F1F3",
                borderBottomWidth: 1,
                padding: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                {item?.track?.includes("received") ? (
                  <Icon name="in" fill="#98FB98"></Icon>
                ) : (
                  <Icon name="out" fill="#98FB98"></Icon>
                )}
              </View>
              <View style={{ flex: 9, flexDirection: "column" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 11 }}>
                    {item?.track?.replace(/[\r\n]/g, "")}
                  </Text>
                  <Text style={{ fontSize: 11 }}>
                    {moment(
                      new Date(
                        parseInt(item._id.toString().substring(0, 8), 16) * 1000
                      )
                    ).format("DD/MM/YYYY") + " "}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                    {"x" +
                      " " +
                      item?.noOfCase +
                      "Cases" +
                      "," +
                      " " +
                      item?.noOfProduct +
                      "pcs"}
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                    {"₹" + item.price + "/pc"}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // marginHorizontal: 10,
  },
  header: {
    borderBottomWidth: 1,
    justifyContent: "center",
    borderBottomColor: "#F1F1F3",
    backgroundColor: "#DCDCDC",
  },
  row: {
    flex: 1,
    borderBottomColor: "#F1F1F3",
    borderBottomWidth: 1,
    padding: 10,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: 'flex-start',

    // padding: 10,
  },
  icon: {
    backgroundColor: "#98FB98",

    // height: 40,
    // width: 40,
    // borderRadius: 20,
  },
});
export default productHistory;
