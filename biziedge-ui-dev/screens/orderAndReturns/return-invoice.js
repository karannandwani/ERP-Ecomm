import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import ReturnInvoiceComponent from "../../components/orders/returnInvoiceComponent";
import { generateReturnPassword } from "../../redux/actions/return.action";
import moment from "moment";

const ReturnInvoice = ({ route, returnOrders, generateReturnPassword }) => {
  const [returnDetail, setReturnDetail] = useState(null);
  useEffect(() => {
    if (route)
      setReturnDetail({
        ...returnOrders.find((x) => x._id === route.params.itemId),
      });
  }, [route, returnOrders]);
  const PasswordGeneration = () => {
    generateReturnPassword({ _id: returnDetail._id });
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
          marginHorizontal: 10,
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {returnDetail?.facility?.name}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {"PH: "}
            {returnDetail?.suppliers?.phone}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 15 }}>Invoice:#</Text>
          <Text style={{ fontSize: 15 }}>{returnDetail?.returnNo}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 2,
          // backgroundColor: "red",
        }}
      >
        <View style={{ padding: 10, flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Invoice to{" "}
            </Text>
            <Text style={{ fontSize: 15 }}>
              {returnDetail?.suppliers?.name}
            </Text>
          </View>
          <Text style={{ fontSize: 14 }}>
            {returnDetail?.facility?.address}
          </Text>
        </View>
        <View>
          <View style={{ flexDirection: "row", flex: 1, marginRight: 5 }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{ fontWeight: "bold", fontSize: 15 }}
            >
              Request Date:
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{ fontSize: 15 }}
            >
              {moment(
                new Date(
                  parseInt(returnDetail?._id.toString().substring(0, 8), 16) *
                    1000
                )
              ).format("DD/MM/YYYY")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Return No:</Text>
            <Text style={{ fontSize: 15 }}>#{returnDetail?.returnNo}</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 4, maxHeight: 430, minHeight: 430 }}>
        <ReturnInvoiceComponent
          data={returnDetail}
          pressFunc={PasswordGeneration}
          password={returnDetail?.password}
        ></ReturnInvoiceComponent>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
});
const mapStateToProps = ({ returnOrders }) => ({
  returnOrders,
});
export default connect(mapStateToProps, { generateReturnPassword })(
  ReturnInvoice
);
