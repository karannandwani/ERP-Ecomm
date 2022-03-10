import React, { useEffect, useState } from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { DataTable } from "../dataTable/dataTable";
import { Styles } from "../../globalStyle";

const ProductList = ({ products, onClose }) => {
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const [value, setCheckBoxValue] = useState(true);

  const onChange = ({ window }) => {
    setWidth(window.width);
    setHeight(window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  const headerItems = [
    { value: "Product Name", minWidth: 100 },
    { value: "Status", minWidth: 100 },
    { value: "Reason", minWidth: 100 },
    { value: "Returnable", minWidth: 100 },
  ];

  const extractionLogic = ({ row }) => {
    if (row) {
      return [
        {
          value: null,
          component: () => (
            <Text>
              {row.name ? row.name : ""}
              {row["Product Name"] ? row["Product Name"] : ""}
            </Text>
          ),
        },

        {
          value: null,
          component: () => (
            <Text
              style={[row.remarks == "Failed" ? styles.danger : styles.success]}
            >
              {row.remarks ? row.remarks : "Success"}
            </Text>
          ),
        },
        {
          value: null,
          component: () => <Text>{row.reason}</Text>,
        },
        {
          value: null,
          component: () => <Text>{row.returnable ? "True" : "False"}</Text>,
        },
      ];
    } else {
      return [];
    }
  };
  const onColumnClickHandler = (data) => {};

  return (
    <View style={{ flex: 1, maxHeight: "100%", minWidth: "100%" }}>
      <Text style={{ fontSize: 22 }}>Uploaded Products</Text>

      <ScrollView>
        <View style={{ flex: 1, marginTop: 10 }}>
          <DataTable
            data={products && products.length > 0 ? products : []}
            headers={headerItems}
            extractionLogic={extractionLogic}
            onClickColumn={onColumnClickHandler}
            headerStyle={[Styles.headerStyle]}
            cellStyle={[Styles.cellStyle]}
            rowStyle={[Styles.rowStyle]}
            width={
              width < 640
                ? width
                : Math.max(width - width / 4, Math.min(320, width))
            }
          ></DataTable>
        </View>
      </ScrollView>
      {/* <View
          style={{
            justifyContent: "flex-end",
            minWidth: "50%"
          }}
        >
     <Button
        style={{
          width: "22%",
          height: 40,
        }}
        title="Cancel"
        pressFunc={() => {
          onClose(false);
        }}
      ></Button>
      </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  danger: {
    color: "red",
  },
  success: {
    color: "green",
  },
});
export default ProductList;
