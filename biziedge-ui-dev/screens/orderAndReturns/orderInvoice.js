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
import OrderInvoiceComponent from "../../components/orders/orderInvoiceComponent";
import { generatePassword } from "../../redux/actions/order.action";
import moment from "moment";

const OrderInvoice = ({ route, order, generatePassword }) => {
  var orderDetail = route?.params
    ? order.find((x) => x._id === route.params.itemId)
    : null;
  const PasswordGeneration = () => {
    generatePassword(orderDetail.id);
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {orderDetail?.suppliers?.name}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Invoice:#</Text>
          <Text style={{ fontSize: 16 }}>{orderDetail?.orderNo}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
      >
        <Text style={{ fontSize: 14 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>ph-</Text>
          {orderDetail?.suppliers?.phone}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Order Date:</Text>
          <Text style={{ fontSize: 16 }}>
            {moment(
              new Date(
                parseInt(orderDetail?._id.toString().substring(0, 8), 16) * 1000
              )
            ).format("DD/MM/YYYY")}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Invoice to </Text>
          <Text style={{ fontSize: 16 }}>
            {" " + orderDetail?.facility?.name}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {" " + orderDetail?.facility?.address}
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>OrderId:</Text>
          <Text style={{ fontSize: 16 }}>#{orderDetail?.orderNo}</Text>
        </View>
      </View> */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {orderDetail?.suppliers?.name}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>ph-</Text>
              {orderDetail?.suppliers?.phone}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Invoice to{" "}
            </Text>
            <Text style={{ fontSize: 14 }}>
              {" " + orderDetail?.facility?.name}
            </Text>
            <Text style={{ fontSize: 14 }}>
              {" " + orderDetail?.facility?.address}
            </Text>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Order Date:
            </Text>
            <Text style={{ fontSize: 16 }}>
              {moment(
                new Date(
                  parseInt(orderDetail?._id.toString().substring(0, 8), 16) *
                    1000
                )
              ).format("DD/MM/YYYY")}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>OrderId:</Text>
            <Text style={{ fontSize: 16 }}>#{orderDetail?.orderNo}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Invoice:#</Text>
            <Text style={{ fontSize: 16 }}>{orderDetail?.orderNo}</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 4, marginTop: 10 }}>
        <OrderInvoiceComponent
          data={orderDetail}
          pressFunc={PasswordGeneration}
          password={orderDetail?.password}
        ></OrderInvoiceComponent>
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
const mapStateToProps = ({ order, ecommerceOrders }) => ({
  order,
  ecommerceOrders,
});
export default connect(mapStateToProps, { generatePassword })(OrderInvoice);
