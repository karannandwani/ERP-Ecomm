import React, { useState, useEffect, useReducer, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  FlatList,
} from "react-native";
import Icon from "../../components/common/icon";
import Button from "../../components/common/buttom/button";
import AddModal from "../../components/addModal/addModal";
import AutoCompleteModal from "../../components/common/autocompleteModal/auto-complete-modal";
import moment from "moment";
import { connect } from "react-redux";
import { DataTable } from "../../components/dataTable/dataTable";
import { addError, addInfo } from "../../redux/actions/toast.action";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import CardWithoutGraph from "../../components/common/cards/CardWithoutGraph";
import { returnProductToSupplier } from "../../redux/actions/return.action";
function reducerforExpiredProduct(state, action) {
  switch (action.type) {
    case "add":
      return [...action.value];
    case "add_in_data":
      return [
        ...state.map((x, indexExpProd) =>
          indexExpProd === action.value.indexPro
            ? {
                ...x,
                products: [
                  ...x.products.map((lot, lotInde) =>
                    lotInde === action.value.indexlot
                      ? { ...lot, isExpiryLotAdded: true }
                      : lot
                  ),
                ],
              }
            : x
        ),
      ];
    case "remove_from_data":
      return [
        ...state.map((x, indexExpProd) =>
          indexExpProd === action.value.indexPro
            ? {
                ...x,
                products: [
                  ...x.products.map((lot, lotInde) =>
                    lotInde === action.value.indexlot
                      ? { ...lot, isExpiryLotAdded: false }
                      : lot
                  ),
                ],
              }
            : x
        ),
      ];
    default:
      return state;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "add_bill":
      return [...state, { ...action.value }];
    case "update_bill":
      return [
        ...state.filter((x) => x.productId != action.value.productId),
        { ...action.value },
      ];
    case "add_to_return":
      let demoPro = state.filter((x) => x.productId != null);
      let newState = demoPro.map((pro) =>
        pro.productId === action.value.productId
          ? {
              ...pro,
              ordNoOfCase: Number(action.value.ordNoOfCase),
              ordNoOfProduct: Number(action.value.ordNoOfProduct),
              products: pro.products.map((lot) =>
                action.value.products[0]._id === lot._id
                  ? {
                      ...action.value.products[0],
                    }
                  : lot
              ),
            }
          : pro
      );
      if (
        newState.findIndex((x) => x.productId === action.value.productId) === -1
      ) {
        newState.push({
          productId: action.value.productId,
          item: action.value.item,
          ordNoOfCase: action.value.ordNoOfCase,
          ordNoOfProduct: action.value.ordNoOfProduct,
          id: action.value.id,
          products: action.value.productWithInventory.products.map((x) =>
            action.value.products[0]._id === x._id
              ? action.value.products[0]
              : x
          ),
        });
      }
      return [...newState];
    case "remove_lot_expired":
      let newProdt = action.value;
      let matchProduct = state.find((x) => x.productId === newProdt.productId);
      if (
        matchProduct.ordNoOfCase === newProdt.ordNoOfCase &&
        matchProduct.ordNoOfProduct === newProdt.ordNoOfProduct
      ) {
        let newState = state.filter((x) => x.productId != newProdt.productId);
        newState.length > 0
          ? newState
          : newState.push({
              productId: null,
              item: null,
              ordNoOfCase: "",
              ordNoOfProduct: "",
              _id: new Date().getTime(),
            });
        return [...newState];
      } else {
        let newData = state.map((x) =>
          x.productId === newProdt.productId
            ? {
                ...x,
                ordNoOfCase:
                  Number(x.ordNoOfCase || 0) - Number(newProdt.ordNoOfCase),
                ordNoOfProduct:
                  Number(x.ordNoOfProduct || 0) -
                  Number(newProdt.ordNoOfProduct),
                products: x.products.map((lot) =>
                  lot._id === newProdt.products[0]._id
                    ? {
                        ...lot,
                        returnNoOfCase: "",
                        returnNoOfProduct: "",
                      }
                    : lot
                ),
              }
            : x
        );
        return [...newData];
      }
    case "refresh":
      return [
        ...state.map((x) =>
          x.productId === action.value
            ? {
                productId: null,
                item: null,
                ordNoOfCase: "",
                ordNoOfProduct: "",
                _id: new Date().getTime(),
              }
            : x
        ),
      ];
    case "remove":
      return state.filter((x, index) => index != action.value);
    default:
      return state;
  }
}

const ReturnProduct = ({
  route,
  inventory,
  selectedFacility,
  addError,
  addInfo,
  selectedBusiness,
  navigation,
  returnProductToSupplier,
  productCount,
  brandCount,
}) => {
  const [data, setData] = useReducer(reducer, [
    {
      productId: null,
      item: null,
      ordNoOfCase: "",
      ordNoOfProduct: "",
      _id: new Date().getTime(),
    },
  ]);
  const [toBeExpiredProduct, setToBeExpiredProduct] = useReducer(
    reducerforExpiredProduct,
    []
  );

  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [expiredProduct, setExpiredProducts] = useState([]);
  const [isLotModal, setIsLotModal] = useState({ show: false });
  const [isSelectedFacility, setIsSelectedFacility] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const { window } = useContext(DimensionContext);
  const [invalid, isInvalid] = useState(false);

  useEffect(() => {
    if (route.params && filteredProducts.length > 0) {
      setSelectedSupplier(route.params.supplier);
      let inv = filteredProducts.map((element) => ({
        ...element,
        products: element.products.filter(
          (x) => x.supplier === route.params.supplier
        ),
      }));
      setProductsData(inv.map((x) => x?.product));
    }
  }, [route, filteredProducts]);

  useEffect(() => {
    if (selectedFacility && !isSelectedFacility) {
      setIsSelectedFacility(true);
      setFilteredProducts([
        ...inventory.filter((x) => x.facility === selectedFacility._id),
      ]);
      setExpiredProducts([
        ...expiredProduct.filter((x) => x.facility === selectedFacility._id),
      ]);
      setToBeExpiredProduct({
        type: "add",
        value: inventory
          .filter((x) => x.facility === selectedFacility._id)
          .map((prod) => ({
            ...prod,
            products: prod.products
              .filter(
                (lotData) =>
                  lotData.expiryDate &&
                  new Date(lotData.expiryDate).getDate() -
                    new Date().getDate() <=
                    100 //will change
              )
              .map((lot) => ({ ...lot, isExpiryLotAdded: false })),
          }))
          .filter((x) => x.products.length > 0),
      });
    }
  }, [selectedFacility]);
  const handleCallbackLot = (childData) => {
    setIsLotModal({
      show: false,
    });
  };
  // const searchUserByPhrase = (phrase) => {
  //   fetchProducts({
  //     business: selectedBusiness.business._id,
  //     pageNo: 0,
  //     pageSize: 15,
  //     name: phrase,
  //   });
  // };

  const removeData = (p) => {
    // setData(data.filter((x) => x != p));
  };
  const refresh = (data) => {
    setData({ type: "refresh", value: data });
  };
  const onChangeLotInput = (inputData, lotIndex, inputColumn) => {
    let totalQtyChoosen =
      data[isLotModal.index].products
        .filter((x, i) => i !== lotIndex)
        .reduce((a, b) => a + Number(b[inputColumn] || 0), 0) +
      Number(inputData[inputColumn]);
    let prodData = data.find((x, xi) => xi === isLotModal.index);
    setData({
      type: "update_bill",
      value: prodData
        ? {
            ...prodData,
            products: prodData.products.map((p, pi) =>
              pi === lotIndex
                ? {
                    ...p,
                    ...inputData,
                    invalidCase:
                      inputColumn === "returnNoOfCase"
                        ? inputData.invalidCase ||
                          totalQtyChoosen !== Number(prodData.ordNoOfCase)
                        : p.invalidCase,
                    invalidProduct:
                      inputColumn === "returnNoOfCase"
                        ? inputData.remainingCase * Number(p.qtyPerCase) +
                            p.noOfProduct <
                          p.returnNoOfProduct
                        : inputColumn === "returnNoOfProduct"
                        ? inputData.invalidProduct ||
                          totalQtyChoosen !== Number(prodData.ordNoOfProduct)
                        : p.invalidProduct,
                  }
                : {
                    ...p,
                    invalidCase:
                      inputColumn === "returnNoOfCase"
                        ? totalQtyChoosen !== Number(prodData.ordNoOfCase)
                        : p.invalidCase,
                    invalidProduct:
                      inputColumn === "returnNoOfProduct"
                        ? totalQtyChoosen !== Number(prodData.ordNoOfProduct)
                        : p.invalidProduct,
                  }
            ),
          }
        : {},
    });
  };

  const onChangeProductInput = (inputData, productIndex, inputColumn) => {
    let currentData = data.find((p, i) => i === productIndex);
    let returnCase = currentData.products.reduce(
      (a, b) => a + Number(b.returnNoOfCase || 0),
      0
    );
    let returnProduct = currentData.products.reduce(
      (a, b) => a + Number(b.returnNoOfProduct || 0),
      0
    );

    setData({
      type: "update_bill",
      value: {
        ...currentData,
        products: currentData.products.map((x) => ({
          ...x,
          invalidCase:
            inputColumn.includes("Case") &&
            Number(inputData[inputColumn] || 0) > returnCase
              ? true
              : false,
          invalidProduct:
            inputColumn.includes("Product") &&
            Number(inputData[inputColumn] || 0) > returnProduct
              ? true
              : false,
        })),
        ...inputData,
      },
    });
  };

  const modalCallBack = (selectedItem, index) => {
    if (selectedItem) {
      let productWithInventory = inventory.find(
        (x) =>
          x.product._id === selectedItem._id &&
          x.facility === selectedFacility._id
      );
      data[index].item = selectedItem.name;
      data[index].productId = selectedItem._id;
      data[index].inventory = productWithInventory._id;
      data[index].products = productWithInventory
        ? productWithInventory?.products
            .filter((x) => x.supplier === route.params.supplier)
            .map((v) => ({
              ...v,
              returnNoOfCase: "",
              returnNoOfProduct: "",
            }))
        : [];
      setIsLotModal({
        show: false,
        index: index,
      });
      if (invalid) {
        isInvalid(false);
      }
    }
  };

  const onClickToBeExpired = (indexPro, indexlot, keys) => {
    if (keys === "remove") {
      let allPro = toBeExpiredProduct[indexPro];
      setData({
        type: "remove_lot_expired",
        value: {
          productId: allPro.product._id,
          item: allPro.product.name,
          ordNoOfCase: allPro.products[indexlot].noOfCase,
          ordNoOfProduct: allPro.products[indexlot].noOfProduct,
          id: new Date().getTime(),
          products: [
            {
              ...allPro.products[indexlot],
              returnNoOfCase: allPro.products[indexlot].noOfCase,
              returnNoOfProduct: allPro.products[indexlot].noOfProduct,
            },
          ],
        },
      });

      setToBeExpiredProduct({
        type: "remove_from_data",
        value: { indexPro: indexPro, indexlot: indexlot },
      });
    }

    if (keys === "add") {
      let allPro = toBeExpiredProduct[indexPro];
      let tobeAdded = data
        .find((x) => x.productId === allPro.product._id)
        ?.products.find((x) => x._id === allPro.products[indexlot]._id);
      if (
        tobeAdded &&
        (!tobeAdded.returnNoOfProduct ||
          !tobeAdded.returnNoOfCase ||
          Number(tobeAdded.returnNoOfProduct || 0) > 0 ||
          Number(tobeAdded.returnNoOfCase || 0) > 0)
      ) {
        addError(`You already choose ${allPro.product.name}`, 3000);
      } else {
        setData({
          type: "add_to_return",
          value: {
            productId: allPro.product._id,
            item: allPro.product.name,
            ordNoOfCase: Number(allPro.products[indexlot].noOfCase),
            ordNoOfProduct: Number(allPro.products[indexlot].noOfProduct),
            id: new Date().getTime(),
            products: [
              {
                ...allPro.products[indexlot],
                returnNoOfCase: Number(allPro.products[indexlot].noOfCase),
                returnNoOfProduct: Number(
                  allPro.products[indexlot].noOfProduct
                ),
              },
            ],
            productWithInventory: inventory.find(
              (x) => x.product._id === allPro.product._id
            ),
          },
        });

        setToBeExpiredProduct({
          type: "add_in_data",
          value: { indexPro: indexPro, indexlot: indexlot },
        });
      }
    }
  };

  const ExtractionLogic = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <AutoCompleteModal
            name={"Product"}
            displayField={"name"}
            data={{
              data: productsData.find((x) => x._id === row.productId)
                ? productsData.find((x) => x._id === row.productId)
                : {},
              displayField: "name",
            }}
            onSelection={(result) => modalCallBack(result, index)}
            styleSingleSelect={{
              backgroundColor: "#fff",
            }}
            renderData={productsData.filter(
              (entry1) =>
                !data.some((entry2) => entry1._id === entry2.productId)
            )}
            isSubmitButtom={true}
            textInputStyle={invalid ? { borderColor: "red" } : {}}
          ></AutoCompleteModal>
        ),
      },
      {
        value: null,
        component: () => (
          <TextInput
            value={row.ordNoOfCase ? `${row.ordNoOfCase}` : ""}
            placeholder="Case"
            keyboardType="numeric"
            onChangeText={(e) => {
              row.productId
                ? onChangeProductInput(
                    { ordNoOfCase: Number(e) },
                    index,
                    "ordNoOfCase"
                  )
                : addError("Choose product 1st", 3000);
            }}
            style={[
              styles.textInputStyle,
              invalid ? { borderColor: "red" } : {},
            ]}
          ></TextInput>
        ),
      },
      {
        value: null,
        component: () => (
          <TextInput
            value={row.ordNoOfProduct ? `${row.ordNoOfProduct}` : ""}
            placeholder="Units"
            keyboardType="numeric"
            onChangeText={(e) => {
              row.productId
                ? onChangeProductInput(
                    { ordNoOfProduct: Number(e) },
                    index,
                    "ordNoOfProduct"
                  )
                : addError("Choose product 1st", 3000);
            }}
            style={[
              styles.textInputStyle,
              invalid ? { borderColor: "red" } : {},
            ]}
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
            <TouchableOpacity
              onPress={() => {
                row.productId
                  ? setIsLotModal({
                      show: true,
                      index: index,
                    })
                  : addError("Choose product 1st", 3000);
              }}
            >
              <Icon
                name="info"
                fill={
                  row.products?.reduce(
                    (a, b) => a || b.invalidCase || b.invalidProduct,
                    false
                  )
                    ? "red"
                    : "rgb(67, 66, 93)"
                }
                style={{ width: 35, height: 25 }}
              ></Icon>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                row.productId
                  ? refresh(row.productId)
                  : addError("Choose Prodcut 1st", 3000);
              }}
            >
              <Icon
                name="refresh"
                fill={"rgb(67, 66, 93)"}
                style={{ width: 45, height: 45, marginTop: 12 }}
              ></Icon>
            </TouchableOpacity> */}
            {data.length > 1 ? (
              <TouchableOpacity
                onPress={() => {
                  setData({ type: "remove", value: index });
                }}
                style={{ flex: 1 }}
              >
                <Icon
                  name="remove"
                  fill={"red"}
                  style={{ width: 40, height: 40, marginTop: 7 }}
                ></Icon>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        ),
      },
    ];
  };

  const checkWithInputInMaster = (input, childInput, index, num) => {
    let parentRow = data[isLotModal.index];
    let total = 0;
    parentRow.products.forEach(
      (x, i) => (total += Number(i === index ? num : x[childInput]))
    );
    return parentRow[input] < total;
  };
  const navigateToInventory = () => {
    setData([
      { productId: null, item: null, ordNoOfCase: null, ordNoOfProduct: null },
    ]);
    navigation.navigate("inventory");
  };
  const submit = () => {
    let newData = data.filter(
      (x) => x.productId && (x.ordNoOfCase || x.ordNoOfProduct)
    );
    if (newData.length > 0) {
      let newDateFilter = newData.map((x) => ({
        ...x,
        products: x.products.filter(
          (lot) => lot.returnNoOfCase || lot.returnNoOfProduct
        ),
      }));
      if (newDateFilter.length === 0) {
        addError("Unable to submit blank data.", 3000);
        return;
      }
      if (
        newDateFilter
          .map((x) => x.products)
          .flat()
          .reduce((a, b) => a || b.invalidCase || b.invalidProduct, false)
      ) {
        addError("Give Valid Data", 3000);
        return;
      }

      if (data.length != newDateFilter.length) {
        addError("Please fill all the required fields", 2000);
        return;
      }

      let products = newDateFilter.map((prod) => ({
        noOfCase: prod.ordNoOfCase,
        noOfProduct: prod.ordNoOfProduct,
        productId: prod.productId,
        lotArray: prod.products.map((lot) => ({
          noOfCase: lot.returnNoOfCase
            ? Number(lot.returnNoOfCase)
            : lot.returnNoOfCase,
          noOfProduct: lot.returnNoOfProduct
            ? Number(lot.returnNoOfProduct)
            : lot.returnNoOfProduct,
          lotId: lot._id,
        })),
      }));
      let submittedData = {
        suppliers: selectedSupplier,
        business: selectedBusiness.business._id,
        facility: selectedFacility._id,
        products: products,
        draft: false,
      };
      returnProductToSupplier(submittedData);
      navigateToInventory();
    } else {
      isInvalid(true);
      addError("Please fill minimum details to request a return!", 3000);
    }
  };

  const ExtractionLogicOfLot = ({ row, index }) => {
    if (Object.keys(row).length > 0) {
      return [
        {
          value: null,
          component: () => (
            <Text>
              {moment(
                new Date(
                  parseInt(row?._id?.toString().substring(0, 8), 16) * 1000
                )
              ).format("MMMM dd, YYYY")}
            </Text>
          ),
        },
        {
          value: null,
          component: () => (
            <View>
              <TextInput
                value={row.returnNoOfCase ? `${row.returnNoOfCase}` : ""}
                onChangeText={(num) => {
                  // onChangeLotInput(
                  //   {
                  //     returnNoOfProduct: num,
                  //     invalidProduct:
                  //       (row.returnNoOfCase
                  //         ? row.remainingCase
                  //         : row.noOfCase) *
                  //         Number(row.qtyPerCase) +
                  //         row.noOfProduct <
                  //         Number(num) ||
                  //       checkWithInputInMaster(
                  //         "ordNoOfProduct",
                  //         "returnNoOfProduct",
                  //         index,
                  //         num
                  //       ),
                  //   },
                  // );
                  onChangeLotInput(
                    {
                      returnNoOfCase: num,
                      invalidCase:
                        row.noOfCase <= num ||
                        checkWithInputInMaster(
                          "ordNoOfCase",
                          "returnNoOfCase",
                          index,
                          num
                        ),
                      remainingCase: row.noOfCase - num,
                    },
                    index,
                    "returnNoOfCase"
                  );
                }}
                style={[
                  styles.textInputStyle,
                  {
                    textDecorationLine: row.invalidCase
                      ? "line-through"
                      : "none",
                  },
                ]}
              ></TextInput>
              <Text
                style={{
                  color: "rgb(67, 66, 93)",
                  height: Platform.OS === "web" ? 5 : 15,
                  position: "absolute",
                  right: 0,
                  bottom: 10,
                  fontSize: 12,
                  fontSize: 10,
                }}
              >
                *{row.noOfCase}/QPC: {row.qtyPerCase}
              </Text>
            </View>
          ),
        },
        {
          value: null,
          component: () => (
            <View>
              <TextInput
                value={row.returnNoOfProduct ? `${row.returnNoOfProduct}` : ""}
                onChangeText={(num) => {
                  onChangeLotInput(
                    {
                      returnNoOfProduct: num,
                      invalidProduct:
                        (row.returnNoOfCase
                          ? row.remainingCase
                          : row.noOfCase) *
                          Number(row.qtyPerCase) +
                          row.noOfProduct <
                          Number(num) ||
                        checkWithInputInMaster(
                          "ordNoOfProduct",
                          "returnNoOfProduct",
                          index,
                          num
                        ),
                    },
                    index,
                    "returnNoOfProduct"
                  );
                }}
                style={[
                  styles.textInputStyle,
                  {
                    textDecorationLine: row.invalidProduct
                      ? "line-through"
                      : "none",
                  },
                ]}
              ></TextInput>
              <Text
                style={{
                  color: "rgb(67, 66, 93)",
                  height: Platform.OS === "web" ? 5 : 15,
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                  fontSize: 12,
                  fontSize: 10,
                }}
              >
                *{row.noOfProduct}
              </Text>
            </View>
          ),
        },
      ];
    } else {
      return [];
    }
  };

  const modalCallBacks = (selectedItem, index) => {};
  return (
    <View style={[styles.container]}>
      {window.width > 667 ? (
        <View
          style={[
            styles.cardContainer,
            {
              width:
                window.width > 1040
                  ? window.width - (320 + 40)
                  : window.width - 60,
              marginLeft: Platform.OS === "web" ? 20 : 10,
              marginRight: Platform.OS === "web" ? 20 : 10,
              marginTop: 20,
            },
          ]}
        >
          <View
            style={[
              {
                maxWidth:
                  window.width > 1040
                    ? (window.width - 380) / 3
                    : (window.width - 60) / 3,
                minWidth:
                  window.width > 1040
                    ? (window.width - 380) / 3
                    : (window.width - 60) / 3,
              },
              Styles.cardSize,
            ]}
          >
            <CardWithoutGraph
              icon="revenue"
              header={productCount}
              subHeader="Total Product"
            ></CardWithoutGraph>
          </View>
          <View
            style={[
              {
                maxWidth:
                  window.width > 1040
                    ? (window.width - 380) / 3
                    : (window.width - 60) / 3,
                minWidth:
                  window.width > 1040
                    ? (window.width - 380) / 3
                    : (window.width - 60) / 3,
              },
              Styles.cardSize,
            ]}
          >
            <CardWithoutGraph
              icon="store"
              header={brandCount}
              subHeader="Total Brand"
            ></CardWithoutGraph>
          </View>
          <View
            style={[
              {
                maxWidth:
                  window.width > 1040
                    ? (window.width - 380) / 3
                    : (window.width - 60) / 3,
                minWidth:
                  window.width > 1040
                    ? (window.width - 380) / 3
                    : (window.width - 40) / 3,
              },
              Styles.cardSize,
            ]}
          >
            <CardWithoutGraph
              icon="growth"
              header={"+2.0%"}
              subHeader={
                window.width > 667 ? "Total Growth" : "Total Growth in Sales"
              }
            ></CardWithoutGraph>
          </View>
        </View>
      ) : (
        <></>
      )}
      <View
        style={{
          width:
            window.width > 1040 ? window.width - (320 + 220) : window.width,
          flexDirection: "row",
          paddingLeft: Platform.OS === "web" ? 20 : 10,
          paddingRight: Platform.OS === "web" ? 30 : 10,
          paddingTop: 20,
          paddingBottom: 20,
          height: "100%",
        }}
      >
        <View
          style={{
            minWidth:
              window.width > 1040
                ? window.width - (320 + 220 + 50)
                : Platform.OS === "web"
                ? window.width - 50
                : window.width - 20,
            backgroundColor: "#fff",
            height: "100%",
          }}
        >
          <DataTable
            data={data}
            extractionLogic={ExtractionLogic}
            headers={[
              { value: "ITEM", minWidth: 100 },
              { value: "REQ* Case", minWidth: 100 },
              { value: "REQ* Units", minWidth: 100 },
              { value: "Action", minWidth: 100 },
            ]}
            headerStyle={{
              color: "#696969",
              backgroundColor: "#DCDCDC",
              alignContent: "center",
              justifyContent: "center",
              padding: 2,
              minWidth: 80,
              fontWeight: "200",
              fontSize: 12,
            }}
            cellStyle={{
              alignContent: "center",
              justifyContent: "center",
              minWidth: 80,
            }}
            rowStyle={{
              borderColor: "#DCDCDC",
              borderWidth: 1,
              borderStyle: "solid",
            }}
            width={
              window.width > 1040
                ? window.width - (320 + 220 + 50)
                : Platform.OS === "web"
                ? window.width - 50
                : window.width - 20
            }
            height={Math.max(window.height - 248)}
            onClickColumn={modalCallBacks}
          ></DataTable>

          <View
            style={{
              flexDirection: "row-reverse",
              marginTop: 20,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgb(67, 66, 93)",
                borderColor: "#000000",
                borderRadius: 200 / 2,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setData({
                    type: "add_bill",
                    value: {
                      productId: null,
                      item: null,
                      ordNoOfCase: "",
                      ordNoOfProduct: "",
                      _id: new Date().getTime(),
                    },
                  });
                }}
              >
                <Icon
                  name="plusOnly"
                  style={{ height: 20, width: 20 }}
                  fill="#fff"
                ></Icon>
              </TouchableOpacity>
            </View>
            <View style={{ marginRight: 10, marginLeft: 10 }}>
              <Button
                style={styles.ButtonStyle}
                textStyle={{ flexDirection: "row", fontSize: 12 }}
                title="Draft"
                pressFunc={() => {}}
              ></Button>
            </View>
            <View>
              <Button title="Submit" pressFunc={() => submit()}></Button>
            </View>
          </View>
        </View>
        <View>
          {window.width > 1040 ? (
            <View style={{ width: 220, marginLeft: 10 }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  borderBottomColor: "#F1F1F3",
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ fontSize: 18, color: "#4D4F5C" }}>
                  To Be expired
                </Text>
              </View>
              <FlatList
                // style={{ flex: 10, padding: 10 }}
                keyExtractor={(item, index) => item._id}
                data={toBeExpiredProduct}
                renderItem={({ item, index: indexPro }) => (
                  <View style={styles.details}>
                    <View style={{ flex: 1 }}>
                      <Text>{item.product ? item.product.name : ""}</Text>
                      <FlatList
                        keyExtractor={(da, i) => da._id}
                        data={item.products}
                        renderItem={({ item: innerData, index: indexLot }) => (
                          <View style={styles.details}>
                            <Text>
                              {moment(new Date(innerData.expiryDate)).format(
                                "DD/MM/YYYY"
                              )}
                            </Text>
                            {/* {innerData.isExpiryLotAdded ? (
                              <TouchableOpacity
                                onPress={() =>
                                  onClickToBeExpired(
                                    indexPro,
                                    indexLot,
                                    "remove"
                                  )
                                }
                              >
                                <Icon
                                  name="delete"
                                  fill={"red"}
                                  style={{ width: 30, height: 20 }}
                                ></Icon>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  onClickToBeExpired(indexPro, indexLot, "add")
                                }
                              >
                                <Icon
                                  name="plus"
                                  fill={"red"}
                                  style={{ width: 30, height: 20 }}
                                ></Icon>
                              </TouchableOpacity>
                            )} */}
                          </View>
                        )}
                      />
                    </View>
                  </View>
                )}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>

      {/* lot Modal */}
      <AddModal
        showModal={isLotModal.show}
        onSelection={handleCallbackLot}
        modalViewStyle={{
          maxHeight: window.width / 2,
          height: window.height / 2,
        }}
        add={
          <View
            style={{
              width: window.width > 1040 ? window.width / 2 : window.width - 20,
              height: window.height / 2,
              padding: 10,
            }}
          >
            <DataTable
              headers={[
                { value: "Lot", minWidth: 100 },
                { value: "Case", minWidth: 100 },
                { value: "Units", minWidth: 100 },
              ]}
              data={isLotModal.show ? data[isLotModal.index].products : []}
              extractionLogic={ExtractionLogicOfLot}
              headerStyle={[Styles.headerStyle]}
              cellStyle={[Styles.cellStyle]}
              rowStyle={[Styles.rowStyle]}
              width={
                window.width > 1040 ? window.width / 2 - 20 : window.width - 20
              }
              height={window.height / 2 - 20}
            ></DataTable>
            <View
              style={{
                position: "absolute",
                bottom: 5,
                width:
                  window.width > 1040 ? window.width / 2 : window.width - 20,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  title="Submit"
                  style={{ width: 100 }}
                  pressFunc={() => setIsLotModal({ show: false })}
                ></Button>
              </View>
            </View>
          </View>
        }
      ></AddModal>
    </View>
  );
  //
  return (
    <View style={styles.container}>
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 30,
          paddingTop: 20,
          paddingBottom: 20,
          flexDirection: "row",
          width: window.width > 1040 ? window.width - 320 : window.width,
        }}
      >
        <View
          style={{
            minWidth:
              window.width > 1040
                ? window.width - (320 + 220 + 50 + 10)
                : window.width,
          }}
        >
          <DataTable
            data={data}
            extractionLogic={ExtractionLogic}
            headers={[
              { value: "ITEM", minWidth: 100 },
              { value: "REQ* CASE", minWidth: 100 },
              { value: "REQ* PRODUCT", minWidth: 100 },
              { value: "Action", minWidth: 100 },
            ]}
            headerStyle={{
              color: "#fff",
              backgroundColor: "rgb(67, 66, 93)",
              alignContent: "center",
              justifyContent: "center",
              padding: 2,
              minWidth: 80,
              fontWeight: "bold",
            }}
            cellStyle={{
              alignContent: "center",
              justifyContent: "center",
              minWidth: 80,
            }}
            rowStyle={{
              borderColor: "rgb(67, 66, 93)",
              borderWidth: 1,
              borderStyle: "solid",
            }}
            width={
              window.width > 1040
                ? window.width - (320 + 220 + 50 + 10)
                : window.width - 50
            }
            // height={Math.max(window.height - 128)}
            onClickColumn={modalCallBacks}
          ></DataTable>
        </View>
        {window.width > 1040 ? (
          <View style={{ width: 220, marginLeft: 10, backgroundColor: "#fff" }}>
            <View
              style={{
                borderBottomWidth: 1,
                padding: 10,
                justifyContent: "center",
                borderBottomColor: "#F1F1F3",
                backgroundColor: "#fff",
              }}
            >
              <Text style={{ fontSize: 18, color: "#4D4F5C" }}>
                To Be expired
              </Text>
            </View>
            <FlatList
              // style={{ flex: 10, padding: 10 }}
              keyExtractor={(item, index) => item._id}
              data={toBeExpiredProduct}
              renderItem={({ item, index: indexPro }) => (
                <View style={styles.details}>
                  <View style={{ flex: 1 }}>
                    <Text>{item.product ? item.product.name : ""}</Text>
                    <FlatList
                      keyExtractor={(da, i) => da._id}
                      data={item.products}
                      renderItem={({ item: innerData, index: indexLot }) => (
                        <View style={styles.details}>
                          <Text>
                            {moment(new Date(innerData.expiryDate)).format(
                              "DD/MM/YYYY"
                            )}
                          </Text>
                          {/* {innerData.isExpiryLotAdded ? (
                              <TouchableOpacity
                                onPress={() =>
                                  onClickToBeExpired(
                                    indexPro,
                                    indexLot,
                                    "remove"
                                  )
                                }
                              >
                                <Icon
                                  name="delete"
                                  fill={"red"}
                                  style={{ width: 30, height: 20 }}
                                ></Icon>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  onClickToBeExpired(indexPro, indexLot, "add")
                                }
                              >
                                <Icon
                                  name="plus"
                                  fill={"red"}
                                  style={{ width: 30, height: 20 }}
                                ></Icon>
                              </TouchableOpacity>
                            )} */}
                        </View>
                      )}
                    />
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <></>
        )}
      </View>

      <AddModal
        showModal={isLotModal.show}
        onSelection={handleCallbackLot}
        modalViewStyle={{
          maxHeight: "60%",
          padding: Platform.OS == "web" ? 40 : 0,
          minWidth: "40%",
        }}
        add={
          <View
            style={{
              width: window.width,
              minHeight: Math.max(window.height / 3, 320),
              height: Math.max(window.height),
              borderColor: "rgb(67, 66, 93)",
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <DataTable
              headers={[
                { value: "Lot", minWidth: 100 },
                { value: "Case Quantity", minWidth: 100 },
                { value: "Product Quantity", minWidth: 100 },
              ]}
              data={isLotModal.show ? data[isLotModal.index].products : []}
              extractionLogic={ExtractionLogicOfLot}
              headerStyle={{
                color: "#fff",
                backgroundColor: "rgb(67, 66, 93)",
                alignContent: "center",
                justifyContent: "center",
                padding: 2,
                minWidth: 80,
                fontWeight: "bold",
              }}
              cellStyle={{
                alignContent: "center",
                justifyContent: "center",
                minWidth: 80,
              }}
              rowStyle={{
                borderColor: "rgb(67, 66, 93)",
                borderWidth: 1,
                borderStyle: "solid",
              }}
              width={window.width}
              height={Math.max(window.height / 3, 320)}
            ></DataTable>
            <View
              style={[
                Styles.container,
                {
                  width: "100%",
                  position: "absolute", //Here is the trick
                  bottom: 0,
                },
              ]}
            >
              <Button
                textStyle={{ flexDirection: "row", fontSize: 12 }}
                title="Submit"
                pressFunc={() => setIsLotModal({ show: false })}
              ></Button>
            </View>
          </View>
        }
      ></AddModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textInputStyle: {
    borderWidth: 1,
    borderColor: "#E8E9EC",
    padding: 10,
    alignSelf: "stretch",
    backgroundColor: "#fff",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#F1F1F3",
    borderBottomWidth: 1,
    padding: 10,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
const mapStateToProps = ({
  selectedBusiness,
  selectedFacility,
  inventory,
  productCount,
  brandCount,
}) => ({
  selectedBusiness,
  selectedFacility,
  inventory,
  productCount,
  brandCount,
});
export default connect(mapStateToProps, {
  addError,
  addInfo,
  returnProductToSupplier,
})(ReturnProduct);
