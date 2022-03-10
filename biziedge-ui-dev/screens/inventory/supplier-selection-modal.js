import React, { useContext } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { DimensionContext } from "../../components/dimensionContext";
import { Styles } from "../../globalStyle";

export default function SupplierList({ supplierInfo, onSupplierSelection }) {
  const selectItem = (item) => {
    onSupplierSelection(item);
  };
  const { window } = useContext(DimensionContext);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>Select Supplier</Text>
      </View>
      <View>
        <FlatList
          style={{ marginTop: 10, flex: 1 }}
          keyExtractor={(item, index) => index.toString()}
          data={supplierInfo.supplierDetails}
          onSupplierSelection={selectItem}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => selectItem(item)}
              style={[styles.listStyle]}
            >
              <View
                style={{
                  padding: 0,
                  margin: 5,
                  // minWidth: 500,
                  maxWidth:
                    window.width > 960
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
                  borderBottomWidth: 1,
                  borderBottomColor: "lightgray",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    // fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listStyle: {
    backgroundColor: "#fff",
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
