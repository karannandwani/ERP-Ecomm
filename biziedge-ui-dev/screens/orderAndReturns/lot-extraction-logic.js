import { TextInput } from "react-native";
import PopUp from "../../components/popUp/popUp";
import React, { useState, useEffect } from "react";
import moment from "moment";

const ExtractionLogicOfLot = ({
  lot,
  indexOfEachLot,
  onChangeHandler,
  productIndex,
  productLotsListMap,
  productDataForLot,
  textInputStyle,
}) => {
  const [returnNoOfCase, setNoOfCase] = useState("");
  const [returnNoOfProduct, setNoOfProduct] = useState("");
  useEffect(() => {
    setNoOfCase(lot.noOfCase);
    setNoOfProduct(lot.noOfProduct);
  }, [lot]);
  return [
    <View style={{ height: 40 }}>
      <PopUp
        onSelection={(x) => console.log(x)}
        renderData={productLotsListMap}
        selectionValue={
          productLotsListMap && productLotsListMap.length > 0
            ? productLotsListMap.find((x) => x._id === lot.lotId)
            : null
        }
        displayField={(date) =>
          `${moment(new Date(date.lotDate)).format("DD/MM/YYYY")}/C-${
            date.noOfCase
          }/P-${date.noOfProduct}`
        }
      ></PopUp>
    </View>,
    <TextInput
      value={returnNoOfCase}
      onChangeText={(num) => {
        setNoOfCase(num);
        onChangeHandler("Cases", lot, num);
      }}
      style={textInputStyle}
    ></TextInput>,
    <TextInput
      value={returnNoOfProduct}
      onChangeText={(num) => {
        setNoOfProduct(num);
        onChangeHandler("Products", lot, num, productDataForLot);
      }}
      style={textInputStyle}
    ></TextInput>,
  ];
};

export default ExtractionLogicOfLot;
