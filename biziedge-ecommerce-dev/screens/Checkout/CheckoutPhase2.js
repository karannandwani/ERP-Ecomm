import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "../../components/common/icon";
import { connect } from "react-redux";
import FormComponent from "../../components/common/Form/FormComponent";
import Button from "../../components/common/button/button";
import Checkbox from "../../components/common/checkbox/Checkbox";
import SelectionCircle from "../../components/selectionCircle/selectionCircle";
import { checkout } from "../../redux/actions/cart.action";
import { addError, addInfo } from "../../redux/actions/toast.action";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import RazorpayCheckout from "react-native-razorpay";

//CheckoutPhase2
const CheckoutPhase2 = ({
  navigation,
  checkout,
  currentCart,
  addInfo,
  addError,
  business,
  razorPayDetails,
}) => {
  const [cashPayment, setCashPayment] = useState(true);
  const [cardPayment, setCardPayment] = useState(false);
  const [selected, setSelected] = useState(false);
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [active, setActive] = useState(false);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const [cashOnDelivery, setCashOnDelivery] = useState(false);

  const openCashPayment = () => {
    setCashPayment(true);
    setCardPayment(false);
    setSelected(false);
  };

  const openCardPayment = () => {
    try {
      if (razorPayDetails) {
        var options = {
          description: "",
          image: `https://www.saiwin.in/images/logo-white.png`,
          currency: "INR",
          key: razorPayDetails.value,
          amount: Number(currentCart.subTotal).toFixed(2) * 100,
          name: business.name,
          order_id: currentCart.razorPayOrderId,
          theme: { color: "#FA4248" },
        };
        RazorpayCheckout.open(options)
          .then((data) => {
            checkout({
              _id: currentCart._id,
              payment: data,
            });
            addInfo("Successfully Paid!", 3000);
            navigation.navigate("checkoutComplete");
          })
          .catch((error) => {
            addError(
              JSON.parse(error.description)?.description ||
                JSON.parse(error.description)?.error?.description,
              3000
            );
          });
      } else {
        addError("RazorPay not integrated!", 3000);
      }
    } catch (e) {
      addError(e, 3000);
    }
  };
  const CheckboxCallback = (e) => {
    setActive(e);
  };

  const nextPress = () => {
    if (cashOnDelivery) {
      checkout({
        _id: currentCart._id,
        payment: {
          type: "COD",
        },
      });
      navigation.navigate("checkoutComplete");
    } else {
      addError("Please select payment type!", 3000);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1.4,
          marginTop: 25,
        }}
      >
        <SaiWinLogo
          backIconStyle={{
            marginLeft: 20,
          }}
          containerStyle={{
            flexDirection: "row",
            height: "100%",
            backgroundColor: "white",
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
          }}
          onPressIcon={() => navigation.navigate("address")}
          imageStyle={{ marginTop: 5 }}
          onPressLogo={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
        ></SaiWinLogo>
      </View>
      <View style={{ flex: 1, minHeight: 30, marginTop: 5 }}>
        <SelectionCircle
          secondCircle={true}
          style={{ minHeight: "100%", flex: 1 }}
        ></SelectionCircle>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          // marginBottom: 25,
          marginTop: 15,
          marginLeft: 10,
          marginRight: 10,
          // margin: 20,
          // backgroundColor:"red",
          paddingTop: 10,
          // bottom: 50,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: cashPayment ? "#FA4248" : "#fff",
            borderRadius: 100,
            borderColor: "#D6D2D2",
            borderWidth: 1,
            marginRight: 20,
            alignItems: "center",
            justifyContent: "center",
            maxHeight: 60,
          }}
          onPress={() => openCashPayment()}
        >
          <Text style={{ color: "#B2ACAC", fontSize: 15 }}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: 100,
            borderColor: "#D6D2D2",
            borderWidth: 1,
            marginRight: 20,
            alignItems: "center",
            justifyContent: "center",
            maxHeight: 60,
            backgroundColor: cardPayment ? "#FA4248" : "#fff",
          }}
          onPress={() => openCardPayment()}
        >
          <Icon
            style={{ marginTop: 25, marginLeft: 20 }}
            name="creditCard"
          ></Icon>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 8, marginLeft: 10 }}>
        {cardPayment ? (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, maxHeight: 240 }}>
              <FormComponent
                placeholder="Account holder name"
                header="Name on Card"
                value={name}
                onChangeText={(e) => setName(e)}
                autoFocus={true}
                isValid={(v) => {
                  setForm({ ...form, name: v });
                }}
                validateNow={validateNow}
                style={{ maxHeight: 120 }}
              ></FormComponent>
              <FormComponent
                placeholder="Card Number"
                header="Card Number"
                value={cardNumber}
                onChangeText={(e) => setCardNumber(e)}
                autoFocus={true}
                isValid={(v) => {
                  setForm({ ...form, cardNumber: v });
                }}
                validateNow={validateNow}
                style={{ maxHeight: 120 }}
              ></FormComponent>
            </View>
            <View
              style={{
                flex: 0.5,
                flexDirection: "row",
              }}
            >
              <FormComponent
                placeholder="Expire Date"
                header="Expire date"
                onChangeText={(e) => setExpireDate(e)}
                value={expireDate}
                autoFocus={true}
                isValid={(v) => {
                  setForm({ ...form, expireDate: v });
                }}
                style={{ maxHeight: 120 }}
              ></FormComponent>

              <FormComponent
                placeholder="CVV"
                header="CVV"
                value={cvv}
                autoFocus={true}
                onChangeText={(e) => setCvv(e)}
                isValid={(v) => {
                  setForm({ ...form, cvv: v });
                }}
                style={{ maxHeight: 120 }}
              ></FormComponent>
            </View>

            <View style={{ marginTop: 10 }}>
              <Checkbox
                label="Save the card details"
                style={{ borderRadius: 100 }}
                setValue={CheckboxCallback}
                value={active}
              ></Checkbox>
            </View>
          </View>
        ) : (
          <></>
        )}
        {cashPayment ? (
          <View
            style={{
              borderWidth: 1,
              minHeight: 50,
              maxHeight: 60,
              borderRadius: 10,
              padding: 20,
              marginTop: 40,
              flexDirection: "row",
              alignItems: "center",
              borderColor: "#D6D2D2",
              marginRight: 10,
            }}
          >
            <Checkbox
              style={{ borderRadius: 20 }}
              setValue={() => setCashOnDelivery(cashOnDelivery ? false : true)}
            ></Checkbox>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              Pay on Delivery (Cash/Card)
            </Text>
          </View>
        ) : (
          <></>
        )}
        {selected ? <View></View> : <></>}
      </View>

      <View style={{ flexDirection: "row" }}>
        <Button
          pressFunc={() => navigation.navigate("address")}
          style={{
            marginRight: 10,
            borderColor: "#FA4248",
            maxHeight: 40,
            minHeight: 40,
          }}
          title="Back"
        ></Button>
        <Button
          pressFunc={() => nextPress()}
          style={{
            borderColor: "#FA4248",
            backgroundColor: "#FA4248",
            maxHeight: 40,
            minHeight: 40,
          }}
          textStyle={{ color: "#fff" }}
          title="Place Order"
        ></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
});
const mapStateToProps = ({ currentCart, business, razorPayDetails }) => ({
  currentCart,
  business,
  razorPayDetails,
});
export default connect(mapStateToProps, {
  checkout,
  addInfo,
  addError,
})(CheckoutPhase2);
