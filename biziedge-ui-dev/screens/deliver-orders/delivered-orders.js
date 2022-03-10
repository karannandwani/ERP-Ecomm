import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Linking,
} from "react-native";
import { connect } from "react-redux";
import { Styles } from "../../globalStyle";
import Icon from "../../components/common/icon";
import { DimensionContext } from "../../components/dimensionContext";

const DeliveredOrders = ({ driverDeliveredOrders }) => {
  const { window } = useContext(DimensionContext);

  return (
    <View style={[Styles.container]}>
      <View
        style={{
          width:
            window.width >= 1040
              ? window.width / 3
              : window.width >= 960 && window.width < 1040
              ? window.width / 3
              : window.width >= 641 && window.width < 960
              ? window.width / 2.5
              : window.width >= 500 && window.width < 641
              ? window.width / 2
              : window.width >= 400 && window.width < 500
              ? window.width / 1.5
              : window.width - 20,
          paddingTop: 20,
        }}
      >
        <View>
          <TouchableOpacity style={[styles.searchBarStyle]}>
            <View style={{ alignSelf: "center" }}>
              <Icon
                name="search"
                style={{ height: 20, width: 20, marginTop: 5 }}
              ></Icon>
            </View>
            <TextInput
              style={{ flex: 1, paddingLeft: 10 }}
              placeholder="Search"
              onChangeText={() => onChangeText()}
            ></TextInput>
          </TouchableOpacity>

          <View>
            <FlatList
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5, maxHeight: window.height / 1.5 }}
              keyExtractor={(item, index) => index.toString()}
              data={driverDeliveredOrders}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.listStyle,
                    {
                      backgroundColor: "#fff",
                    },
                  ]}
                >
                  <View style={{ flexWrap: "wrap", padding: 10 }}>
                    <Text style={[Styles.h2]}>ORDER #{item.orderNo}</Text>
                    <Text>Customer:</Text>
                    <Text>{item.address.name}</Text>
                    <Text>{item.address.email}</Text>
                    <Text>{item.address.phone}</Text>
                    <Text>{item.address.alternativePhone}</Text>
                    <Text style={{ fontSize: 14 }}>
                      {item.address.street1} {", " + item.address.street2}
                    </Text>
                    <Text style={{ fontSize: 14 }}>
                      {item.address.city} {", " + item.address.pincode}
                    </Text>
                    <Text style={{ fontSize: 14 }}>
                      {item.address.state} {", " + item.address.country}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarStyle: {
    flexDirection: "row",
    maxHeight: 70,
    minHeight: 50,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  listStyle: {
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const mapStateToProps = ({ driverDeliveredOrders }) => ({
  driverDeliveredOrders,
});

export default connect(mapStateToProps, {})(DeliveredOrders);
