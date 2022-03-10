import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Touchable,
} from "react-native";
import Icon from "../../components/common/icon";
import Button from "../../components/common/button/button";
import { connect } from "react-redux";
const OrderTracking = ({ navigation, orders, route }) => {
  const [currentOrder, setCurrentOrder] = useState(null);

  // useEffect(() => {
  //   setCurrentOrder(orders.find((x) => x._id === route.params.orderId));
  // });
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          margin: 10,
          maxHeight: 30,
        }}
      >
        <TouchableOpacity>
          <Icon name="back"></Icon>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#FA4248" }}>
          Tracking Order
        </Text>
        <TouchableOpacity>
          <Icon name="search"></Icon>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 20 }}>
          Order No #{currentOrder?.orderNo}
        </Text>
      </View>
      <View
        style={{
          flex: 7,
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 20,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text>25/7/21 </Text>
            <Text>10 AM </Text>
          </View>
          <View>
            <Text>25/7/21 </Text>
            <Text>10 AM </Text>
          </View>
          <View>
            <Text>25/7/21 </Text>
            <Text>10 AM </Text>
          </View>
          <View>
            <Text>25/7/21 </Text>
            <Text>10 AM </Text>
          </View>
          <View>
            <Text>25/7/21 </Text>
            <Text>10 AM </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.outerCircleStyle}>
            <View
              style={{
                maxWidth: 18,
                minWidth: 18,
                minHeight: 18,
                maxHeight: 18,
                borderRadius: 10,
                borderColor: "#D6D2D2",
                borderWidth: 1,
                backgroundColor: "#FA4248",
                alignSelf: "center",
              }}
            ></View>
          </View>
          <View
            style={{
              flex: 1,
              borderColor: "#D6D2D2",
              borderLeftWidth: 1,
              borderLeftColor: "#FA4248",
              // marginLeft: 15,
              // backgroundColor:"red"
            }}
          ></View>
          <View style={styles.outerCircleStyle}>
            <View
              style={{
                maxWidth: 18,
                minWidth: 18,
                minHeight: 18,
                maxHeight: 18,
                borderRadius: 10,
                borderColor: "#D6D2D2",
                borderWidth: 1,
                backgroundColor: "#FA4248",
                alignSelf: "center",
              }}
            ></View>
          </View>
          <View
            style={{
              flex: 1,
              borderColor: "#D6D2D2",
              borderLeftWidth: 1,
              borderLeftColor: "#FA4248",
              // marginLeft: 15,
              // backgroundColor:"red"
            }}
          ></View>
          <View style={styles.outerCircleStyle}>
            <View
              style={{
                maxWidth: 18,
                minWidth: 18,
                minHeight: 18,
                maxHeight: 18,
                borderRadius: 10,
                borderColor: "#D6D2D2",
                borderWidth: 1,
                backgroundColor: "#FA4248",
                alignSelf: "center",
              }}
            ></View>
          </View>
          <View
            style={{
              flex: 1,
              borderColor: "#D6D2D2",
              borderLeftWidth: 1,
              borderLeftColor: "#FA4248",
              // marginLeft: 15,
              // backgroundColor:"red"
            }}
          ></View>
          <View style={styles.outerCircleStyle}>
            <View
              style={{
                maxWidth: 18,
                minWidth: 18,
                minHeight: 18,
                maxHeight: 18,
                borderRadius: 10,
                borderColor: "#D6D2D2",
                borderWidth: 1,
                backgroundColor: "#FA4248",
                alignSelf: "center",
              }}
            ></View>
          </View>
          <View
            style={{
              flex: 1,
              borderColor: "#D6D2D2",
              borderLeftWidth: 1,
              borderLeftColor: "#FA4248",
              // marginLeft: 15,
              // backgroundColor:"red"
            }}
          ></View>
          <View style={styles.outerCircleStyle}>
            <View
              style={{
                maxWidth: 18,
                minWidth: 18,
                minHeight: 18,
                maxHeight: 18,
                borderRadius: 10,
                borderColor: "#D6D2D2",
                borderWidth: 1,
                backgroundColor: "#FA4248",
                alignSelf: "center",
              }}
            ></View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 3,
          }}
        >
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ fontWeight: "bold" }}>Generated</Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ fontWeight: "bold" }}>Accepted/Rejected</Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ fontWeight: "bold" }}>Vehicle Assigned</Text>
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ fontWeight: "bold" }}>Dispatched</Text>
          </View>

          <View style={{ alignSelf: "flex-start", marginBottom: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Delivered</Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Button
          pressFunc={() =>
            navigation.navigate("Home", { screen: "homeScreen" })
          }
          style={{
            marginRight: 10,
            borderColor: "#FA4248",
            maxHeight: 50,
            minHeight: 50,
            minWidth: "90%",
            backgroundColor: "#FA4248",
            marginBottom: 20,
          }}
          textStyle={{ color: "#fff" }}
          title="Continue Shopping"
        ></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  outerCircleStyle: {
    flex: 1,
    maxWidth: 28,
    minWidth: 28,
    minHeight: 28,
    maxHeight: 28,
    borderRadius: 15,
    borderColor: "#D6D2D2",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});

const mapStateToProps = ({ orders }) => ({ orders });

export default connect(mapStateToProps)(OrderTracking);
