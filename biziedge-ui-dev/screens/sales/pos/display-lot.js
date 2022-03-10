import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "../../../components/common/icon";
import { DataTable } from "../../../components/dataTable/dataTable";
import PopUp from "../../../components/popUp/popUp";
import moment from "moment";
import { Styles } from "../../../globalStyle";
import { DimensionContext } from "../../../components/dimensionContext";
import Button from "../../../components/common/buttom/button";
const DisplayLot = ({
  lotData,
  onAddLots,
  onChangeProductLotInput,
  onSelectLot,
  addError,
}) => {
  const [data, setData] = useState({});
  const { window } = useContext(DimensionContext);
  useEffect(() => {
    setData(lotData);
  }, [lotData]);
  // const headerElements = ["Case Qty", "Product Qty", "Lot"];
  // const supplier = selectedBusiness.facilities
  //   ? selectedBusiness.facilities[0].suppliers[0]._id
  //   : "";

  // const getDate = (lotArray) => {
  //   lotArray.forEach((i) => {
  //     let lotDate = new Date(parseInt(i._id.substring(0, 8), 16) * 1000);
  //     lotArray.forEach((i) => {
  //       i.lotDate = lotDate;
  //     });
  //   });
  //   return lotArray;
  // };

  const onQtyChange = (type, qty, index, row) => {
    if (validateInput(type, qty, index)) {
      if (qty == "" || !isNaN(qty)) {
        onChangeProductLotInput(
          qty,
          data.productIndex,
          index,
          row,
          type == "case" ? "NoOfCaseInput" : "NoOfProductInput"
        );
      } else {
        addError("Insert number only", 3000);
      }
    } else {
      addError(
        "You cannot give excessive quantity than required quantity!",
        3000
      );
    }
  };

  const validateInput = (type, qty, index) => {
    let requiredQuantity =
      data.selectedData[type === "case" ? "ordNoOfCase" : "ordNoOfProduct"];
    let totalGivenFromLot =
      data.selectedData.lotArray
        .filter((x, xi) => xi !== index)
        .reduce(
          (a, b) =>
            a + Number(b[type === "case" ? "ordNoOfCase" : "ordNoOfProduct"]),
          0
        ) + qty;
    if (totalGivenFromLot > Number(requiredQuantity)) {
      return false;
    } else {
      return true;
    }
  };

  // {
  //   if (e == "" || !isNaN(e)) {
  //     onChangeProductLotInput(
  //       e,
  //       data.productIndex,
  //       index,
  //       row,
  //       "NoOfProductInput"
  //     );
  //   } else {
  //     addError("Insert number only", 3000);
  //   }
  // }

  const ExtractionLogic = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <View style={{ marginLeft: 2, marginBottom: 2, height: 40 }}>
            <PopUp
              placeholder={"Select"}
              renderData={data?.selectedData?.inventory?.products.filter(
                (x) =>
                  !data.selectedData.lotArray
                    ?.filter((y, yi) => yi !== index)
                    .map((x) => x.lotId)
                    .includes(x.lotId)
              )}
              onSelection={(result) =>
                onSelectLot(data.productIndex, result, index)
              }
              selectionValue={data?.selectedData?.inventory?.products.find(
                (l) => l._id == row.lotId
              )}
              displayField={(date) =>
                date.lotId ? (
                  <View>
                    <Text>
                      {`${moment(
                        new Date(
                          parseInt(date?.lotId?.substring(0, 8), 16) * 1000
                        )
                      ).format("DD/MM/YYYY")}`}
                    </Text>
                    <Text>{`C:${date.noOfCase} & U:${date.noOfProduct}`}</Text>
                  </View>
                ) : null
              }
            ></PopUp>
          </View>
        ),
      },
      {
        value: null,
        component: () => (
          <TextInput
            value={`${row.noOfCase || ""}`}
            onChangeText={(e) => onQtyChange("case", e, index, row)}
            style={[styles.textInputStyle]}
          ></TextInput>
        ),
      },
      {
        value: null,
        component: () => (
          <View style={{ marginLeft: 2 }}>
            <TextInput
              value={`${row.noOfProduct || ""}`}
              onChangeText={(e) => onQtyChange("unit", e, index, row)}
              style={[styles.textInputStyle]}
            ></TextInput>
          </View>
        ),
      },
    ];
  };

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          <Text>Product Lot({data.selectedData?.name})</Text>
        </Text>
      </View>
      <View
        style={[
          {
            width:
              window.width >= 960
                ? window.width / 3 - 10
                : window.width >= 641 && window.width <= 960
                ? window.width / 2 - 10
                : window.width <= 641 && window.width >= 500
                ? window.width / 1.5 - 10
                : window.width <= 500 && window.width >= 450
                ? window.width / 1.2 - 10
                : window.width - 30,
            minHeight: window.height / 3,
          },
          Styles.tableContainer,
        ]}
      >
        <DataTable
          data={data?.selectedData?.lotArray ? data.selectedData.lotArray : []}
          extractionLogic={ExtractionLogic}
          headerStyle={[Styles.headerStyle]}
          cellStyle={[Styles.cellStyle]}
          rowStyle={[Styles.rowStyle]}
          headers={[
            { value: "Lot", minWidth: 100 },
            { value: "Case", minWidth: 100 },
            { value: "Units", minWidth: 100 },
          ]}
          width={
            window.width >= 960
              ? window.width / 3 - 10
              : window.width >= 641 && window.width <= 960
              ? window.width / 2 - 10
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5 - 10
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 30
          }
          height={Math.max(window.height / 2)}
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
        <Button
          pressFunc={() => {
            onAddLots("close");
          }}
          title={"Close"}
        ></Button>
        <Button
          pressFunc={() => {
            onAddLots(data.productIndex);
          }}
          title={"Add lot"}
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    flex: 1,
    paddingHorizontal: 50,
    width: "100%",
  },
  card: {
    flex: 1,
    alignContent: "flex-start",
    alignItems: "flex-start",
  },
  headerStyle: {
    minWidth: "90%",
    maxWidth: "100%",
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#E8E9EC",
    padding: 10,
    alignSelf: "stretch",
    backgroundColor: "#fff",
  },
});

export default DisplayLot;
