import React, { useEffect, useState, useContext, useReducer } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Text,
  TextInput,
  Dimensions,
  PixelRatio,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import Icon from "../../components/common/icon";
import AddModal from "../../components/addModal/addModal";
import moment from "moment";
import {
  rejectReturn,
  acceptReturn,
  assignVehicle,
  deliverReturn,
} from "../../redux/actions/return.action";
import { Styles } from "../../globalStyle";
import { DataTable } from "../../components/dataTable/dataTable";
import { DimensionContext } from "../../components/dimensionContext";
import AssignVehicleComponent from "../../components/orders/assignVehicleComponent";
import ReceiveOrderComponent from "../../components/orders/acceptOrderComponent";
import { addError, addInfo } from "../../redux/actions/toast.action";

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return {
        ...action.data,
        products: action.data.products.map((x) => ({
          ...x,
          acpNoOfCase: x.acpNoOfCase || x.reqNoOfCase,
          acpNoOfProduct: x.acpNoOfProduct || x.reqNoOfProduct,
        })),
      };
    }
    case "PRODUCT_CHANGE": {
      return {
        ...state,
        products: state.products.map((rp, rpi) =>
          rpi === action.index ? { ...rp, ...action.data } : { ...rp }
        ),
      };
    }
    case "REMOVE": {
      return null;
    }
    case "LOT_CHANGE": {
      return {
        ...state,
        products: [
          ...state.products.map((rp, rpi) => {
            if (rpi === action.productIndex) {
              let revisedLotArray = rp.lotArray.map((la, li) => {
                if (li == action.lotIndex) {
                  return { ...la, ...action.data };
                } else {
                  return { ...la };
                }
              });
              action.updateLotArray({
                productIndex: action.productIndex,
                lotArray: revisedLotArray,
              });
              return {
                ...rp,
                acpNoOfCase: revisedLotArray.reduce(
                  (a, b) => a + b.noOfCase,
                  0
                ),
                acpNoOfProduct: revisedLotArray.reduce(
                  (a, b) => a + b.noOfProduct,
                  0
                ),
                lotArray: revisedLotArray,
              };
            } else {
              resolve({ ...rp });
            }
          }),
        ],
      };
    }
    case "PRODUCT_REMOVE": {
      return {
        ...state,
        products: state.products.filter((x, i) => i !== action.index),
      };
    }
    case "LOT_REMOVE": {
      let updatedLot = state.products[action.productIndex]?.lotArray.filter(
        (ld, li) => li !== action.lotIndex
      );
      action.updateLotArray({
        productIndex: action.productIndex,
        lotArray: updatedLot,
      });
      return {
        ...state,
        products: state.products.map((x, i) =>
          i == action.productIndex
            ? {
              ...x,
              lotArray: updatedLot,
              acpNoOfCase: updatedLot?.reduce((a, b) => a + b.noOfCase, 0),
              acpNoOfProduct: updatedLot?.reduce(
                (a, b) => a + b.noOfProduct,
                0
              ),
            }
            : { ...x }
        ),
      };
    }
    default:
      return state;
  }
};

const ReturnDetails = ({
  route,
  returnOrders,
  navigation,
  rejectReturn,
  acceptReturn,
  assignVehicle,
  vehicles,
  selectedFacility,
  deliverReturn,
  addError,
}) => {
  const [returnOrder, setReturnOrder] = useReducer(reducer, null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProductLot, setmMdalProductLot] = useState({});
  const [reject, setReject] = useState(false);
  const [reasonForReject, setReasonForReject] = useState("");
  const [rejectModal, setRejectModal] = useState(false);
  const [headerElements, setHeaderElements] = useState([]);
  const [vehicleModal, viewVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [passwordModal, viewPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const [width, setWidth] = useState(Dimensions.get("window").width - 400);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  let headerElementsLotArray = [
    { value: "Lot", minWidth: 100 },
    { value: "Case Qty", minWidth: 100 },
    { value: "Unit Qty", minWidth: 100 },
    { value: "Action", minWidth: 100 },
  ];
  const { window } = useContext(DimensionContext);

  const onChange = ({ window }) => {
    setWidth(window.width - 400);
    setHeight(window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
      setReturnOrder({ type: "REMOVE" });
      setRejectModal(false);
      setReasonForReject("");
      setHeaderElements([]);
      setPassword("");
    };
  }, []);

  const onChangeInputProduct = (index, data) => {
    setReturnOrder({ type: "PRODUCT_CHANGE", data: data, index: index });
  };
  const onChangeLotInputProduct = (index, data, type) => {
    setReturnOrder({
      type: "LOT_CHANGE",
      data: data,
      lotIndex: index,
      productIndex: modalProductLot.productIndex,
      updateLotArray: setmMdalProductLot,
    });
  };

  const removeProductCallBack = (index) => {
    setReturnOrder({ type: "PRODUCT_REMOVE", index: index });
  };

  const removeProductLotCallBack = (index) => {
    setReturnOrder({
      type: "LOT_REMOVE",
      lotIndex: index,
      productIndex: modalProductLot.productIndex,
      updateLotArray: setmMdalProductLot,
    });
  };

  const DataExtraction = ({ row, index }) => {
    let showAccepted =
      (returnOrder?.status?.name === "Requested" &&
        route.params.type === "Supply") ||
      returnOrder?.status?.name === "Accepted";
    let actionView =
      returnOrder?.status?.name === "Requested" &&
      route.params.type === "Supply";
    return [
      {
        value: null,
        component: () => (
          <View style={styles.textInputStyle}>
            <Text>{row?.product?.name}</Text>
          </View>
        ),
      },
      {
        value: null,
        component: () => {
          return (
            <TextInput
              value={`${row?.reqNoOfCase || 0}`}
              keyboardType="numeric"
              style={styles.textInputStyle}
              editable={false}
            ></TextInput>
          );
        },
      },
      {
        value: null,
        component: () => {
          return (
            <TextInput
              value={`${row?.reqNoOfProduct || 0}`}
              keyboardType="numeric"
              style={styles.textInputStyle}
              editable={false}
            ></TextInput>
          );
        },
      },
      ...(showAccepted
        ? [
          {
            value: null,
            component: () => {
              return (
                <TextInput
                  value={`${row?.acpNoOfCase || 0}`}
                  keyboardType="numeric"
                  style={styles.textInputStyle}
                  editable={returnOrder?.status?.name === "Requested"}
                  onChangeText={(e) => {
                    onChangeInputProduct(index, { acpNoOfCase: e });
                  }}
                ></TextInput>
              );
            },
          },
          {
            value: null,
            component: () => {
              return (
                <TextInput
                  value={`${row?.acpNoOfProduct || 0}`}
                  keyboardType="numeric"
                  style={styles.textInputStyle}
                  editable={returnOrder?.status?.name === "Requested"}
                  onChangeText={(e) => {
                    onChangeInputProduct(index, { acpNoOfProduct: e });
                  }}
                ></TextInput>
              );
            },
          },
        ]
        : []),
      ...(actionView
        ? [
          {
            value: null,
            component: () => (
              <View style={{ flexDirection: "row-reverse" }}>
                {returnOrder.products.length > 1 ? (
                  <TouchableOpacity
                    onPress={() => removeProductCallBack(index)}
                  // style={{ marginTop: 7 }}
                  >
                    <Icon
                      name="remove"
                      fill="#808080"
                      style={{
                        width: 35,
                        height: 35,
                      }}
                    ></Icon>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                    setmMdalProductLot({
                      lotArray: row.lotArray,
                      productIndex: index,
                    });
                  }}
                  style={{ marginTop: 2 }}
                >
                  <Icon
                    name="info"
                    fill="#808080"
                    style={{ width: 35, height: 25 }}
                  ></Icon>
                </TouchableOpacity>
              </View>
            ),
          },
        ]
        : []),
    ];
  };

  const DataExtractionLot = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <View style={styles.textInputStyle}>
            <Text>
              {moment(
                new Date(
                  parseInt(row._id.toString().substring(0, 8), 16) * 1000
                )
              ).format("MMMM Do YYYY, h:mm:ss")}
            </Text>
          </View>
        ),
      },
      {
        value: null,
        component: () => {
          return (
            <TextInput
              value={`${row.noOfCase || 0}`}
              keyboardType="numeric"
              style={styles.textInputStyle}
              editable={returnOrder?.status?.name === "Requested"}
              onChangeText={(e) => {
                onChangeLotInputProduct(index, { noOfCase: Number(e) }, "case");
              }}
            ></TextInput>
          );
        },
      },
      {
        value: null,
        component: () => {
          return (
            <TextInput
              value={`${row.noOfProduct || 0}`}
              keyboardType="numeric"
              style={styles.textInputStyle}
              editable={returnOrder?.status?.name === "Requested"}
              onChangeText={(e) => {
                onChangeLotInputProduct(
                  index,
                  { noOfProduct: Number(e) },
                  "unit"
                );
              }}
            ></TextInput>
          );
        },
      },
      {
        value: null,
        component: () => (
          <View style={{ flexDirection: "row-reverse" }}>
            {returnOrder.products[modalProductLot.productIndex]?.lotArray
              ?.length > 1 ? (
              <TouchableOpacity
                onPress={() => removeProductLotCallBack(index)}
              // style={{ marginTop: 7 }}
              >
                <Icon
                  name="remove"
                  fill="#808080"
                  style={{
                    width: 35,
                    height: 35,
                  }}
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

  const handleCallbackForModal = (data) => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (returnOrders) {
      let toBeReturn = returnOrders.find(
        (x) => x._id === route?.params?.itemId
      );
      setReturnOrder({ type: "INIT", data: toBeReturn });
      if (route.params.type === "Supply") {
        if (toBeReturn.status?.name === "Requested") {
          setHeaderElements([
            { value: "Product Name", minWidth: 100 },
            { value: "Case (Requested)", minWidth: 100 },
            { value: "Unit (Requested)", minWidth: 100 },
            { value: "Case (Accepted)", minWidth: 100 },
            { value: "Unit (Accepted)", minWidth: 100 },
            { value: "Action", minWidth: 100 },
          ]);
        } else {
          setHeaderElements([
            { value: "Product Name", minWidth: 100 },
            { value: "Case (Requested)", minWidth: 100 },
            { value: "Unit (Requested)", minWidth: 100 },
            { value: "Case (Accepted)", minWidth: 100 },
            { value: "Unit (Accepted)", minWidth: 100 },
          ]);
        }
      } else if (route.params.type === "Procurement") {
        if (
          toBeReturn.status?.name === "Requested" ||
          toBeReturn.status?.name === "Rejected"
        ) {
          setHeaderElements([
            { value: "Product Name", minWidth: 100 },
            { value: "Case (Requested)", minWidth: 100 },
            { value: "Unit (Requested)", minWidth: 100 },
          ]);
        } else if (toBeReturn.status.name === "Accepted") {
          setHeaderElements([
            { value: "Product Name", minWidth: 100 },
            { value: "Case (Requested)", minWidth: 100 },
            { value: "Unit (Requested)", minWidth: 100 },
            { value: "Case (Accepted)", minWidth: 100 },
            { value: "Unit (Accepted)", minWidth: 100 },
          ]);
        }
      }
    }
  }, [returnOrders, route]);

  const onReject = () => {
    let rejectObj = {
      returnId: returnOrder._id,
      reason: reasonForReject,
    };
    rejectReturn(rejectObj);
    setRejectModal(false);
    navigation.navigate("returns");
  };

  const accept = () => {
    acceptReturn({
      _id: returnOrder._id,
      products: returnOrder.products.map((x) => ({
        productId: x.product._id,
        lotArray: x.lotArray,
        acpNoOfCase: x.acpNoOfCase,
        acpNoOfProduct: x.acpNoOfProduct,
      })),
    });
  };
  const handleSelectedVehicleCallBack = (childData) => {
    setSelectedVehicle(childData);
  };

  const assignVehicleAndCloseModal = () => {
    assignVehicle({
      facility: selectedFacility._id,
      returnId: returnOrder._id,
      vehicle: selectedVehicle._id,
    });
    viewVehicleModal(false);
  };

  const receieveReturnRequest = () => {
    viewPasswordModal(false);
    deliverReturn({
      _id: returnOrder._id,
      password: password,
    });
    navigation.navigate("returns");
  };

  return (
    <View style={[styles.container, { paddingLeft: 10, paddingRight: 10 }]}>
      <View
        style={[
          {
            width:
              window.width >= 1040
                ? window.width - (320 + 20)
                : window.width - 20,
            minHeight: Math.max(window.height - 84) / 2,
          },
          Styles.tableContainer,
        ]}
      >
        <DataTable
          data={returnOrder?.products ?? []}
          headerStyle={[Styles.headerStyle]}
          cellStyle={[Styles.cellStyle, { padding: 5 }]}
          rowStyle={[Styles.rowStyle]}
          headers={headerElements}
          width={
            window.width > 1040 ? window.width - (320 + 20) : window.width - 40
          }
          height={Math.max(window.height - 84) / 2}
          extractionLogic={DataExtraction}
        ></DataTable>
      </View>
      {returnOrder && route?.params?.type === "Supply" ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingRight: 10,
            paddingTop: 10,
          }}
        >
          {returnOrder?.status?.name === "Requested" ? (
            <View style={{ flexDirection: "row" }}>
              <View>
                <Button
                  title="Reject"
                  pressFunc={() => {
                    setReject(true);
                    setRejectModal(true);
                  }}
                ></Button>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Button
                  title="Accept"
                  pressFunc={() => {
                    if (
                      returnOrder?.products.find(
                        (x) =>
                          !(Number(x.acpNoOfCase) || Number(x.acpNoOfProduct))
                      )
                    ) {
                      addError(
                        "Please remove the products you cannot fulfil.",
                        3000
                      );
                    } else {
                      accept();
                    }
                  }}
                ></Button>
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              {returnOrder.vehicle ? (
                <View style={{ marginLeft: 10 }}>
                  <Button
                    title="Receive"
                    pressFunc={() => viewPasswordModal(true)}
                  ></Button>
                </View>
              ) : (
                <View style={{ marginLeft: 10 }}>
                  <Button
                    style={{ maxWidth: "10%", marginLeft: 10, marginRight: 10 }}
                    title="Assign Vehicle"
                    pressFunc={() => viewVehicleModal(true)}
                  ></Button>
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingRight: 10,
          }}
        >
          {returnOrder?.status?.name === "Accepted" && returnOrder?.vehicle ? (
            <Button
              title="Generate Invoice"
              pressFunc={() =>
                navigation.navigate("return-invoice", {
                  itemId: returnOrder._id,
                })
              }
            ></Button>
          ) : (
            <></>
          )}
        </View>
      )}

      <AddModal
        showModal={rejectModal}
        onSelection={handleCallbackForModal}
        modalViewStyle={{
          minWidth: 150,
          // maxWidth: 400,
          padding: Platform.OS == "web" ? 40 : 0,
          minHeight: 200,
          // maxHeight: 200,
        }}
        add={
          reject ? (
            <View style={{ flex: 1 }}>
              <Text style={{ flex: 1, fontSize: 20 }}>
                Are You Sure to Reject this Return?
              </Text>
              <TextInput
                style={{
                  borderColor: "#7A7C7F",
                  borderWidth: 0.5,
                  minHeight: 100,
                  flex: 1,
                  borderRadius: 5,
                }}
                placeholder="Reason for reject"
                onChangeText={(e) => setReasonForReject(e)}
              ></TextInput>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => onReject()}>
                  <Text
                    style={{
                      color: "#65ACCB",
                      marginRight: 20,
                      fontSize: 18,
                    }}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRejectModal(false)}>
                  <Text style={{ color: "#65ACCB", fontSize: 18 }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <></>
          )
        }
      ></AddModal>
      <AddModal
        showModal={modalVisible}
        onSelection={handleCallbackForModal}
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
              data={modalProductLot.lotArray || []}
              headerStyle={[Styles.headerStyle]}
              cellStyle={[Styles.cellStyle, { padding: 5 }]}
              rowStyle={[Styles.rowStyle]}
              headers={headerElementsLotArray}
              width={
                window.width > 1040 ? window.width / 2 - 20 : window.width - 20
              }
              height={window.height / 2 - 20}
              extractionLogic={DataExtractionLot}
            ></DataTable>
          </View>
        }
      ></AddModal>
      <AddModal
        showModal={vehicleModal}
        onSelection={handleCallbackForModal}
        modalViewStyle={{
          maxWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
                ? window.width / 2
                : window.width <= 641 && window.width >= 500
                  ? window.width / 1.5
                  : window.width <= 500 && window.width >= 360
                    ? window.width / 1.2
                    : window.width - 60,
          minWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
                ? window.width / 2
                : window.width <= 641 && window.width >= 500
                  ? window.width / 1.5
                  : window.width <= 500 && window.width >= 360
                    ? window.width / 1.2
                    : window.width - 60,
          flexDirection: "column",
          padding: 10,
        }}
        add={
          <AssignVehicleComponent
            cancelModalVisible={() => viewVehicleModal(false)}
            selectedVehicleObj={handleSelectedVehicleCallBack}
            onPress={assignVehicleAndCloseModal}
            renderData={vehicles.filter(
              (x) => x.facility === selectedFacility?._id
            )}
            navigation={navigation}
          ></AssignVehicleComponent>
        }
      ></AddModal>
      <AddModal
        showModal={passwordModal}
        onSelection={() => viewPasswordModal(false)}
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
          minHeight: window.height / 2,
        }}
        add={
          <ReceiveOrderComponent
            onChangeText={(e) => setPassword(e)}
            pressFunc={() => receieveReturnRequest()}
          ></ReceiveOrderComponent>
        }
      ></AddModal>
    </View>
  );
};
const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orders: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    maxHeight: 50,
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    alignContent: "center",
  },
  orderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "bold",
    color: "#A3A6B4",
  },
  inputFields: {
    minHeight: 30,
    maxWidth: 100,
  },
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
const mapStateToProps = ({ returnOrders, vehicles, selectedFacility }) => ({
  returnOrders,
  vehicles,
  selectedFacility,
});
export default connect(mapStateToProps, {
  rejectReturn,
  acceptReturn,
  assignVehicle,
  deliverReturn,
  addError,
})(ReturnDetails);