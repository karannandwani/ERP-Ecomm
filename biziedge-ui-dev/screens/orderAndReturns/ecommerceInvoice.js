import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import OrderInvoiceComponent from "../../components/orders/orderInvoiceComponent";
import { updateEcommerceOrder } from "../../redux/actions/ecom-order.action";
import moment from "moment";
import { DimensionContext } from "../../components/dimensionContext";
import { useContext } from "react";

const OrderInvoice = ({ route, ecommerceOrders, updateEcommerceOrder }) => {
  const { window } = useContext(DimensionContext);
  const [orderDetail, setOrderDetail] = useState(null);
  const PasswordGeneration = () => {
    updateEcommerceOrder({
      orderId: orderDetail.id,
      type: "Password",
      _id: orderDetail._id,
    });
  };

  useEffect(() => {
    if (route?.params) {
      setOrderDetail({
        ...ecommerceOrders.find((x) => x._id === route.params.itemId),
      });
    }
  }, [ecommerceOrders]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 40 }}
      style={styles.container}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 0.5,
          marginHorizontal: 10,
        }}
      >
        <View>
          <Text style={{ fontSize: 18 }}>{orderDetail?.suppliers?.name}</Text>
          <Text style={{ fontSize: 14 }}>
            {orderDetail?.suppliers?.address}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 18 }}>Invoice:#</Text>
          <Text style={{ fontSize: 18 }}>{orderDetail?.orderNo}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 0.5,
        }}
      >
        <View
          style={{
            padding: 10,
            height:
              Platform.OS === "android" || Platform.OS === "ios"
                ? window.height / 4
                : window.height / 3,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Invoice to</Text>
          <Text style={{ fontSize: 16 }}>{orderDetail?.address?.name}</Text>
          <Text style={{ fontSize: 14 }}>{orderDetail?.address.email}</Text>
          <Text style={{ fontSize: 14 }}>
            {orderDetail?.address.phone}{" "}
            {orderDetail?.address.alternativePhone
              ? `, ${orderDetail?.address.alternativePhone}`
              : ""}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {orderDetail?.address.street1} {", " + orderDetail?.address.street2}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {orderDetail?.address.city} {", " + orderDetail?.address.pincode}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {orderDetail?.address.state} {", " + orderDetail?.address.country}
          </Text>
        </View>
        <View>
          <View style={{ flexDirection: "column", marginRight: 10 }}>
            <Text style={{ fontSize: 18 }}>Order Date:</Text>
            <Text style={{ fontSize: 18 }}>
              {moment(
                new Date(
                  parseInt(orderDetail?._id.toString().substring(0, 8), 16) *
                    1000
                )
              ).format("DD/MM/YYYY")}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 4,
          marginTop:
            Platform.OS === "android" || Platform.OS === "ios"
              ? 0
              : window.height / 5,
        }}
      >
        <OrderInvoiceComponent
          data={orderDetail}
          pressFunc={PasswordGeneration}
          password={orderDetail?.password}
          ecomOrder={true}
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
const mapStateToProps = ({ ecommerceOrders }) => ({
  ecommerceOrders,
});
export default connect(mapStateToProps, { updateEcommerceOrder })(OrderInvoice);
