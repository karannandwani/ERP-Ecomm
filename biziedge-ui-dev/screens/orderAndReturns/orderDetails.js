import React, { useState, useEffect, useContext } from "react";
import ProductInventory from "../productInventory/product-inventory";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  PixelRatio,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import CardWithoutGraph from "../../components/common/cards/CardWithoutGraph";
import AddModal from "../../components/addModal/addModal";
import Button from "../../components/common/buttom/button";
import ReceiveOrderComponent from "../../components/orders/acceptOrderComponent";
import { addError, addInfo } from "../../redux/actions/toast.action";
import {
  deliverOrder,
  acceptOrder,
  rejectOrder,
} from "../../redux/actions/order.action";
import { assignVehicle } from "../../redux/actions/assignVehicle.action";
import AssignVehicleComponent from "../../components/orders/assignVehicleComponent";
import AssignDriverComponent from "../../components/orders/assignDriverComponent";
import { DataTable } from "../../components/dataTable/dataTable";
import IdGenerate from "../../util/id-generate";
import { DisplayLot } from "./display-lot";
import DatePicker from "../../components/datePicker/datePicker";
import Icon from "../../components/common/icon";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import InputTextAreaWithBorder from "../../components/textArea/textArea";
import { updateEcommerceOrder } from "../../redux/actions/ecom-order.action";
import FilterComponent from "../../components/filter/filter";
import Pipes from "../../util/pipes";
import moment from "moment";
const OrderDetails = ({
  onChangeFieldHandler,
  product,
  route,
  order,
  selectedFacility,
  deliverOrder,
  acceptOrder,
  rejectOrder,
  navigation,
  vehicles,
  selectedBusiness,
  assignVehicle,
  productCount,
  brandCount,
  inventory,
  addError,
  ecommerceOrders,
  updateEcommerceOrder,
  users,
  addInfo,
  requestQueue,
}) => {
  let idGenerate = new IdGenerate();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState(null);
  const [reject, setReject] = useState(false);
  const [vehicle, setVehicle] = useState(false);
  const [reasonForReject, setReasonForReject] = useState("");
  const [deliver, setDeliver] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [headerElements, setHeaderElements] = useState([]);
  const [isExternal, setIsExternal] = useState(false);
  const [width, setWidth] = useState(Dimensions.get("window").width - 400);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const [editLot, setEditLot] = useState(false);
  const { window } = useContext(DimensionContext);
  const [isLotModal, setIsLotModal] = useState({ show: false, index: null });
  const [ecommerceAceeptModal, viewEcommerceAcceptModal] = useState(null);
  const [expectedDeliveryBy, setExpectedDeliveryDate] = useState(new Date());
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState("12-5");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [procurement, setProcurement] = useState(false);
  const [supplyOrder, setSupplyOrder] = useState(true);
  const [ecommerceOrder, setEcommerceOrder] = useState(false);
  const [filterConfig, setFilterConfig] = useState({
    type: "date",
    valueKey: "",
    value: `${new Date()}`,
    display: "",
    dependsOn: [],
    order: 0,
    defaultValue: "",
    displayLabel: "Date",
    multiple: false,
  });

  let pipe = new Pipes();
  const onChange = ({ window }) => {
    setWidth(window.width - 400);
    setHeight(window.height);
  };
  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
      setIsExternal(false);
      setModalVisible(false);
      setPassword(null);
      setReject(false);
      setVehicle(false);
      setReasonForReject("");
      setDeliver(false);
      setSelectedVehicle("");
      setHeaderElements([]);
    };
  }, []);
  const DataExtraction = ({ row, index }) => {
    let infoIconVisible =
      route.params &&
      (route.params.supplyOrder.toString() === "true" ||
        (route.params.ecommerceOrder.toString() === "true" && row.price)) &&
      selectedOrder.status.name === "Generated";
    let procurement = route.params
      ? route.params.procurement.toString() == "true"
      : false;
    let removable =
      ((route.params &&
        (route.params.supplyOrder.toString() === "true" ||
          (route.params.ecommerceOrder.toString() === "true" && row.price))) ||
        isExternal) &&
      selectedOrder?.products.length > 1 &&
      selectedOrder.status.name === "Generated"
        ? true
        : false;
    let freeProduct =
      selectedOrder.status.name === "Generated" &&
      route.params.ecommerceOrder.toString() === "true" &&
      !row.price;
    return [
      {
        value: null,
        component: () => (
          <View style={styles.textInputStyle}>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {row?.product?.name}
            </Text>
          </View>
        ),
      },
      ...(route.params.ecommerceOrder.toString() === "true"
        ? []
        : [
            {
              value: null,
              component: () => {
                return (
                  <TextInput
                    value={`${row.ordNoOfCase || 0}`}
                    keyboardType="numeric"
                    style={styles.textInputStyle}
                    editable={false}
                    onChangeText={(e) => {
                      onChangeInputProduct(index, { ordNoOfCase: e });
                    }}
                  ></TextInput>
                );
              },
            },
          ]),
      {
        value: null,
        component: () => (
          <TextInput
            value={`${row.ordNoOfProduct || 0}`}
            keyboardType="numeric"
            editable={false}
            onChangeText={(e) =>
              onChangeInputProduct(index, { ordNoOfProduct: e })
            }
            style={styles.textInputStyle}
          ></TextInput>
        ),
      },
      ...(route.params.ecommerceOrder.toString() === "true"
        ? []
        : [
            {
              value: null,
              component: () => {
                return (
                  <TextInput
                    value={`${row.acpNoOfCase || 0}`}
                    style={[
                      styles.textInputStyle,
                      row.exceedMaxCase
                        ? { borderColor: "red", color: "red" }
                        : {},
                    ]}
                    keyboardType="numeric"
                    editable={selectedOrder.status.name === "Generated"}
                    onChangeText={(e) => {
                      onChangeInputProduct(index, { acpNoOfCase: e });
                    }}
                  ></TextInput>
                );
              },
            },
          ]),
      {
        value: null,
        component: () => (
          <TextInput
            value={`${row.acpNoOfProduct || 0}`}
            keyboardType="numeric"
            editable={selectedOrder.status.name === "Generated"}
            onChangeText={(e) => {
              onChangeInputProduct(index, { acpNoOfProduct: e });
            }}
            style={[
              styles.textInputStyle,
              row.exceedMaxUnit ? { borderColor: "red", color: "red" } : {},
            ]}
          ></TextInput>
        ),
      },
      ...(isExternal && procurement
        ? [
            {
              value: null,
              component: () => (
                <TextInput
                  value={`${row.costPrice || ""}`}
                  placeholder={"Cost Price"}
                  keyboardType="numeric"
                  onChangeText={(e) => {
                    onChangeInputProduct(index, { costPrice: e });
                  }}
                  style={styles.textInputStyle}
                ></TextInput>
              ),
            },
            {
              value: null,
              component: () => (
                <TextInput
                  value={`${row.wholesalePrice || ""}`}
                  placeholder={"Wholesale Price"}
                  keyboardType="numeric"
                  onChangeText={(e) => {
                    onChangeInputProduct(index, { wholesalePrice: e });
                  }}
                  style={styles.textInputStyle}
                ></TextInput>
              ),
            },
            {
              value: null,
              component: () => (
                <TextInput
                  value={`${row.retailPrice || ""}`}
                  placeholder={"Retail Price"}
                  keyboardType="numeric"
                  onChangeText={(e) => {
                    onChangeInputProduct(index, { retailPrice: e });
                  }}
                  style={styles.textInputStyle}
                ></TextInput>
              ),
            },
            {
              value: null,
              component: () => (
                <TextInput
                  value={`${row.mrp || ""}`}
                  placeholder={"MRP"}
                  keyboardType="numeric"
                  onChangeText={(e) => {
                    onChangeInputProduct(index, { mrp: e });
                  }}
                  style={styles.textInputStyle}
                ></TextInput>
              ),
            },
            {
              value: null,
              component: () => (
                <TextInput
                  value={`${row.qtyPerCase || ""}`}
                  placeholder={"Qty/Case"}
                  keyboardType="numeric"
                  onChangeText={(e) => {
                    onChangeInputProduct(index, { qtyPerCase: e });
                  }}
                  style={styles.textInputStyle}
                ></TextInput>
              ),
            },
            {
              value: null,
              component: () => (
                <FilterComponent
                  type={"date"}
                  filterConfig={{
                    value: row.expiryDate
                      ? new Date(row.expiryDate)
                      : new Date(),
                  }}
                  onFilterChange={(vv) => {
                    setFilterConfig({ ...filterConfig, value: vv.value });
                    onChangeInputProduct(index, { expiryDate: vv.value });
                  }}
                />
                // <View
                //   style={{
                //     flexDirection: "row",
                //     justifyContent: "space-between",
                //     zIndex: 9,
                //     maxWidth: 60,
                //   }}
                // >
                //   <DatePicker
                //     onChange={(e) => {
                //       onChangeInputProduct(index, { expiryDate: e });
                //     }}
                //     value={row.expiryDate}
                //   />
                // </View>
              ),
            }, //12
          ]
        : []),
      ...(infoIconVisible || removable || freeProduct
        ? [
            {
              value: null,
              component: () => (
                <View
                  style={{ flexDirection: freeProduct ? null : "row-reverse" }}
                >
                  {removable ? (
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
                  {infoIconVisible ? (
                    <TouchableOpacity
                      onPress={() =>
                        setIsLotModal({
                          show: true,
                          index: index,
                        })
                      }
                    >
                      <Icon
                        height={Platform.OS === "web" ? 23 : 28}
                        width={Platform.OS === "web" ? 23 : 28}
                        name="info"
                        fill="#808080"
                        style={{ marginTop: Platform.OS === "web" ? 3 : 2 }}
                      ></Icon>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
                  {freeProduct ? (
                    <View style={{ marginTop: 2 }}>
                      <Text>COMBO FREE</Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              ),
            },
          ]
        : []),
    ];
  };

  var orderDetail =
    route?.params && route?.params.ecommerceOrder.toString() === "true"
      ? ecommerceOrders.find((x) => x._id === route.params.itemId)
      : route?.params.ecommerceOrder.toString() === "false"
      ? order.find((x) => x._id === route.params.itemId)
      : null;

  let lotMap = new Map();

  const addLots = (obj) => {
    return {
      lotId: obj ? obj.lotId : null,
      noOfCase: obj ? obj.noOfCase : null,
      noOfProduct: obj ? obj.noOfProduct : null,
      remainingNoOfCases: obj ? obj.remainingNoOfCases : null,
      remainingNoOfProducts: obj ? obj.remainingNoOfProducts : null,
    };
  };

  const onAddLots = () => {
    setSelectedOrder({
      ...selectedOrder,
      products: selectedOrder?.products.map((pro, index) =>
        index === isLotModal.index
          ? { ...pro, lotArray: [...pro.lotArray, addLots()] }
          : pro
      ),
    });
  };
  const onComparision = (index, totalCase, totalProduct, product) => {
    let acceptedCase = product.acpNoOfCase; //: any;
    let acceptedProduct = product.acpNoOfProduct; //: any;

    if (acceptedCase > totalCase) {
      product.maxNoOfCase = totalCase;
      product.exceedMaxCase = true;
      addError(
        "Accepted case quantity can't exceed total cases available in inventory.",
        3000
      );
    } else {
      product.exceedMaxCase = false;
    }
    if (acceptedProduct > totalProduct) {
      product.maxNoOfProduct = totalProduct;
      product.exceedMaxUnit = true;
      addError(
        "Accepted unit quantity can't exceed total units available in inventory.",
        3000
      );
    } else {
      product.exceedMaxUnit = false;
    }
  };

  const fetchInformation = (i, product, edit) => {
    let productInventory = new ProductInventory();
    let lotArray = [];
    let totalCase = 0;
    let totalProduct = 0;

    if (edit) {
      productInventory.actualLots = product.inventory?.products;
      productInventory.noOfCase = product.acpNoOfCase;
      productInventory.noOfProduct = product.acpNoOfProduct;
    } else {
      product.inventory.products.map((productIndex) => {
        productIndex.procurementDate = new Date(
          parseInt(productIndex?._id?.substring(0, 8), 16) * 1000
        );
        productIndex.forcedNoOfCases = undefined;
        productIndex.forcedNoOfProducts = undefined;
      });

      productInventory.actualLots = product.inventory.products;
      productInventory.noOfCase = product.ordNoOfCase;
      productInventory.noOfProduct = product.ordNoOfProduct;
    }

    while (product.lotArray?.length > 0) {
      product.lotArray.shift();
      product.maxNoOfCase = null;
      product.maxNoOfProduct = null;
    }

    onAddLots(product);
    let aa = productInventory.suggestedLots;
    aa.forEach((lot) => {
      totalCase += lot.allocatedcase;
      totalProduct += lot.allocatedProduct;
      let obj = {
        id:
          route?.params.ecommerceOrder.toString() === "true"
            ? null
            : idGenerate.generateId(
                "L",
                orderDetail.facility.shortName,
                product.product.name
              ),
        noOfCase: lot.allocatedcase,
        noOfProduct: lot.allocatedProduct,
        lotId: lot._id,
        remainingNoOfCases: lot.noOfCase,
        remainingNoOfProducts: lot.noOfProduct,
      };
      lotArray.push(obj);
    });

    if (edit) {
      onComparision(i, totalCase, totalProduct, product);
    } else {
      product.acpNoOfCase = totalCase;
      product.acpNoOfProduct = totalProduct;
    }

    let len = aa.length;
    let temp = product?.lotArray?.length;
    while (len > temp) {
      onAddLots(product);
      len -= 1;
    }
    if (lotArray.length > 0) {
      product.inputExceed =
        lotArray.reduce((a, b) => a + b.noOfCase, 0) < product;
      product.lotArray = lotArray;
    }
    return product;
  };

  const getDate = (lotArray) => {
    let lotDate;
    lotArray.forEach((i) => {
      lotDate = new Date(parseInt(i?._id?.substring(0, 8), 16) * 1000);
      lotArray.forEach((i) => {
        i.lotDate = lotDate;
      });
    });
    return lotArray;
  };

  const setAcceptedLotArray = (tempOrder, product) => {
    let lotArray = [];
    const actProd = tempOrder.products.find((p) => p._id == product._id);
    if (actProd) {
      actProd.lots.map((i) => {
        lotArray.push({
          noOfCase: i.noOfCase,
          noOfProduct: i.noOfProduct,
          lotId: i.lotId,
          remainingNoOfCases: i.noOfCase,
          remainingNoOfProducts: i.noOfProduct,
        });
      });
    }

    while (actProd.lotArray.length > 0) {
      actProd.lotArray.shift();
    }
    lotArray.map((l) => onAddLots(product, l));
    return product;
  };

  useEffect(() => {
    if (route.params) {
      setProcurement(route.params.procurement.toString() === "true");
      setSupplyOrder(route.params.supplyOrder.toString() === "true");
      setEcommerceOrder(route.params.ecommerceOrder.toString() === "true");

      let tempOrder =
        route.params.ecommerceOrder.toString() === "true"
          ? ecommerceOrders.find((o) => o._id === route.params.itemId)
          : order.find((o) => o._id === route.params.itemId);

      let outsideSupplier =
        route.params.procurement.toString() === "true" &&
        !tempOrder?.suppliers.facility
          ? true
          : false;
      tempOrder?.products.forEach((product, index) => {
        if (!outsideSupplier) {
          let prodInv = inventory.find(
            (i) =>
              i.facility === selectedFacility._id &&
              i.product._id === product.product._id
          );
          if (prodInv && prodInv.products.length > 0) {
            lotMap.set(product._id, getDate(prodInv.products));
          }
          product.inventory = prodInv
            ? {
                ...prodInv,
                products: prodInv.products.map((x) => ({
                  ...x,
                  actualNoOfProduct: x.noOfProduct,
                  actualNoOfCase: x.noOfCase,
                })),
              }
            : null;
        }
        product.acpNoOfCase = outsideSupplier
          ? product.ordNoOfCase
          : product.acpNoOfCase
          ? product.acpNoOfCase
          : null;
        product.acpNoOfProduct = outsideSupplier
          ? product.ordNoOfProduct
          : product.acpNoOfProduct
          ? product.acpNoOfProduct
          : null;
        product.maxNoOfCase = null;
        product.maxNoOfProduct = null;
        product.lotArray = outsideSupplier ? null : [addLots(null)];

        if (!outsideSupplier)
          if (
            tempOrder.status.name === "Generated" &&
            product.inventory != null
          ) {
            product = fetchInformation(index, product);
          } else {
            product = setAcceptedLotArray(tempOrder, product);
          }
      });
      setSelectedOrder(tempOrder);
      setHeader(tempOrder);
    }
  }, [route, inventory, order, ecommerceOrders]);

  const setHeader = (orderDetails) => {
    setHeaderElements(
      (((route.params && route.params.supplyOrder.toString() === "true") ||
        isExternal) &&
      orderDetails?.products.length > 1 &&
      orderDetails?.status?.name === "Generated"
        ? true
        : false) ||
        (route.params &&
          route.params.supplyOrder.toString() === "true" &&
          orderDetails?.status?.name === "Generated")
        ? [
            { value: "Product Name", minWidth: 100 },
            { value: "Req Case", minWidth: 100 },
            { value: "Req Units", minWidth: 100 },
            { value: "Case (Accept)", minWidth: 100 },
            { value: "Product (Accept)", minWidth: 100 },
            { value: "Action", minWidth: 100 },
          ]
        : route.params.ecommerceOrder.toString() === "true"
        ? orderDetails.status.name === "Generated"
          ? [
              { value: "Product Name", minWidth: 100 },
              { value: "Req Units", minWidth: 100 },
              { value: "Product (Accept)", minWidth: 100 },
              { value: "Action", minWidth: 100 },
            ]
          : [
              { value: "Product Name", minWidth: 100 },
              { value: "Req Units", minWidth: 100 },
              { value: "Product (Accept)", minWidth: 100 },
            ]
        : [
            { value: "Product Name", minWidth: 100 },
            { value: "Req Case", minWidth: 100 },
            { value: "Req Units", minWidth: 100 },
            { value: "Case (Accept)", minWidth: 100 },
            { value: "Product (Accept)", minWidth: 100 },
          ]
    );
  };
  const handleCallback = () => {
    setModalVisible(false);
  };

  const handleSelectedVehicleCallBack = (childData) => {
    setSelectedVehicle(childData);
  };

  const receiveOrder = () => {
    let obj;
    if (!isExternal) {
      if (!password) {
        addError("Please provide password!", 3000);
      }
      obj = { password: password, id: orderDetail.id };
    } else {
      obj = {
        _id: selectedOrder._id,
        id: selectedOrder.id,
        products: selectedOrder.products.map((x) => ({
          _id: x._id,
          id: idGenerate.generateId(
            "L",
            selectedFacility.shortName,
            x.product.name
          ),
          acpNoOfCase: x.acpNoOfCase,
          acpNoOfProduct: x.acpNoOfProduct,
          costPrice: x.costPrice,
          retailPrice: x.retailPrice,
          wholesalePrice: x.wholesalePrice,
          qtyPerCase: x.qtyPerCase,
          mrp: x.mrp,
          expiryDate: x.expiryDate,
        })),
      };
    }
    route.params = null;
    deliverOrder(obj);
    navigation.navigate("orders");
  };

  const orderRejection = () => {
    let rejectObj = { orderId: orderDetail.id, reason: reasonForReject };
    rejectOrder(rejectObj);
    setModalVisible(false);
  };

  const fulfilEcommerceOrder = () => {
    if (ecommerceAceeptModal.type === "Accept") {
      if (!expectedDeliveryBy) {
        addError("Please provide expected delivery Date first.", 3000);
      } else if (!expectedDeliveryTime) {
        addError("Please provide expected delivery time first.", 3000);
      } else {
        let acceptedProducts = selectedOrder?.products?.map(
          (x) => Number(x.acpNoOfCase) || Number(x.acpNoOfProduct)
        );
        if (
          selectedOrder?.products.find(
            (x) => !(x.acpNoOfCase || x.acpNoOfProduct)
          )
        ) {
          addError(
            "Please provide the accepted unit for those you want to fulfil.",
            3000
          );
        } else {
          let expected = new Date(expectedDeliveryBy);
          expected.setHours(
            expectedDeliveryTime === "8-12"
              ? "8"
              : expectedDeliveryTime === "12-5"
              ? "12"
              : "5",
            "05"
          );
          let obj = {
            products: selectedOrder?.products.map((x) => ({
              productId: x.product._id,
              lots: x.lotArray,
              ordNoOfProduct: x.ordNoOfProduct,
              ordNoOfCase: x.ordNoOfCase,
              acpNoOfCase: x.acpNoOfCase,
              acpNoOfProduct: x.acpNoOfProduct,
              free: !x.price,
            })),
            suppliers: selectedFacility._id,
            _id: selectedOrder._id,
            expectedDeliveryBy: expected,
            id: selectedOrder.id,
            type: "Accept",
          };
          viewEcommerceAcceptModal(null);
          updateEcommerceOrder(obj);
        }
      }
    } else if (ecommerceAceeptModal.type === "Reject") {
      if (!reasonForReject || reasonForReject === "") {
        addError("Please give reason for rejection!", 3000);
      } else {
        updateEcommerceOrder({
          orderId: orderDetail.id,
          reason: reasonForReject,
          type: "Reject",
          _id: selectedOrder._id,
        });
        setReasonForReject("");
        viewEcommerceAcceptModal(null);
        navigation.navigate("orders");
      }
    } else if (ecommerceAceeptModal.type === "Vehicle") {
      updateEcommerceOrder({
        orderId: orderDetail.id,
        vehicle: selectedVehicle._id,
        type: "Vehicle",
        _id: selectedOrder._id,
      });
      setSelectedVehicle(null);
      viewEcommerceAcceptModal(null);
    } else {
      updateEcommerceOrder({
        orderId: orderDetail.id,
        driver: ecommerceAceeptModal.driver,
        type: "Assign Driver",
        _id: selectedOrder._id,
      });
      viewEcommerceAcceptModal(null);
    }
  };

  const assignVehicleAndCloseModal = () => {
    assignVehicle({
      facility: selectedFacility._id,
      orderId: orderDetail.id,
      vehicle: selectedVehicle._id,
    });
    setModalVisible(false);
  };

  const renderCallBack = () => {
    return (
      <View
        style={{ flex: 1 }}
        style={{
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
          padding: 20,
        }}
      >
        {vehicle ? (
          <AssignVehicleComponent
            cancelModalVisible={() => setModalVisible(false)}
            selectedVehicleObj={handleSelectedVehicleCallBack}
            onPress={assignVehicleAndCloseModal}
            renderData={vehicles.filter(
              (x) => x.facility === selectedFacility._id
            )}
            navigation={navigation}
          ></AssignVehicleComponent>
        ) : (
          <></>
        )}
        {reject ? (
          <View style={{ flex: 1 }}>
            <Text style={{ flex: 1, fontSize: 20 }}>
              Are You Sure to Reject this Order?
            </Text>
            {/* <TextInput
              style={{
                borderColor: "#7A7C7F",
                borderWidth: 0.5,
                maxHeight: 40,
                flex: 1,
              }}
              placeholder="Reason for reject"
              onChangeText={(e) => setReasonForReject(e)}
            ></TextInput> */}
            <InputTextAreaWithBorder
              onChangeText={(e) => setDescription(e)}
              style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
              placeholder="Reason for reject"
              multiline={true}
              onChangeText={(e) => setReasonForReject(e)}
              smallTextInputStyle={{
                minHeight: 100,
                minWidth: "97%",
                maxWidth: "97%",
              }}
            ></InputTextAreaWithBorder>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              <TouchableOpacity onPress={() => orderRejection()}>
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
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#65ACCB", fontSize: 18 }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <></>
        )}
        {deliver ? (
          <ReceiveOrderComponent
            onChangeText={(e) => setPassword(e)}
            pressFunc={() => {
              setModalVisible(false);
              receiveOrder();
            }}
          ></ReceiveOrderComponent>
        ) : (
          <></>
        )}
        {ecommerceAceeptModal ? (
          <View style={{ flex: 1 }}>
            {ecommerceAceeptModal.type === "Accept" ? (
              <View style={{ minHeight: 80 }}>
                <Text style={{ flex: 1, fontSize: 20 }}>
                  Please provide expected delivery time?
                </Text>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    borderColor: "#5794f2",
                    backgroundColor: "#5794f2",
                    borderRadius: 5,
                    margin: 5,
                    maxHeight: 32,
                    minWidth: 300,
                    marginTop: 20,
                  }}
                >
                  <FilterComponent
                    type={"date"}
                    filterConfig={{
                      value: expectedDeliveryBy,
                    }}
                    onFilterChange={(vv) => setExpectedDeliveryDate(vv.value)}
                  />
                  <FilterComponent
                    type={"time"}
                    filterConfig={{
                      value: expectedDeliveryTime,
                    }}
                    onFilterChange={(vv) => setExpectedDeliveryTime(vv.value)}
                  />
                </View>
                {/* <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    borderColor: "#5794f2",
                    backgroundColor: "#5794f2",
                    borderRadius: 5,
                    margin: 5,
                    maxHeight: 32,
                    minWidth: 300,
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      padding: 8,
                      alignSelf: "center",
                      color: "#fff",
                      borderRadius: 5,
                    }}
                  >
                    Time
                  </Text>
                  
                </View> */}
              </View>
            ) : ecommerceAceeptModal.type === "Reject" ? (
              <View>
                <Text style={{ flex: 1, fontSize: 20 }}>
                  Are You Sure to Reject this Order?
                </Text>
                <InputTextAreaWithBorder
                  onChangeText={(e) => setReasonForReject(e)}
                  style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
                  placeholder="Reason for reject"
                  multiline={true}
                  smallTextInputStyle={{ minHeight: 100, minWidth: "100%" }}
                ></InputTextAreaWithBorder>
              </View>
            ) : ecommerceAceeptModal.type === "Vehicle" ? (
              <AssignVehicleComponent
                cancelModalVisible={() => viewEcommerceAcceptModal(null)}
                selectedVehicleObj={handleSelectedVehicleCallBack}
                onPress={() => fulfilEcommerceOrder()}
                renderData={vehicles.filter(
                  (x) => x.facility === selectedFacility._id
                )}
                navigation={navigation}
              ></AssignVehicleComponent>
            ) : (
              <AssignDriverComponent
                cancelModalVisible={() => viewEcommerceAcceptModal(null)}
                selectedVehicleObj={(data) =>
                  viewEcommerceAcceptModal({
                    ...ecommerceAceeptModal,
                    driver: data._id,
                  })
                }
                onPress={() => fulfilEcommerceOrder()}
                renderData={users
                  .filter(
                    (x) =>
                      x.facilityId === selectedFacility._id &&
                      x.businessRoleMap
                        .find(
                          (y) =>
                            y.business._id === selectedBusiness.business._id
                        )
                        .roles.find((z) => z.name === "Driver")
                  )
                  .filter(
                    (x) =>
                      x._id !==
                      (selectedOrder.driver ? selectedOrder.driver._id : null)
                  )}
                navigation={navigation}
              ></AssignDriverComponent>
            )}
            {ecommerceAceeptModal.type === "Accept" ||
            ecommerceAceeptModal.type === "Reject" ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: 10,
                  marginRight: 15,
                }}
              >
                <TouchableOpacity onPress={() => fulfilEcommerceOrder()}>
                  <Text
                    style={{
                      color: "#65ACCB",
                      marginRight: 20,
                      fontSize: 18,
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => viewEcommerceAcceptModal(null)}
                >
                  <Text style={{ color: "#65ACCB", fontSize: 18 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  };
  const setConfirmAndExternalMode = () => {
    setIsExternal(true);
    setSelectedOrder({
      ...selectedOrder,
      products: [
        ...selectedOrder.products.map((x) => {
          let inv = inventory.find(
            (xy) =>
              xy.product._id === x.product._id &&
              xy.facility === selectedFacility._id
          );
          if (inv) {
            let lotLength =
              inv.status === "Out Of Stock" ? null : inv.products.length;
            return {
              ...x,
              costPrice: lotLength
                ? inv.products[lotLength - 1]?.costPrice
                : null,
              wholesalePrice: lotLength
                ? inv.products[lotLength - 1]?.wholesalePrice
                : null,
              retailPrice: lotLength
                ? inv.products[lotLength - 1]?.retailPrice
                : null,
              mrp: lotLength ? inv.products[lotLength - 1].mrp : null,
              qtyPerCase: lotLength
                ? inv.products[lotLength - 1].qtyPerCase
                : null,
              expiryDate: new Date(),
            };
          } else {
            return x;
          }
        }),
      ],
    });
    setHeaderElements([
      ...[
        { value: "Product Name", minWidth: 60 },
        { value: "Req Case", minWidth: 60 },
        { value: "Req Units", minWidth: 60 },
        { value: "Case (Accept)", minWidth: 60 },
        { value: "Product (Accept)", minWidth: 60 },
        { value: "Cost Price", minWidth: 60 },
        { value: "Wholesale Price", minWidth: 60 },
        { value: "Retail Price", minWidth: 60 },
        { value: "MRP", minWidth: 60 },
        { value: "QTY/case", minWidth: 60 },
        { value: "Expiry Date", minWidth: 100 },
      ],
      ...(selectedOrder?.products.length > 1
        ? [{ value: "Action", minWidth: 60 }]
        : []),
    ]);
  };

  const onclickInfoHandler = (item) => {
    setEditLot(true);
    setIsLotModal({ show: false, index: null });
  };

  const removeProductCallBack = (index) => {
    setSelectedOrder({
      ...selectedOrder,
      products: [...selectedOrder.products.filter((x, i) => i !== index)],
    });
  };

  const onChangeInputProduct = (productIndex, data) => {
    const newSelectedOrder = data
      ? {
          ...selectedOrder,
          products: selectedOrder.products.map((p, pi) =>
            pi === productIndex
              ? {
                  ...p,
                  ...data,
                }
              : p
          ),
        }
      : {
          ...selectedOrder,
          products: selectedOrder.products.map((p, pi) => p),
        };

    const x = isExternal
      ? newSelectedOrder?.products
      : newSelectedOrder?.products.map((product, index) =>
          index === productIndex
            ? fetchInformation(index, product, true)
            : product
        );
    setSelectedOrder({ ...selectedOrder, products: [...x] });
  };

  const onChangeLotInput = (cases, lot, num, productDataForLot) => {
    if (lot.lotId) {
      if (productDataForLot) {
        cases === "Cases"
          ? (lot.noOfCase = num ? Number(num) : 0)
          : (lot.noOfProduct = num ? Number(num) : 0);
        onLotChange(lot, productDataForLot);
      }
    } else {
      addError("Please select the lot first!", 3000);
    }
  };

  const onSelectLot = (lot, lotIndex) => {
    setSelectedOrder({
      ...selectedOrder,
      products: selectedOrder.products.map((x, ind) =>
        isLotModal.index === ind
          ? {
              ...x,
              lotArray: x.lotArray.map((lott, lotI) =>
                lotI === lotIndex
                  ? {
                      id:
                        route?.params.ecommerceOrder.toString() === "true"
                          ? null
                          : idGenerate.generateId(
                              "L",
                              orderDetail.facility.shortName,
                              x.product.name
                            ),
                      lotId: lot.lotId,
                      noOfCase: null,
                      noOfProduct: null,
                      remainingNoOfCases: null,
                      remainingNoOfProducts: null,
                    }
                  : lott
              ),
            }
          : x
      ),
    });
  };

  const onLotChange = (lot, productDataForLot) => {
    let lotArray = [];
    let productInventory = new ProductInventory();
    productInventory.forcedLotId = lot.lotId;
    productDataForLot.inventory.products.forEach((i) => {
      i.procurementDate = new Date(parseInt(i?._id.substring(0, 8), 16) * 1000);
      if (i._id === lot.lotId) {
        i.forcedNoOfCases = lot.noOfCase;
        i.forcedNoOfProducts = lot.noOfProduct;
      }
    });
    productInventory.actualLots = productDataForLot?.inventory.products;
    productInventory.noOfCase = productDataForLot.ordNoOfCase;
    productInventory.noOfProduct = productDataForLot.ordNoOfProduct;
    let lotFormArray = productDataForLot?.lotArray;

    while (lotFormArray?.length > 0) {
      lotFormArray.shift();
    }
    onAddLots();
    let aa = productInventory?.suggestedLots;
    aa?.forEach((lot) => {
      if (
        lot.forcedNoOfCases > lot.allocatedcase ||
        lot.forcedNoOfProducts > lot.allocatedProduct
      ) {
        addError("Invalid Data", 3000);
      }
      let obj = {
        noOfCase: lot.allocatedcase,
        noOfProduct: lot.allocatedProduct,
        lotId: lot._id,
        remainingNoOfCases: lot.noOfCase,
        remainingNoOfProducts: lot.noOfProduct,
      };
      lotArray.push(obj);
    });

    let len = aa?.length;
    let temp = productDataForLot.lotArray?.length;
    while (len > temp) {
      onAddLots();
      len -= 1;
    }
    temp;
    if (lotArray.length > 0) {
      productDataForLot.lotArray = lotArray;
      setSelectedOrder({
        ...selectedOrder,
        products: selectedOrder.products.map((x) =>
          x._id === productDataForLot._id ? productDataForLot : x
        ),
      });
    } else {
      addError(`Required quantity no`, 3000);
    }
  };

  const removeLot = (lotIndex) => {
    product.lotArray.splice(lotIndex, 1);
  };

  const cancelExternal = () => {
    setIsExternal(false);
    setHeader(selectedOrder);
  };

  const acceptSupplyOrder = () => {
    if (
      selectedOrder?.products.find(
        (x) => !(Number(x.acpNoOfCase) || Number(x.acpNoOfProduct))
      )
    ) {
      addError("Please remove the products you cannot fulfil.", 3000);
    } else if (
      selectedOrder?.products.reduce(
        (a, b) => a || b.exceedMaxCase || b.exceedMaxUnit,
        false
      )
    ) {
      addError(
        "Product (Accept) can't exceed available units in the inventory. Please check availability in Inventory.",
        3000
      );
    } else {
      let obj = {
        business: selectedOrder?.business,
        suppliers: selectedOrder?.suppliers._id,
        facility: selectedOrder?.facility?._id,
        _id: selectedOrder?._id,
        id: selectedOrder.id,
        selectedFacility: selectedFacility._id,
        products: selectedOrder?.products.map((x) => ({
          productId: x.product._id,
          lots: x.lotArray,
          ordNoOfProduct: x.ordNoOfProduct,
          ordNoOfCase: x.ordNoOfCase,
          acpNoOfCase: x.acpNoOfCase,
          acpNoOfProduct: x.acpNoOfProduct,
        })),
      };

      acceptOrder(obj);
    }
  };

  const onCloseLotModal = () => {
    setSelectedOrder({
      ...selectedOrder,
      products: selectedOrder.products.map((x, xi) =>
        xi === isLotModal.index
          ? {
              ...x,
              acpNoOfCase: x.lotArray.reduce((a, b) => a + b.noOfCase, 0),
              acpNoOfProduct: x.lotArray.reduce((a, b) => a + b.noOfProduct, 0),
            }
          : { ...x }
      ),
    });
    setIsLotModal({
      show: false,
      index: null,
    });
  };

  return (
    // <View style={[styles.container]}>

    <View style={[styles.container, { height: window.height - 300 }]}>
      {window.width > 667 ? (
        <View
          style={[
            styles.cardContainer,
            {
              width:
                window.width > 1040
                  ? window.width - (320 + 40)
                  : window.width - 60,
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
        style={[
          {
            width:
              window.width >= 1040
                ? window.width - (320 + 20)
                : window.width - 20,
            minHeight: window.height - 300,
            height: window.height - 300,
            backgroundColor: "#fff",
            marginTop: window.width > 667 ? 20 : 0,
          },
          Styles.tableContainer,
        ]}
      >
        <DataTable
          data={selectedOrder?.products ? selectedOrder?.products : []}
          // isJsx={true}
          headerStyle={[Styles.headerStyle]}
          cellStyle={[Styles.cellStyle, { padding: 5 }]}
          rowStyle={[Styles.rowStyle]}
          headers={headerElements}
          width={
            window.width > 1040 ? window.width - (320 + 40) : window.width - 40
          }
          // height={Math.max(window.height) / 2}
          // minHeight={Math.max(window.height) / 2}
          height={window.height - 300}
          extractionLogic={DataExtraction}
        ></DataTable>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingTop: 10,
          justifyContent: "flex-end",
        }}
      >
        {selectedOrder?.facility?._id == selectedFacility?._id ? (
          <View>
            {!isExternal ? (
              <View>
                <Button
                  title="Receive"
                  pressFunc={() => {
                    orderDetail?.suppliers?.facility == null
                      ? setConfirmAndExternalMode()
                      : setModalVisible(true);
                    setDeliver(true);
                    setReject(false);
                    setVehicle(false);
                  }}
                ></Button>
              </View>
            ) : (
              <></>
            )}
            {isExternal ? (
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginLeft: 10 }}>
                  <Button pressFunc={cancelExternal} title="Cancel"></Button>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Button
                    title="Confirm"
                    pressFunc={() => {
                      receiveOrder();
                    }}
                  ></Button>
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <></>
        )}

        {selectedFacility?.supplierDoc == selectedOrder?.suppliers?._id ? (
          <View>
            {["Accepted", "Vehicle Assigned"].includes(
              selectedOrder?.status?.name
            ) ? (
              <View>
                {selectedOrder?.vehicle == null ? (
                  <View style={{ marginLeft: 10 }}>
                    <Button
                      title="Assign Vehicle"
                      pressFunc={() => {
                        setModalVisible(true);
                        setVehicle(true);
                        setDeliver(false);
                        setReject(false);
                      }}
                    ></Button>
                  </View>
                ) : (
                  <View style={{ marginLeft: 10 }}>
                    <Button
                      title="Generate Invoice"
                      pressFunc={() =>
                        navigation.navigate("orderInvoice", {
                          itemId: orderDetail._id,
                          procurement: procurement,
                          supplyOrder: supplyOrder,
                        })
                      }
                    ></Button>
                  </View>
                )}
              </View>
            ) : selectedOrder?.status?.name === "Generated" &&
              !requestQueue.find(
                (x) =>
                  x?.type === "ACCEPT_ORDER" &&
                  x.payload?.requestOffline?.data?._id === selectedOrder?._id
              ) ? (
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginLeft: 10 }}>
                  <Button
                    title="Accept"
                    pressFunc={() => acceptSupplyOrder()}
                  ></Button>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Button
                    title="Reject"
                    pressFunc={() => {
                      setModalVisible(true);
                      setVehicle(false);
                      setDeliver(false);
                      setReject(true);
                    }}
                  ></Button>
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <></>
        )}

        {ecommerceOrder ? (
          <View>
            {selectedOrder?.status?.name === "Accepted" ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginLeft: 17,
                }}
              >
                <View style={{ marginRight: 2 }}>
                  <Button
                    title="Generate Invoice"
                    pressFunc={() =>
                      navigation.navigate("ecomInvoice", {
                        itemId: selectedOrder._id,
                      })
                    }
                  ></Button>
                </View>
                <View style={{ marginRight: 2 }}>
                  <Button
                    title="Assign Vehicle"
                    pressFunc={() =>
                      viewEcommerceAcceptModal({ type: "Vehicle" })
                    }
                  ></Button>
                </View>
                <View>
                  <Button
                    title={`${
                      selectedOrder && selectedOrder.driver
                        ? "Change "
                        : "Assign "
                    } Driver`}
                    pressFunc={() =>
                      viewEcommerceAcceptModal({ type: "Assign" })
                    }
                  ></Button>
                </View>
              </View>
            ) : selectedOrder?.status?.name === "Generated" ? (
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginLeft: 10 }}>
                  <Button
                    pressFunc={() =>
                      viewEcommerceAcceptModal({ type: "Reject" })
                    }
                    title="Reject"
                  ></Button>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Button
                    title="Accept"
                    pressFunc={() => {
                      viewEcommerceAcceptModal({ type: "Accept" });
                    }}
                  ></Button>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginLeft: 10 }}>
                  <Button
                    title="Generate Invoice"
                    pressFunc={() =>
                      navigation.navigate("ecomInvoice", {
                        itemId: selectedOrder._id,
                      })
                    }
                  ></Button>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Button
                    title={`${
                      selectedOrder && selectedOrder.driver
                        ? "Change "
                        : "Assign "
                    } Driver`}
                    pressFunc={() =>
                      viewEcommerceAcceptModal({ type: "Assign" })
                    }
                  ></Button>
                </View>
              </View>
            )}
          </View>
        ) : (
          <></>
        )}
      </View>
      <AddModal
        showModal={isLotModal.show}
        onSelection={() =>
          setIsLotModal({
            show: false,
            index: null,
          })
        }
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
          borderRadius: 6,
          backgroundColor: "#fefefe",
        }}
        add={
          <DisplayLot
            product={selectedOrder?.products[isLotModal.index]}
            orderStatus={selectedOrder?.status}
            onChangeLotInput={onChangeLotInput}
            modalCallBack={onSelectLot}
            onAddLots={onAddLots}
            textInputStyle={styles.textInputStyle}
            addError={addError}
            onClose={() => onCloseLotModal()}
          ></DisplayLot>
        }
      ></AddModal>
      <AddModal
        showModal={modalVisible}
        onSelection={handleCallback}
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
          maxHeight: window.height / 2,
        }}
        add={renderCallBack()}
      ></AddModal>
      <AddModal
        showModal={ecommerceAceeptModal != null}
        onSelection={() => viewEcommerceAcceptModal(null)}
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
        add={renderCallBack()}
      ></AddModal>

      {ecommerceOrder && selectedOrder?.driver ? (
        <View
          style={{
            alignSelf: "flex-end",
            marginTop: 20,
            backgroundColor: "#ffff",
            minWidth: 200,
            minHeight: 100,
            padding: 10,
          }}
        >
          <Text style={[Styles.h2]}>Assigned Driver</Text>
          <View style={{ flexDirection: "row" }}>
            <Text>Name:</Text>
            <Text>{selectedOrder.driver.name}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>Phone:</Text>
            <Text>{selectedOrder.driver.phone}</Text>
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingLeft: 15,
    fontSize: 16,
    fontWeight: "normal",
    flex: 1,
    fontSize: 15 * PixelRatio.getFontScale(),
    width: "100%",
    maxHeight: 60,
    minHeight: 40,
    maxWidth: 400,
    margin: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: 20,
  },
});

const mapStateToProps = ({
  selectedBusiness,
  order,
  selectedFacility,
  vehicles,
  productCount,
  brandCount,
  inventory,
  ecommerceOrders,
  users,
  requestQueue,
}) => ({
  selectedBusiness,
  order,
  selectedFacility,
  vehicles,
  productCount,
  brandCount,
  inventory,
  ecommerceOrders,
  users,
  requestQueue,
});
export default connect(mapStateToProps, {
  deliverOrder,
  acceptOrder,
  assignVehicle,
  rejectOrder,
  addError,
  updateEcommerceOrder,
  addInfo,
  addError,
})(OrderDetails);
