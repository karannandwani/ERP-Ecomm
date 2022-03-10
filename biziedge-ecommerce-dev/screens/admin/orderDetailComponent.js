import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
const orderDetailsComponent = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 4, justifyContent: "center" }}>
        <Image
          style={styles.imageStyle}
          source={require("../../assets/perfume.jpeg")}
        ></Image>
      </View>
      <View style={{ flex: 6, flexDirection: "column" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 15, marginTop: 25 }}>SL Perfume</Text>
          <Text
            style={{
              fontSize: 10,
              marginTop: 30,
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
              marginRight: 10,
              marginBottom: 25,
            }}
          >
            +1
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 17,
              color: "#FA4248",
              alignSelf: "flex-end",
              marginTop: 35,
              marginRight: 15,
            }}
          >
            $999
          </Text>
        </View>
      </View>
    </View>
  );
};

export default orderDetailsComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 150,
    minHeight: 150,
    borderRadius: 40,
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  imageStyle: {
    maxHeight: 110,
    maxWidth: 110,
    minHeight: 110,
    minWidth: 110,
    borderRadius: 20,
    marginLeft: 23,
    marginTop: 20,
  },
});
