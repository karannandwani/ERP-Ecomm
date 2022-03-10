import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Table from "../../../components/common/table";
import moment from "moment";
import Button from "../../../components/common/buttom/button";
import PricePipe from "../../../util/pipes";

const BillDetails = ({ route, bills, navigation }) => {
  var billId = route?.params;
  const [bill, setBill] = useState([]);
  const [productsOfBill, setProductsOfBill] = useState({});
  const headerItems = ["Product Name", "Case Qty", "Product Qty", "Price"];
  let pipe = new PricePipe();
  useEffect(() => {
    let data = bills.find((x) => x._id === billId?.data);
    setBill(data?.products ? data?.products : []);
    data = Object.assign(
      {
        billDate: data
          ? moment(
              new Date(parseInt(data._id.toString().substring(0, 8), 16) * 1000)
            ).format("MMMM dd, YYYY")
          : "",
      },
      data
    );
    setProductsOfBill(data ? data : {});
  }, [billId, bills]);

  const extractionLogic = ({ row }) => {
    return [
      row?.product?.name || row?.productDetails?.name,
      row?.acpNoOfCase,
      row?.acpNoOfProduct,
      pipe.formatter.format(row.price ? row.price : 0),
    ];
  };

  const onColumnClickHandler = (dddd) => {};
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row", maxHeight: 60 }}>
        <View style={{ flexDirection: "row" }}>
          <Text>Ordered on</Text>
          <Text style={{ fontWeight: "bold", marginLeft: 5 }}>
            {productsOfBill?.billDate}
          </Text>
        </View>
        <View style={{ marginRight: 10 }}>
          <Button
            pressFunc={() =>
              navigation.navigate("bill-invoice", {
                billId: route.params.data,
              })
            }
            title={"Invoice"}
          ></Button>
        </View>
      </View>
      <View>
        <Table
          renderData={bill}
          headerItems={headerItems}
          extractionLogic={extractionLogic}
          onClickColumn={onColumnClickHandler}
          isJsx={false}
        ></Table>
      </View>
      <View
        style={{ alignItems: "flex-end", marginTop: 10, marginRight: "10%" }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>Total amount :</Text>
          <Text style={{ fontWeight: "bold", marginLeft: 5 }}>
            {productsOfBill?.subTotal
              ? pipe.formatter.format(productsOfBill?.subTotal)
              : ""}
          </Text>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = ({ bills }) => ({ bills });
export default connect(mapStateToProps, {})(BillDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
