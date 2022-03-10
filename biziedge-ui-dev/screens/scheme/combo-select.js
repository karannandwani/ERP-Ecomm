import React, { useState, useEffect, useContext, useReducer } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  PixelRatio,
} from "react-native";
import Button from "../../components/common/buttom/button";
import PopUp from "../../components/popUp/popUp";
import Icon from "../../components/common/icon";
import { Styles } from "../../globalStyle";
import { DataTable } from "../../components/dataTable/dataTable";
import { DimensionContext } from "../../components/dimensionContext";
import InputTextAreaWithBorder from "../../components/textArea/textArea";
import AutoCompleteModal from "../../components/common/autocompleteModal/auto-complete-modal";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return [
        ...state.map((x, i) =>
          i === action.index ? { ...x, ...action.data } : x
        ),
      ];
    case "INIT_DATA":
      return [
        ...action.data.map((x) => ({
          ...x,
          type: { _id: x.type, name: x.type },
        })),
      ];
    case "REMOVE_ROW":
      return [...state.filter((x, i) => i !== action.index)];
    case "ADD_ROW":
      return [...state, { ...action.data }];
    default:
      return state;
  }
};
const ComboSelect = ({
  onPress,
  onChange,
  closeModal,
  products,
  searchProductByPhrase,
  evaluation,
}) => {
  const [data, setData] = useReducer(reducer, [
    {
      qty: "",
      type: null,
      discount: "",
      freeProduct: null,
      freeQty: "",
      _id: new Date(),
    },
  ]);
  const [header, setHeader] = useState([
    { value: "QTY", minWidth: 100 },
    { value: "Type", minWidth: 200 },
    { value: "Effect", minWidth: 180 },
    { value: "Action", minWidth: 40 },
  ]);
  const { window } = useContext(DimensionContext);
  useEffect(() => {
    if (evaluation && evaluation.length > 0) {
      setData({
        type: "INIT_DATA",
        data: evaluation,
      });
    }
  }, [evaluation]);
  const onChangeType = (receiveData) => {
    setData(receiveData);
    if (receiveData.data.type?._id === "FREE_PRODUCT") {
      setHeader([
        { value: "QTY", minWidth: 100 },
        { value: "Type", minWidth: 200 },
        { value: "Effect", minWidth: 180 },
        { value: "", minWidth: 180 },
        { value: "Action", minWidth: 40 },
      ]);
    } else {
      setHeader([
        { value: "QTY", minWidth: 100 },
        { value: "Type", minWidth: 200 },
        { value: "Effect", minWidth: 180 },
        { value: "Action", minWidth: 40 },
      ]);
    }
  };
  const ExtractionLogic = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <TextInput
            keyboardType="numeric"
            onChangeText={(e) =>
              setData({
                index: index,
                type: "UPDATE",
                data: { qty: e },
              })
            }
            placeholder="QTY"
            value={row.qty}
            style={styles.textInputStyle}
          ></TextInput>
        ),
      },
      {
        value: null,
        component: () => (
          <View style={{ height: 40 }}>
            <PopUp
              renderData={[
                { _id: "FLAT_DISCOUNT", name: "FLAT_DISCOUNT" },
                { _id: "PERCENTAGE_DISCOUNT", name: "PERCENTAGE_DISCOUNT" },
                { _id: "FREE_PRODUCT", name: "FREE_PRODUCT" },
              ]}
              placeholder="Choose"
              selectionValue={row.type}
              onSelection={(e) =>
                onChangeType({
                  index: index,
                  type: "UPDATE",
                  data: { type: e },
                })
              }
            ></PopUp>
          </View>
        ),
      },

      ...(row.type?._id === "FREE_PRODUCT"
        ? [
            {
              value: null,
              component: () => (
                <AutoCompleteModal
                  name={"Product"}
                  data={{
                    data: { name: row.freeProduct?.name ?? "" },
                    displayField: "name",
                  }}
                  onSelection={(result) =>
                    setData({
                      index: index,
                      type: "UPDATE",
                      data: { freeProduct: result },
                    })
                  }
                  styleSingleSelect={{
                    backgroundColor: "#fff",
                  }}
                  searchApi={searchProductByPhrase}
                  renderData={products}
                  isSubmitButtom={true}
                ></AutoCompleteModal>
              ),
            },
            {
              value: null,
              component: () => (
                <TextInput
                  value={`${row.freeQty}`}
                  style={styles.textInputStyle}
                  placeholder="Free QTY"
                  onChangeText={(e) => {
                    setData({
                      index: index,
                      type: "UPDATE",
                      data: { freeQty: e },
                    });
                  }}
                ></TextInput>
                // <InputTextAreaWithBorder
                //   onChangeText={(e) =>
                //     setData({
                //       index: index,
                //       type: "UPDATE",
                //       data: { freeQty: e },
                //     })
                //   }
                //   style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                //   placeholder="Free QTY"
                //   value={`${row.freeQty}`}
                // ></InputTextAreaWithBorder>
              ),
            },
          ]
        : [
            {
              value: null,
              component: () => (
                <TextInput
                  value={row.discount}
                  multiline={true}
                  style={styles.textInputStyle}
                  placeholder="Free QTY"
                  onChangeText={(e) => {
                    setData({
                      index: index,
                      type: "UPDATE",
                      data: { discount: e },
                    });
                  }}
                ></TextInput>
                // <InputTextAreaWithBorder
                //   onChangeText={(e) =>
                //     setData({
                //       index: index,
                //       type: "UPDATE",
                //       data: { discount: e },
                //     })
                //   }
                //   style={{
                //     borderWidth: 1,
                //     borderColor: "#E8E9EC",
                //   }}
                //   placeholder="Discount"
                //   // label="Discount"
                //   value={row.discount}
                //   multiline={true}
                //   smallTextInputStyle={{
                //     minHeight: 40,
                //     minWidth: "100%",
                //   }}
                // ></InputTextAreaWithBorder>
              ),
            },
          ]),
      {
        value: null,
        component: () => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
              flexDirection: "row",
            }}
          >
            {data.length > 1 ? (
              <TouchableOpacity
                onPress={() => {
                  setData({
                    type: "REMOVE_ROW",
                    index: index,
                  });
                }}
              >
                <Icon
                  name="remove"
                  fill="red"
                  style={{ width: 35, height: 35, marginTop: 7 }}
                ></Icon>
              </TouchableOpacity>
            ) : (
              <></>
            )}
            {index === data.length - 1 ? (
              <TouchableOpacity
                onPress={() => {
                  setData({
                    type: "ADD_ROW",
                    data: {
                      qty: "",
                      type: null,
                      discount: "",
                      freeProduct: null,
                      freeQty: "",
                    },
                  });
                }}
              >
                <Icon name="plus" fill="#808080"></Icon>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        ),
      },

      // data.length > 1 ? (
      //   <View>
      //     <TouchableOpacity onPress={() => setData(data.splice(1))}>
      //       <Icon name="remove" fill="red" style={{ width: 16, height: 16 }}>
      //         <Text> </Text>
      //       </Icon>
      //     </TouchableOpacity>
      //   </View>
      // ) : (
      //   <></>
      // ),
    ];
  };

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          <Text style={Styles.h1}>Add Combinations</Text>
        </Text>
      </View>
      <View
        style={[
          {
            width:
              window.width >= 960
                ? window.width / 2.5
                : window.width >= 641 && window.width <= 960
                ? window.width / 2
                : window.width <= 641 && window.width >= 500
                ? window.width / 1.5
                : window.width <= 500 && window.width >= 450
                ? window.width / 1.2
                : window.width - 20,
            minHeight: window.height / 3,
          },
          Styles.tableContainer,
        ]}
      >
        <DataTable
          data={data}
          extractionLogic={ExtractionLogic}
          headerStyle={[Styles.headerStyle]}
          cellStyle={[Styles.cellStyle]}
          rowStyle={[Styles.rowStyle]}
          headers={header}
          width={
            window.width >= 960
              ? window.width / 2.5
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20
          }
          height={window.height / 2}
        ></DataTable>
      </View>
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Button pressFunc={onPress} title={"Close"}></Button>
        <Button
          pressFunc={() => {
            onChange([
              ...data
                .filter(
                  (x) =>
                    x.type?._id && ((x.freeProduct && x.freeQty) || x.discount)
                )
                .map((x) => ({ ...x, type: x.type._id })),
            ]);
          }}
          title={"Submit"}
        ></Button>
      </View>
      <View
        style={{
          flexDirection: "row",
          width:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20,
        }}
      >
        <Text>Note:{"  "}</Text>
        <Text style={{ color: "red" }}>
          Please make sure you fill all the details in every combination or else
          that will be removed during submit.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  // headerStyle: {
  //   minWidth: "90%",
  //   maxWidth: "100%",
  // },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#E8E9EC",
    color: "black",
    padding: 10,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    flex: 1,
    color: "#36404a",
    fontWeight: "normal",
    fontSize: 15 * PixelRatio.getFontScale(),
    width: "100%",
    maxHeight: 60,
    minHeight: 40,
    maxWidth: 400,
  },
});

export default ComboSelect;
