import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { DataTable } from "../../components/dataTable/dataTable";
import moment from "moment";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";

const ExpiredProductDetails = ({ route, expiredProduct }) => {
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const [expiredItem, setItem] = useState([]);
  const { window } = useContext(DimensionContext);

  const headerItems = [
    { value: "Date", minWidth: 100 },
    { value: "Case Qty", minWidth: 100 },
    { value: "Product Qty", minWidth: 100 },
    { value: "Cost Price", minWidth: 100 },
    { value: "Retail Price", minWidth: 100 },
    { value: "Expiry Date", minWidth: 100 },
  ];

  useEffect(() => {
    if (route.params?.productId) {
      let expiredItem = expiredProduct.find(
        (i) => i._id == route.params?.productId
      );
      setItem(expiredItem?.products);
    }
  }, [route]);

  const onColumnClickHandler = (data) => {};

  const extractionLogic = ({ row }) => {
    if (row) {
      return [
        moment(
          new Date(parseInt(row._id.toString().substring(0, 8), 16) * 1000)
        ).format("DD/MM/YYYY"),
        row?.noOfCase,
        row?.noOfProduct,
        row?.costPrice,
        row?.retailPrice,
        moment(new Date(row?.expiryDate)).format("DD/MM/YYYY"),
      ];
    } else {
      return [];
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View
        style={{
          flex: 1,
          minWidth:
            window.width > 1040 ? window.width - (320 + 20) : window.width - 20,
          height: window.height - 128,
          maxWidth:
            window.width > 1040 ? window.width - (320 + 20) : window.width - 20,
        }}
      >
        <DataTable
          data={expiredItem}
          extractionLogic={extractionLogic}
          onClickColumn={onColumnClickHandler}
          headerStyle={[Styles.headerStyle]}
          cellStyle={[Styles.cellStyle]}
          rowStyle={[Styles.rowStyle]}
          headers={headerItems}
          width={
            window.width > 1040 ? window.width - (320 + 20) : window.width - 20
          }
          height={window.height - 128}
        ></DataTable>
      </View>
    </View>
  );
};
const mapStateToProps = ({ expiredProduct }) => ({
  expiredProduct,
});
export default connect(mapStateToProps, {})(ExpiredProductDetails);
