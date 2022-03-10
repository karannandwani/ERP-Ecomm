import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const CustomHeader = ({ value }) => {
  return (
    <View
      style={{
        color: "#fff",
        backgroundColor: "rgb(67, 66, 93)",
        borderBottomWidth: 1,
        padding: 10,
        flexDirection: "row",
        height: "100%",
      }}
    >
      <View
        style={{
          flex: 5,
          flexDirection: "column",
        //   borderEndColor: "#87CEEB",
          borderEndWidth: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Text
            style={{ flex: 3, alignItems: "center", padding: 5, color: "#fff" }}
          >
            Lot Date
          </Text>
          <Text
            style={{ flex: 3, alignItems: "center", padding: 5, color: "#fff" }}
          >
            Avail Case Qty.
          </Text>
          <Text
            style={{ flex: 3, alignItems: "center", padding: 5, color: "#fff" }}
          >
            Avail Product Qty.
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 5,
          flexDirection: "column",
          borderStartColor: "#fff",
          borderStartWidth: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            borderBottomColor: "#fff",
            borderBottomWidth: 1,
            width: "100%",
          }}
        >
          <Text style={{            color: "#fff", }}>Missing </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              flex: 2,
              borderEndWidth: 1,
              borderEndColor: "#fff",
              alignItems: "center",
              padding: 5,
              color: "#fff",
            }}
          >
            Case Qty.
          </Text>
          <Text
            style={{
              flex: 2,
              borderEndWidth: 1,
              borderEndColor: "#fff",
              alignItems: "center",
              padding: 5,            color: "#fff",
            }}
          >
            Product Qty.
          </Text>
          <Text
            style={{
              flex: 4,
              borderEndWidth: 1,
              borderEndColor: "#fff",
              alignItems: "center",
              padding: 5,            color: "#fff",
            }}
          >
            Reason
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
