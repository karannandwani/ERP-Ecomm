import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import Button from "../../components/common/buttom/button";
import PopUp from "../../components/popUp/popUp";
import Icon from "../../components/common/icon";
import { Styles } from "../../globalStyle";
import { DataTable } from "../../components/dataTable/dataTable";
import { DimensionContext } from "../../components/dimensionContext";
const QuantityNormForm = ({
  quantityNormObj,
  items,
  onChange,
  onClickColumn,
  closeModal,
}) => {
  const [data, setData] = useState([
    {
      product: null,
      maxOrdQty: null,
      minOrdQty: null,
      _id: new Date().getTime(),
    },
  ]);
  const [product, setProduct] = useState({});
  const [maxOrdQty, setMaxOrdQty] = useState(null);
  const [minOrdQty, setMinOrdQty] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [form, setForm] = useState({});
  const [validateNow, setValidateNow] = useState(false);
  const headerElements = ["Product Name", "MinOrdQty", "MinOrdQty"];
  const handleProductCallBack = (childData) => {
    setSelectedProduct(childData);
  };
  const { window } = useContext(DimensionContext);
  const size = useWindowDimensions();
  useEffect(() => {
    setProduct(
      quantityNormObj && quantityNormObj.product ? quantityNormObj.product : ""
    );
    setMaxOrdQty(
      quantityNormObj && quantityNormObj.maxOrdQty
        ? quantityNormObj.maxOrdQty
        : ""
    );
    setMinOrdQty(
      quantityNormObj && quantityNormObj.minOrdQty
        ? quantityNormObj.minOrdQty
        : ""
    );
  }, [quantityNormObj]);
  const ExtractionLogic = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <View style={{ height: 40 }}>
            <PopUp
              renderData={items}
              placeholder="Choose"
              selectionValue={product}
              onSelection={(e) => {
                let newObj = { ...row, product: e._id };
                setData(
                  data.map((d, i) => {
                    if (i == index) return { ...d, ...newObj };
                    return d;
                  })
                );
              }}
            ></PopUp>
          </View>
        ),
      },
      {
        value: null,
        component: () => (
          <TextInput
            keyboardType="numeric"
            onChangeText={(e) => {
              let newObj = { ...row, minOrdQty: e };
              setData(
                data.map((d, i) => {
                  if (i == index) return { ...d, ...newObj };
                  return d;
                })
              );
            }}
            placeholder="Min. Order Qty"
            value={row && row.minOrdQty ? row.minOrdQty : ""}
            // isValid={(n) => setForm({ ...form, minOrdQty: n })}
            style={[styles.textInputStyle]}
          ></TextInput>
        ),
      },
      {
        value: null,
        component: () => (
          <TextInput
            keyboardType="numeric"
            onChangeText={(e) => {
              let newObj = { ...row, maxOrdQty: e };
              setData(
                data.map((d, i) => {
                  if (i == index) return { ...d, ...newObj };
                  return d;
                })
              );
            }}
            style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
            placeholder="max. order Qty"
            value={row && row.maxOrdQty ? row.maxOrdQty : ""}
            // isValid={(n) => setForm({ ...form, maxOrdQty: n })}
            style={[styles.textInputStyle]}
          ></TextInput>
        ),
      },
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
                  setData(data.filter((d, i) => i != index));
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
                  setData([
                    ...data,
                    {
                      product: null,
                      maxOrdQty: null,
                      minOrdQty: null,
                      _id: new Date().getTime(),
                    },
                  ]);
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
          <Text style={Styles.h1}>Add Quantity Norm</Text>
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
          data={data}
          extractionLogic={ExtractionLogic}
          headerStyle={[Styles.headerStyle]}
          cellStyle={[Styles.cellStyle]}
          rowStyle={[Styles.rowStyle]}
          headers={[
            { value: "Product Name", minWidth: 100 },
            { value: "Min. Order Qty", minWidth: 100 },
            { value: "REQ* Units", minWidth: 100 },
            { value: "Action", minWidth: 100 },
          ]}
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
            closeModal(false);
          }}
          title={"Close"}
        ></Button>
        <Button
          pressFunc={() => {
            // if (form && form.minOrdQty && form.maxOrdQty) {
            onChange([...data]);
            setData([
              {
                product: null,
                maxOrdQty: null,
                minOrdQty: null,
                _id: new Date().getTime(),
              },
            ]);
            // } else {
            //   setValidateNow(true);
            // }
          }}
          title={"Submit"}
        ></Button>
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
    padding: 10,
    alignSelf: "stretch",
    backgroundColor: "#fff",
  },
});

export default QuantityNormForm;
