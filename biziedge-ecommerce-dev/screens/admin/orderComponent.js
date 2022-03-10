import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "../../components/common/icon";

const orderComponent = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ marginLeft: 40, marginTop: 13 }}>Order #124-234</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 17,
              color: "#FA4248",
              alignSelf: "flex-end",
              marginRight: 27,
              marginTop: 10,
            }}
          >
            $455
          </Text>
          <Text
            style={{
              fontSize: 10,
              alignSelf: "flex-end",
              marginRight: 10,
              color: "#888888",
            }}
          >
            Pay on Delivery
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 9,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 4 }}>
          <Image
            style={styles.imageStyle}
            source={require("../../assets/perfume.jpeg")}
          ></Image>
        </View>
        <View style={{ flex: 6, marginTop: 10 }}>
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 15, marginTop: 7 }}>SL Perfume</Text>
            <Text
              style={{
                fontSize: 10,
                marginTop: 9,
                marginRight: 70,
                color: "#696969",
              }}
            >
              100g
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                alignSelf: "flex-end",
                marginRight: 5,
              }}
            >
              +1
            </Text>
          </View>
          <View style={{ flex: 6, flexDirection: "column", marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Icon name="home" width="12" height="12" fill="#000"></Icon>
              <Text style={{ fontSize: 10, marginLeft: 7, color: "#696969" }}>
                KWP , B-1 Mancheswar IE, Bhubaneswar , Odisha , 751010
              </Text>
            </View>
            <View style={{ marginTop: 10, flexDirection: "row" }}>
              <TouchableOpacity>
                <Icon name="phone" width="12" height="12" fill="#000"></Icon>
              </TouchableOpacity>
              <Text style={{ fontSize: 10, marginLeft: 13, color: "#696969" }}>
                +917008024903
              </Text>
            </View>
          </View>
          <View style={{ flex: 2 }}>
            <TouchableOpacity>
              <Text
                style={{
                  alignSelf: "flex-end",
                  textDecorationLine: "underline",
                  fontSize: 9,
                  marginRight: 17,
                  color: "#696969",
                }}
              >
                View Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default orderComponent;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    maxHeight: 170,
    minHeight: 170,
    borderRadius: 40,
    marginTop: 15,
  },
  imageStyle: {
    maxHeight: 110,
    maxWidth: 110,
    minHeight: 110,
    minWidth: 110,
    borderRadius: 20,
    marginLeft: 23,
  },
});
