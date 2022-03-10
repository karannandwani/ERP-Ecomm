import React, { useState, useEffect, useReducer, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PixelRatio,
  Dimensions,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import Button from "../../components/common/buttom/button";
import Icon from "../../components/common/icon";
import { fetchReasons } from "../../redux/actions/inventory.action";
import { stockUpdate } from "../../redux/actions/inventory.action";
import PopUp from "../../components/popUp/popUp";
import { DataTable } from "../../components/dataTable/dataTable";
// import { CustomHeader } from "../../components/common/customHeader";
import AddModal from "../../components/addModal/addModal";
import { addError } from "../../redux/actions/toast.action";
import { ScrollView, TextInput } from "react-native";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_REMAINING":
      let currentProduct = state[action.index];
      let missingStock = currentProduct.missingStocks;

      let totalMissingCase =
        missingStock.reduce((a, b) => a + (b.caseQty || 0), 0) +
        (action.value["newCaseQty"] || currentProduct["newCaseQty"] || 0);
      let totalMissingUnit =
        missingStock.reduce((a, b) => a + (b.productQty || 0), 0) +
        (action.value["newProductQty"] || currentProduct["newProductQty"] || 0);

      return [
        ...state.map((x, i) =>
          i === action.index
            ? {
                ...x,
                ...action.value,
                invalidCase:
                  totalMissingCase > 0 &&
                  totalMissingCase != currentProduct.noOfCase,
                invalidProduct:
                  totalMissingUnit > 0 &&
                  totalMissingUnit != currentProduct.noOfProduct,
              }
            : { ...x }
        ),
      ];
    case "ADD_MISSING":
      let tempLot = state[action.index];

      let totalMissingCaseEntry =
        tempLot.missingStocks
          .filter((ms, msi) => msi != action.missingIndex)
          .reduce((a, b) => a + (b.caseQty || 0), 0) +
        (action.value["caseQty"] ||
          tempLot.missingStocks[action.missingIndex]["caseQty"] ||
          0) +
        tempLot.newCaseQty;
      let totalMissingUnitEntry =
        tempLot.missingStocks
          .filter((ms, msi) => msi != action.missingIndex)
          .reduce((a, b) => a + (b.productQty || 0), 0) +
        (action.value["productQty"] ||
          tempLot.missingStocks[action.missingIndex]["productQty"] ||
          0) +
        tempLot.newProductQty;

      return [
        ...state.map((x, i) =>
          i === action.index
            ? {
                ...x,
                missingStocks: [
                  ...x.missingStocks.map((m, mi) => ({
                    ...(mi === action.missingIndex
                      ? { ...m, ...action.value }
                      : { ...m }),
                  })),
                ],
                invalidCase: totalMissingCaseEntry != tempLot.noOfCase,
                invalidProduct: totalMissingUnitEntry != tempLot.noOfProduct,
              }
            : { ...x }
        ),
      ];
    case "INIT_DATA":
      return action.value;
    case "NEW_MISSING_OBJECT":
      return [
        ...state.map((x, i) =>
          i === action.index
            ? { ...x, missingStocks: [...x.missingStocks, action.value] }
            : x
        ),
      ];
    case "REMOVE_MISSING_OBJECT":
      return [
        ...state.map((x, i) =>
          i === action.index
            ? {
                ...x,
                missingStocks: [
                  ...x.missingStocks.filter(
                    (ms, mi) => mi != action.missingIndex
                  ),
                ],
              }
            : x
        ),
      ];
    case "ADD_MISSING_REASON":
      return [
        ...state.map((x, i) =>
          i === action.index
            ? {
                ...x,
                missingStocks: [
                  ...x.missingStocks.map((ms, mi) =>
                    mi === action.missingIndex
                      ? { ...ms, reason: action.value }
                      : { ...ms }
                  ),
                ],
              }
            : { ...x }
        ),
      ];
    default:
      return state;
  }
};

const StockManagement = ({
  productDetails,
  fetchReasons,
  selectedFacility,
  selectedBusiness,
  reasons,
  inventoryId,
  stockUpdate,
  addError,
  onSelection,
}) => {
  const [productDetailsData, setProductDetails] = useReducer(reducer, []);
  const headerItems = [
    { value: "Lot Date", minWidth: 100 },
    { value: "Avail Case Qty", minWidth: 100 },
    { value: "Available Units", minWidth: 100 },
    { value: "Missing", minWidth: 100 },
  ];
  const { window } = useContext(DimensionContext);
  const [isMissingLotModal, setIsMissingLotModal] = useState({ show: false });

  useEffect(() => {
    setProductDetails({
      type: "INIT_DATA",
      value: productDetails.map((element) => ({
        ...element,
        newCaseQty: null,
        newProductQty: null,
        invalidCase: false,
        invalidProduct: false,
        missingStocks: [{ ...reasonObject() }],
      })),
    });
    getReasons();
  }, [inventoryId]);

  const reasonObject = () => {
    return {
      reason: null,
      caseQty: null,
      productQty: null,
      info: false,
    };
  };
  const getReasons = () => {
    let obj = {
      facility: selectedFacility._id,
    };
    fetchReasons(obj);
  };
  const addToReason = (index) => {
    setProductDetails({
      type: "NEW_MISSING_OBJECT",
      index: index,
      value: reasonObject(),
    });
  };
  const removeMissing = (lotIndex, reasonIndex) => {
    setProductDetails({
      type: "REMOVE_MISSING_OBJECT",
      index: lotIndex,
      missingIndex: reasonIndex,
    });
  };

  const changeData = (index, data) => {
    setProductDetails({
      type: "ADD_REMAINING",
      index: index,
      value: data,
    });
  };

  const handleReasonSelectCallback = (lotIndex, missingStockIndex, data) => {
    setProductDetails({
      type: "ADD_MISSING_REASON",
      index: lotIndex,
      missingIndex: missingStockIndex,
      value: data,
    });
  };

  const changeMissingStock = (index, missingStockIndex, data) => {
    setProductDetails({
      type: "ADD_MISSING",
      index: index,
      missingIndex: missingStockIndex,
      value: data,
    });
  };
  const extractionLogic = ({ row, index }) => {
    if (row) {
      return [
        {
          value: null,
          component: () => (
            <Text styles={[Styles.textFontSize6]}>
              {moment(
                new Date(
                  // parseInt(row.lotId.toString().substring(0, 8), 16) * 1000
                  parseInt(
                    row.lotId ? row.lotId.toString().substring(0, 8) : 0,
                    16
                  ) * 1000
                )
              ).format("DD/MM/YYYY") + " "}
            </Text>
          ),
        },
        {
          value: null,
          component: () => (
            <View>
              <TextInput
                value={
                  row.newCaseQty === undefined || row.newCaseQty === null
                    ? ""
                    : `${row.newCaseQty}`
                }
                placeholder={"Enter Case"}
                keyboardType="numeric"
                onChangeText={(e) =>
                  changeData(index, { newCaseQty: Number(e) })
                }
                style={[styles.textInputStyle]}
                // onChangeText={(e) =>
                //   changeData(index, { newCaseQty: Number(e) })
                // }
                // style={styles.textInputStyle}
              ></TextInput>
              <Text style={[styles.color]}>
                {"As per system " + " " + row.noOfCase + "*"}
              </Text>
            </View>
          ),
        },
        {
          value: null,
          component: () => (
            <View>
              <TextInput
                value={
                  row.newProductQty === undefined || row.newProductQty === null
                    ? ""
                    : `${row.newProductQty}`
                }
                placeholder={"Enter Unit"}
                keyboardType="numeric"
                onChangeText={(e) =>
                  changeData(index, { newProductQty: Number(e) })
                }
                style={styles.textInputStyle}
              ></TextInput>
              <Text style={[styles.color]}>
                {"As per system " + " " + row.noOfProduct + "*"}
              </Text>
            </View>
          ),
        },
        {
          value: null,
          component: () => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setIsMissingLotModal({
                    show: true,
                    index: index,
                    missing: row.missingStocks,
                  });
                }}
              >
                <Icon name="info" fill="rgb(67, 66, 93)"></Icon>
              </TouchableOpacity>
            </View>
          ),
        },
      ];
    } else {
      return [];
    }
  };
  const closeModal = () => {
    onSelection(false);
  };
  const onColumnClickHandler = (data) => {};
  const handleCallbackLot = (childData) => {
    setIsMissingLotModal({
      show: false,
    });
  };
  const ExtractionLogicOfMissingLot = ({ row, index }) => {
    var i = isMissingLotModal.index;
    var missing = productDetailsData[i].missingStocks;
    if (row) {
      return [
        {
          value: null,
          component: () => (
            <View>
              <TextInput
                value={
                  row.caseQty === undefined || row.caseQty === null
                    ? ""
                    : `${row.caseQty}`
                }
                placeholder={"Enter Case"}
                keyboardType="numeric"
                onChangeText={(e) =>
                  changeMissingStock(i, index, { caseQty: Number(e) })
                }
                style={styles.textInputStyle}
              ></TextInput>

              {/* <View> */}
              {row.maxCase ? (
                <Text style={{ height: 5 }} style={[styles.color]}>
                  {"Total mismatch case" + " " + row.maxCase + "*"}
                </Text>
              ) : (
                <></>
              )}
            </View>
          ),
        },

        {
          value: null,
          component: () => (
            <View>
              <TextInput
                value={
                  row.productQty === undefined || row.productQty === null
                    ? ""
                    : `${row.productQty}`
                }
                placeholder={"Enter Unit"}
                keyboardType="numeric"
                onChangeText={(e) =>
                  changeMissingStock(i, index, { productQty: Number(e) })
                }
                style={styles.textInputStyle}
              ></TextInput>

              {row.maxProduct ? (
                <Text style={{ height: 5 }} style={[styles.color]}>
                  {"Total mismatch product " + " " + row.maxProduct + "*"}
                </Text>
              ) : (
                <></>
              )}
            </View>
          ),
        },
        {
          value: null,
          component: () => (
            <View style={{ height: 40 }}>
              <PopUp
                onSelection={(data) =>
                  handleReasonSelectCallback(i, index, data)
                }
                selectionValue={row.reason}
                renderData={reasons}
                placeholder="Reason"
                containerStyle={{ flex: 1, minHeight: 40 }}
              ></PopUp>
            </View>
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
              {missing.length > 1 ? (
                <TouchableOpacity onPress={() => removeMissing(i, index)}>
                  <Icon
                    name="delete"
                    fill="red"
                    style={{ width: 20, height: 20 }}
                  ></Icon>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {index === missing.length - 1 ? (
                <TouchableOpacity onPress={() => addToReason(i)}>
                  <Icon
                    name="plus"
                    fill="rgb(67, 66, 93)"
                    style={{ width: 18, height: 18, margin: 5, marginTop: 10 }}
                  ></Icon>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          ),
        },
      ];
    }
  };

  const updateStock = () => {
    let updatedLot = productDetailsData.filter(
      (x) =>
        (x.newProductQty || x.newCaseQty) &&
        (x.noOfProduct !== x.newProductQty || x.noOfCase !== x.newCaseQty)
    );

    if (productDetailsData.length === 0) {
      addError("Unable to save blank data.", 3000);
      return;
    } else if (
      updatedLot.reduce(
        (a, b) =>
          a ||
          (b.newCaseQty && b.invalidCase) ||
          (b.newProductQty && b.invalidProduct),
        false
      )
    ) {
      addError("Invalid data. Please check again.", 3000);
      return;
    }

    let obj = {
      inventoryId: inventoryId,
      products: updatedLot.map((x) => ({
        _id: x._id,
        lotId: x.lotId,
        noOfProduct: x.newProductQty || x.noOfProduct,
        noOfCase: x.newCaseQty || x.noOfCase,
        missingStocks: [
          ...x.missingStocks.map((xx) => ({
            ...xx,
            reason: xx.reason?.name,
            caseQty: xx.caseQty || 0,
            productQty: xx.productQty || 0,
          })),
        ],
      })),
    };
    stockUpdate(obj);
    onSelection(false);
  };

  return (
    <View style={{ flex: 1, minWidth: "65%", maxWidth: "100%" }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              // borderBottomColor: "#87CEEB",
              // borderBottomWidth: 1,
              padding: 10,
            }}
          >
            <Text style={[Styles.h2]}>Stock Management </Text>
          </View>
          <View
            style={{
              margin: 5,
              width: window.width > 1040 ? window.width / 2 : window.width - 20,
              height: window.height / 2,
            }}
          >
            <DataTable
              data={productDetailsData}
              extractionLogic={extractionLogic || []}
              headers={headerItems}
              onClickColumn={onColumnClickHandler}
              headerStyle={[Styles.headerStyle]}
              cellStyle={[Styles.cellStyle]}
              rowStyle={[Styles.rowStyle]}
              width={window.width > 1040 ? window.width / 2 : window.width - 20}
              height={window.height / 2 - 20}
            ></DataTable>
          </View>
          <AddModal
            showModal={isMissingLotModal.show}
            onSelection={handleCallbackLot}
            modalViewStyle={{
              maxHeight: window.width / 2,
              height: window.height / 2,
            }}
            add={
              <View
                style={{
                  width:
                    window.width > 1040 ? window.width / 2 : window.width - 20,
                  height: window.height / 2 - 20,
                  padding: 10,
                }}
              >
                <View style={{ height: 20 }}>
                  <Text style={[Styles.h2]}>Missing</Text>
                </View>
                <DataTable
                  headers={[
                    { value: "Case Quantity", minWidth: 100 },
                    { value: "Units", minWidth: 100 },
                    { value: "Reason ", minWidth: 100 },
                    { value: "Action ", minWidth: 100 },
                  ]}
                  data={
                    isMissingLotModal.show
                      ? productDetailsData[isMissingLotModal.index]
                          .missingStocks
                        ? productDetailsData[isMissingLotModal.index]
                            .missingStocks
                        : []
                      : []
                  }
                  extractionLogic={ExtractionLogicOfMissingLot || []}
                  headerStyle={[Styles.headerStyle]}
                  cellStyle={[Styles.cellStyle]}
                  rowStyle={[Styles.rowStyle]}
                  width={
                    window.width > 1040 ? window.width / 2 : window.width - 20
                  }
                  height={window.height / 2 - 90}
                ></DataTable>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    maxheight: 50,
                  }}
                >
                  <Button
                    style={styles.ButtonStyle}
                    textStyle={{ flexDirection: "row", fontSize: 12 }}
                    title="Save"
                    pressFunc={
                      () => setIsMissingLotModal({ show: false })
                      // oncloseMissingModal()
                    }
                  ></Button>
                </View>
              </View>
            }
          ></AddModal>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <View style={{ margin: 5 }}>
          <Button
            style={styles.ButtonStyle}
            textStyle={{ flex: 1, flexDirection: "row", fontSize: 12 }}
            title="Update Stock"
            pressFunc={() => {
              updateStock();
            }}
          ></Button>
        </View>
        <View style={{ margin: 5 }}>
          <Button
            style={styles.ButtonStyle}
            textStyle={{ flex: 1, flexDirection: "row", fontSize: 12 }}
            title="Cancel"
            pressFunc={() => closeModal(true)}
          ></Button>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  ButtonStyle: {
    maxWidth: "10%",
    marginRight: 10,
  },
  text: {
    marginBottom: "6%",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#43425D",
  },
  textInput: {
    fontSize: 16,
    fontWeight: "normal",
    flex: 1,
    fontSize: 15 * PixelRatio.getFontScale(),
    width: "100%",
    maxHeight: 60,
    minHeight: 40,
    maxWidth: 100,
    margin: 5,
  },
  textInputStyle: {
    // fontWeight: "normal",
    padding: 10,
    color: "black",
    backgroundColor: "#fff",
    flex: 1,
    maxHeight: 40,
    minHeight: 40,
    maxWidth: 400,
    // fontSize: 16,
    borderWidth: 0.5,
    borderColor: "#E8E9EC",
  },
  label: {
    marginLeft: 42,
  },
  placeholderColor: {
    color: "#43325D",
  },
  color: {
    color: "rgb(67, 66, 93)",
    height: Platform.OS === "web" ? 5 : 15,
    position: "absolute",
    right: 0,
    bottom: 10,
    fontSize: 12,
  },
});

const mapStateToProps = ({ selectedFacility, selectedBusiness, reasons }) => ({
  selectedFacility,
  selectedBusiness,
  reasons,
});
export default connect(mapStateToProps, {
  fetchReasons,
  stockUpdate,
  addError,
})(StockManagement);
