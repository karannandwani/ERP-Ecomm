import React, { useState, useEffect, Fragment, useContext } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import Button from "../../components/common/buttom/button";
import DatePicker from "../../components/datePicker/datePicker";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Checkbox from "../../components/common/checkBox/checkbox";
import PopUp from "../../components/popUp/popUp";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import FilterComponent from "../../components/filter/filter";

const AddEditCoupon = ({ coupon, onChange, Percentage, Flat }) => {
  const [name, setName] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  // const [date ,setDate] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [ceilingValue, setCeilingValue] = useState("");
  const [minCartValue, setMinCartValue] = useState("");
  const [form, setForm] = useState({});
  const [validFrom, setvalidFrom] = useState(new Date());
  const [validTill, setvalidTill] = useState(new Date());
  const [active, setActive] = useState(true);
  const [validateNow, setValidateNow] = useState(false);
  const { window } = useContext(DimensionContext);

  const CheckboxCallback = (e) => {
    setActive(e);
  };

  useEffect(() => {
    setForm({ ...coupon });
    setName(coupon && coupon.name ? coupon.name : "");
    setDiscountAmount(
      coupon && coupon.discountAmount ? coupon.discountAmount : ""
    );
    setDiscountType(
      coupon.discountType
        ? { _id: coupon.discountType, name: coupon.discountType }
        : ""
    );
    setvalidFrom(
      coupon && coupon.validFrom ? new Date(coupon.validFrom) : new Date()
    );
    setvalidTill(
      coupon && coupon.validTill ? new Date(coupon.validTill) : new Date()
    );
    setCeilingValue(coupon && coupon.ceilingValue ? coupon.ceilingValue : "");
    setMinCartValue(coupon && coupon.minCartValue ? coupon.minCartValue : "");
    setActive(coupon.active ? coupon.active : "");
  }, [coupon]);

  let discountTypeArray = [{ name: "Percentage" }, { name: "Flat" }];

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {coupon._id ? "Update Coupon" : "Add Coupon"}
        </Text>
      </View>

      <View>
        <InputboxWithBorder
          onChangeText={(e) => setName(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Name"
          placeholder="Name"
          value={name}
          inValidText="Name should not be blank"
          required={true}
          validateNow={validateNow}
          isValid={(n) => setForm({ ...form, name: n })}
        ></InputboxWithBorder>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
          zIndex: 9,
          borderBottomColor: "#E8E9EC",
          borderBottomWidth: 1,
        }}
      >
        <View>
          <Text>Valid Form</Text>
          <FilterComponent
            type={"date"}
            filterConfig={{
              value: validFrom,
            }}
            onFilterChange={(vv) => setvalidFrom(vv.value)}
          />
        </View>
        <View>
          <Text>Valid Till</Text>
          <FilterComponent
            type={"date"}
            filterConfig={{
              value: validTill,
            }}
            onFilterChange={(vv) => setvalidTill(vv.value)}
          />
        </View>
      </View>
      <View style={{ marginTop: 10, minheight: 40 }}>
        <PopUp
          style={{ minHeight: 40 }}
          renderData={discountTypeArray}
          selectionValue={discountType}
          onSelection={(data) => {
            setDiscountType(data);
          }}
          placeholder="Discount Type"
          label={"Discount Type"}
          containerStyle={{ marginBottom: 10 }}
          // style={{ borderWidth: 1, borderColor: "#E8E9EC", padding: 8 }}
        ></PopUp>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setDiscountAmount(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC", zIndex: 1 }}
          label={
            discountType.name == "Percentage"
              ? "Discount Percentage"
              : "Discount Amount"
          }
          placeholder="Maximum Discount"
          value={discountAmount.toString()}
          isValid={(n) => setForm({ ...form, discountAmount: n })}
        ></InputboxWithBorder>
      </View>
      {/* <InputboxWithBorder
            onChangeText={(e) => setDiscountType(e)}
            style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
            label="Type of discount"
            placeholder="type of discount"
            value={discountType}
            isValid={(n) => setForm({ ...form, discountAmount: n })}
          ></InputboxWithBorder> */}

      <View>
        <InputboxWithBorder
          onChangeText={(e) => setCeilingValue(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Ceiling value"
          placeholder="Ceiling value"
          value={ceilingValue.toString()}
          // isValid={(n) => setForm({ ...form, ceilingValue: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setMinCartValue(e)}
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          label="Minimum Cart Value"
          placeholder="Minimum Cart Value"
          value={minCartValue.toString()}
          // isValid={(n) => setForm({ ...form, minCartValue: n })}
        ></InputboxWithBorder>
      </View>
      <View>
        <Checkbox
          setValue={CheckboxCallback}
          isLabel={true}
          label={"Available"}
          value={active}
        ></Checkbox>
      </View>
      <View
        style={{
          minHeight:
            Platform.OS === "android" || Platform.OS === "ios"
              ? window.height / 6
              : window.height / 8,
          marginTop: 20,
        }}
      >
        <Button
          pressFunc={() => {
            if (
              (form && form.name, validFrom, discountType, form.discountAmount)
            ) {
              onChange({
                ...coupon,
                name: name,
                validFrom: validFrom,
                validTill: validTill,
                discountType: discountType.name,
                discountAmount: discountAmount,
                minCartValue: minCartValue,
                ceilingValue: ceilingValue,
                active: active,
              });
            } else {
              setValidateNow(true);
            }
          }}
          title={"Submit"}
        ></Button>
      </View>
    </View>
  );
};

export default AddEditCoupon;
