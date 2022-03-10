import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Icon from "../../components/common/icon";
import { DataTable } from "../../components/dataTable/dataTable";
import PopUp from "../../components/popUp/popUp";
import moment from "moment";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import Button from "../../components/common/buttom/button";
export const DisplayLot = ({
  product,
  orderStatus,
  onChangeLotInput,
  onAddLots,
  textInputStyle,
  onClose,
  modalCallBack,
  addError,
}) => {
  const [productLotsListMap, setProductLotsListMap] = useState([]);
  const [width, setWidth] = useState(
    Dimensions.get("window").width * 0.65 - 400
  );
  const { window } = useContext(DimensionContext);

  const getDate = (lotArray) => {
    let lotDate;
    lotArray?.forEach((i) => {
      lotDate = new Date(parseInt(i?._id?.substring(0, 8), 16) * 1000);
      lotArray.forEach((i) => {
        i.lotDate = lotDate;
      });
    });
    return lotArray;
  };

  const headerElementsForLot = [
    { value: "Lot", minWidth: 50 },
    { value: "Case Quantity", minWidth: 50 },
    { value: "Product Quantity", minWidth: 50 },
  ];

  useEffect(() => {
    setProductLotsListMap(getDate(product?.inventory?.products));
  }, [product, orderStatus]);

  const onQtyChange = (type, row, num, index) => {
    if (validateInput(type, num, index)) {
      if (num == "" || !isNaN(num)) {
        onChangeLotInput(type, row, num, product);
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

  const validateInput = (type, num, index) => {
    let requiredQuantity =
      product[type === "Cases" ? "ordNoOfCase" : "ordNoOfProduct"];
    let totalGivenFromLot =
      product.lotArray
        .filter((x, xi) => xi !== index)
        .reduce(
          (a, b) => a + b[type === "Cases" ? "noOfCase" : "noOfProduct"],
          0
        ) + num;
    if (totalGivenFromLot > requiredQuantity) {
      return false;
    } else {
      return true;
    }
  };

  const lotDataExtraction = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <View style={{ height: 40 }}>
            <PopUp
              onSelection={(result) => {
                if (row.lotId !== result._id) {
                  modalCallBack(result, index);
                } else {
                  addError("Please choose any different lot", 3000);
                }
              }}
              renderData={productLotsListMap?.filter(
                (x) =>
                  !product.lotArray
                    ?.filter((y, yi) => yi !== index)
                    .map((x) => x.lotId)
                    .includes(x._id)
              )}
              selectionValue={
                productLotsListMap && productLotsListMap.length > 0
                  ? productLotsListMap.find((x) => x._id === row.lotId)
                  : null
              }
              displayField={(date) => (
                <View>
                  <Text>
                    {`${moment(new Date(date.lotDate)).format("DD/MM/YYYY")}`}
                  </Text>
                  <Text>{`C:${date.noOfCase} & U:${date.noOfProduct}`}</Text>
                </View>
              )}
            ></PopUp>
          </View>
        ),
      },
      {
        value: null,
        component: () => (
          <TextInput
            value={`${row.noOfCase || ""}`}
            onChangeText={(num) => {
              // setNoOfCase(num);
              onQtyChange("Cases", row, Number(num || 0), index);
            }}
            style={textInputStyle}
          ></TextInput>
        ),
      },
      {
        value: null,
        component: () => (
          <TextInput
            value={`${row.noOfProduct || ""}`}
            onChangeText={(num) => {
              // setNoOfProduct(num);
              onQtyChange("Products", row, Number(num || 0), index);
            }}
            style={textInputStyle}
          ></TextInput>
        ),
      },
    ];
  };

  return product ? (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          <Text>
            Product - {product?.product?.name}({orderStatus?.name})
          </Text>
        </Text>
      </View>
      <View
        style={[
          {
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
            minHeight: window.height / 3,
          },
          Styles.tableContainer,
        ]}
      >
        <DataTable
          data={product?.lotArray || []}
          isJsx={true}
          headerStyle={[Styles.headerStyle]}
          cellStyle={[Styles.cellStyle]}
          rowStyle={[Styles.rowStyle]}
          headers={headerElementsForLot}
          width={
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20
          }
          height={Math.max(window.height / 2)}
          extractionLogic={lotDataExtraction}
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
            onClose();
          }}
          title={"Close"}
        ></Button>
        <Button
          pressFunc={() => {
            if (product.lotArray < product?.inventory?.products) {
              onAddLots();
            } else {
              addError("There are no more lot to add!", 3000);
            }
          }}
          title={"Add lot"}
        ></Button>
      </View>
    </View>
  ) : (
    <></>
  );
};
