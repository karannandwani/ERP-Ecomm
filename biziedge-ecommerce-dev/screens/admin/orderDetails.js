import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "../../components/common/icon";
import OrderDetailsComponent from "./orderDetailComponent";
// import MapView from "react-native-maps";
// import { Marker } from "react-native-maps";

const OrderDetails = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, marginTop: 10 }}>
            <Icon name="back" fill="#fff"></Icon>
          </View>
          <View
            style={{
              flex: 2,
              marginTop: 11,
              marginLeft: 23,
            }}
          >
            <Text style={{ fontSize: 20, color: "#fff" }}>Orders</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 25, marginLeft: 15, color: "#fff" }}>
        Order #124-234
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 5,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            flexDirection: "column",
            flexWrap: "wrap",
            marginTop: 10,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <OrderDetailsComponent></OrderDetailsComponent>
          <OrderDetailsComponent></OrderDetailsComponent>
          <OrderDetailsComponent></OrderDetailsComponent>
          <OrderDetailsComponent></OrderDetailsComponent>

          <OrderDetailsComponent></OrderDetailsComponent>
        </View>
      </ScrollView>
      <View style={{ flex: 0.8, flexDirection: "row" }}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              flex: 3,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "#fff" }}>
              TOTAL
            </Text>
          </View>
          <View
            style={{
              flex: 7,
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                alignSelf: "flex-end",
                marginTop: 20,
                marginRight: 20,
                color: "red",
                fontWeight: "bold",
              }}
            >
              $500
            </Text>
            <Text
              style={{
                fontSize: 15,
                alignSelf: "flex-end",
                marginTop: 10,
                marginRight: 15,
                color: "#D0D0D0",
              }}
            >
              Pay on Delivery
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flex: 1.6,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: "#FBEAF1",
          top: 32,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 5.5, flexDirection: "column" }}>
          <View style={{ flex: 2.5 }}>
            <Text
              style={{
                fontSize: 17,
                color: "#000",
                fontWeight: "bold",
                marginLeft: 26,
                marginTop: 8,
              }}
            >
              Delivery Address
            </Text>
          </View>
          <View style={{ flex: 7.5, flexDirection: "row" }}>
            <View style={{ flex: 2, marginLeft: 20, marginTop: 5 }}>
              <Icon name="home" height="20" width="20"></Icon>
            </View>
            <View style={{ flex: 8, marginRight: 5 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: "#505050",
                  fontWeight: "bold",
                  marginTop: 5,
                }}
              >
                KWP,B-1 Mancheswar IE,Bhubaneswar,Odisha,751010
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 4.5 }}>
          {/* <MapView
                provider={PROVIDER_GOOGLE}
            showsUserLocation={false}
            zoomEnabled={true}
            zoomControlEnabled={true}
            initialRegion={{
              latitude: 28.57966,
              longitude: 77.32111,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{ latitude: 28.57966, longitude: 77.32111 }}
              // title={"JavaTpoint"}
              // description={"Java Training Institute"}
            />
          </MapView>{" "} */}
        </View>
      </View>
      <View
        style={{
          flex: 0.8,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: "#FA4248",
          zIndex: 1,
          elevation: 5,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            alignSelf: "center",
            fontWeight: "bold",
          }}
        >
          CALL RECEIVER AT +919778877892
        </Text>
      </View>
    </View>
  );
};

export default OrderDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#595453",
  },
});
