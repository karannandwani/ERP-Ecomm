import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import Button from "../../components/common/buttom/button";
import AddModal from "../../components/addModal/addModal";
import ExtraTaxForm from "./addExtraTaxForm";

const AddExtraTaxToHsn = ({ onSubmit, value, showModal }) => {
  const [taxModalVisible, setTaxModalVisible] = useState(
    showModal === true ? true : false
  );
  const [selectedTax, setSelectedTax] = useState({});

  const handleTaxCallback = (childData) => {
    setTaxModalVisible(childData);
  };

  useEffect(() => {
    setTaxModalVisible(showModal);
    if (value) {
      setSelectedTax(value);
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={{ marginLeft: 5 }}>
        <Button
          title="Add Extra Tax"
          pressFunc={() => {
            setSelectedTax({});
            setTaxModalVisible(true);
          }}
        ></Button>
      </View>

      <AddModal
        showModal={taxModalVisible}
        onSelection={handleTaxCallback}
        modalViewStyle={{
          maxWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20,
          minWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20,
          flexDirection: "column",
          paddingTop: 20,
          paddingBottom: window.width >= 360 ? 20 : 10,
          paddingLeft: window.width >= 360 ? 40 : 10,
          paddingRight: window.width >= 360 ? 40 : 10,
          borderRadius: 6,
          backgroundColor: "#fefefe",
        }}
        add={
          <ExtraTaxForm
            tax={selectedTax}
            onChange={(tax) => {
              onSubmit(tax);
              setTaxModalVisible(false);
            }}
          ></ExtraTaxForm>
        }
      ></AddModal>
    </View>
  );
};
export default AddExtraTaxToHsn;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
