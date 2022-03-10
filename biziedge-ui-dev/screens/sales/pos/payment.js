import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import uuid from "react-native-uuid";
import Button from "../../../components/common/buttom/button";

const Payment = ({ route }) => {
  const [paymentTypes, setPaymentTypes] = useState([
    {
      _id: 1,
      name: "Credit Card",
      image: "../../../assets/img.jpeg",
      selected: false,
    },
    {
      _id: 2,
      name: "Debit Card",
      image: "../../../assets/img.jpeg",
      selected: false,
    },
    {
      _id: 3,
      name: "Phone Pe",
      image: "../../../assets/img.jpeg",
      selected: false,
    },
    {
      _id: 4,
      name: "Google Pay",
      image: "../../../assets/img.jpeg",
      selected: false,
    },
    {
      _id: 5,
      name: "Cash",
      image: "../../../assets/img.jpeg",
      selected: false,
    },
  ]);

  const setPaymentType = (paymentType) => {
    let tempPt = paymentTypes;
    tempPt.forEach((pt) => {
      if (paymentType._id == pt._id) pt.selected = !pt.selected;
      else pt.selected = false;
    });
    setPaymentTypes([...tempPt]);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 9 }}>
        {paymentTypes.map((pt) => (
          <PaymentCard
            paymentType={pt}
            setPaymentType={setPaymentType}
            key={uuid.v4()}
          />
        ))}
      </View>
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
      >
        <Text style={{ fontSize: 20 }}>Total - {route.params.totalAmount}</Text>
        <Button
          style={{ minHeight: 40, minWidth: 200, width: "90%" }}
          title={"Proceed"}
        />
      </View>
    </View>
  );
};

const PaymentCard = ({ paymentType, setPaymentType }) => {
  return (
    <TouchableOpacity
      onPress={() => setPaymentType(paymentType)}
      style={[
        styles.card,
        paymentType.selected
          ? { borderColor: "#FF8C00" }
          : { borderColor: "#000000" },
      ]}
    >
      <View style={{ flex: 2 }}>
        <Image
          style={styles.itemImage}
          source={require("../../../assets/img.jpeg")}
          defaultSource={require("../../../assets/img.jpeg")}
        />
      </View>
      <View style={{ flex: 8 }}>
        <Text style={styles.paymentText}>{paymentType.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    marginVertical: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  paymentText: {
    fontSize: 20,
    color: "#000000",
  },
});

const mapStateToProps = ({ inventory }) => ({ inventory });
export default connect(mapStateToProps, null)(Payment);
