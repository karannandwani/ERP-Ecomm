import React, { useEffect, useState, useContext, useReducer } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";
import { connect } from "react-redux";
import AddModal from "../../../components/addModal/addModal";
import AutoCompleteModal from "../../../components/common/autocompleteModal/auto-complete-modal";
import Icon from "../../../components/common/icon";
import { fetchProductsWithStock } from "../../../redux/actions/propduct.action";
import DisplayLot from "./display-lot";
import ProductInventory from "../../productInventory/product-inventory";
import { DataTable } from "../../../components/dataTable/dataTable";
import {
  createDraft,
  createBill,
  removeDraftBill,
} from "../../../redux/actions/bill.action";
import { addError } from "../../../redux/actions/toast.action";
import InputboxWithBorder from "../../../components/common/inputBox/inputBoxWithBorder";
import IdGenerate from "../../../util/id-generate";
import { Styles } from "../../../globalStyle";
import { DimensionContext } from "../../../components/dimensionContext";
import Button from "../../../components/common/buttom/button";
import moment from "moment";
import Pipes from "../../../util/pipes";
import Checkbox from "../../../components/common/checkBox/checkbox";

function lotCalculation(billData, productInventory) {
  let lotArray = [];
  let totalCase = 0;
  let totalProduct = 0;
  billData?.inventory?.products.map((i) => {
    i.procurementDate = new Date(parseInt(i?._id?.substring(0, 8), 16) * 1000);
    i.forcedNoOfCases = undefined;
    i.forcedNoOfProducts = undefined;
  });
  productInventory.actualLots = billData.inventory.products;
  productInventory.noOfCase = billData.ordNoOfCase;
  productInventory.noOfProduct = billData.ordNoOfProduct;
  let lotFormArray = billData.lotArray;
  while (lotFormArray.length > 0) {
    lotFormArray.splice(0, 1);
    billData.maxNoOfCase = "";
    billData.maxNoOfProduct = "";
  }
  billData.lotArray.push({
    lotId: "",
    ordNoOfCase: "",
    ordNoOfProduct: "",
    remainingNoOfCases: "",
    remainingNoOfProducts: "",
  });

  let aa = productInventory.suggestedLots;
  let productPrice = 0,
    taxPrice = 0;
  aa.forEach((lot) => {
    let total =
      (lot.allocatedcase * lot.qtyPerCase + lot.allocatedProduct) *
      lot.retailPrice;

    totalCase += lot.allocatedcase;
    totalProduct += lot.allocatedProduct;
    let obj1 = {
      noOfCase: lot.allocatedcase,
      noOfProduct: lot.allocatedProduct,
      lotId: lot._id,
      remainingNoOfCases: lot.noOfCase,
      remainingNoOfProducts: lot.noOfProduct,
      costPrice: lot.costPrice,
      retailPrice: lot.retailPrice,
      qtyPerCase: lot.qtyPerCase,
      tax: billData.product.hsnTaxes
        .filter((x) => x.name !== "IGST")
        .map((x) => ({
          type: x.name,
          percent: x.percentage,
          amount: x.percentage * total * 0.01,
        })),
    };
    lotArray.push(obj1);

    productPrice += total;

    taxPrice +=
      (total *
        (billData.product.hsnTaxes
          .filter((x) => x.name !== "IGST")
          .reduce((a, b) => a + b.percentage, 0) +
          billData.product.tax.reduce((a, b) => a + b.percentage, 0))) /
      100;
  });
  billData.productTotal = productPrice;
  billData.productTax = taxPrice;
  if (productInventory.noOfCase > totalCase) {
    billData.maxNoOfCase = totalCase;
  }
  if (productInventory.noOfProduct > totalProduct) {
    billData.maxNoOfProduct = totalProduct;
  }
  let len = aa.length;
  let temp = billData.lotArray.length;
  while (len > temp) {
    // onAddLots(billData);
    billData.lotArray.push({
      lotId: "",
      ordNoOfCase: "",
      ordNoOfProduct: "",
      remainingNoOfCases: "",
      remainingNoOfProducts: "",
    });
    len -= 1;
  }
  if (lotArray.length > 0) {
    billData.lotArray = lotArray;
  }
  return billData;
}

function reducer(state, action) {
  switch (action.type) {
    case "add_Product":
      return { ...state, products: [...state.products, { ...action.value }] };
    case "oDraftChoose":
      let data = action.value;
      let newProducts = data.draft.products.map((x) =>
        lotCalculation(
          {
            ...x,
            inventory: data.prodInv.find(
              (i) =>
                i.facility === data.selectedFacility &&
                i.product._id === x.product._id
            ),
            lotArray: data.lotArray,
            product: data.filteredProducts.find((y) => y._id === x.product._id),
            isValid: "",
          },
          data.productInventory
        )
      );
      let productTotals = newProducts.reduce((a, b) => a + b.productTotal, 0);
      let taxTotals = newProducts.reduce((a, b) => a + b.productTax, 0);
      return {
        ...state,
        products: newProducts,
        price: productTotals,
        totalTax: taxTotals,
        subTotal: productTotals + taxTotals,
      };
    case "onDiscount":
      return {
        ...state,
        discountValue: action.value,
        discount:
          state.discountType === "flat"
            ? action.value
            : (action.value * state.subTotal) / 100,
      };
    case "forcedDiscount":
      return { ...state, forcedDiscount: action.value };
    case "discountType":
      return {
        ...state,
        discountType: action.value,
        discount: state.discountValue
          ? action.value === "percent"
            ? (state.discountValue * state.subTotal) / 100
            : state.discountValue
          : state.discount,
      };
    case "on_Select_Product":
      let obj = {
        name: action.value.selectedItem.name,
        product: action.value.selectedItem,
        inventory: action.value.prodInv || null,
        ordNoOfCase: "",
        ordNoOfProduct: "",
        maxNoOfCase: "",
        maxNoOfProduct: "",
        isValid: false,
      };
      return {
        ...state,
        products: state.products.map((x, index) =>
          index === action.value.index ? { ...x, ...obj } : x
        ),
      };
    case "on_changeInput_Product":
      let bill = state.products[action.value.index];
      if (action.value.data.ordNoOfProduct != null) {
        bill.ordNoOfProduct = action.value.data.ordNoOfProduct || null;
      }
      if (action.value.data.ordNoOfCase != null) {
        bill.ordNoOfCase = action.value.data.ordNoOfCase || null;
      }
      lotCalculation(bill, action.value.productInventory);
      let productTotal = state.products.reduce((a, b) => a + b.productTotal, 0);
      let taxTotal = state.products.reduce((a, b) => a + b.productTax, 0);
      return {
        ...state,
        price: productTotal,
        totalTax: taxTotal,
        subTotal: productTotal + taxTotal,
        products: state.products.map((p, i) =>
          i === action.value.index
            ? {
                ...p,
                lotArray: p.lotArray.map((x) => x),
                isValid: p.maxNoOfCase || p.maxNoOfProduct,
              }
            : p
        ),
      };
    case "on_changeLotInput_Product":
      let productInventory = action.value.productInventory;
      let lot = action.value.lot;
      let bills = state.products[action.value.productIndex];
      productInventory.forcedLotId = action.value.lot.lotId;
      let lotArrays = [];
      bills.inventory.products.forEach((i) => {
        i.procurementDate = new Date(
          parseInt(i?._id.substring(0, 8), 16) * 1000
        );
        if (i._id === lot.lotId) {
          i.forcedNoOfCases = lot.noOfCase;
          i.forcedNoOfProducts = lot.noOfProduct;
        }
      });
      productInventory.actualLots = bills?.inventory.products;
      productInventory.noOfCase = bills.ordNoOfCase;
      productInventory.noOfProduct = bills.ordNoOfProduct;
      let lotFormArrays = bills?.lotArray;

      while (lotFormArrays?.length > 0) {
        lotFormArrays.shift();
      }
      bills.lotArray.push({
        lotId: "",
        ordNoOfCase: "",
        ordNoOfProduct: "",
        remainingNoOfCases: "",
        remainingNoOfProducts: "",
      });

      let aaa = productInventory?.suggestedLots;
      aaa?.forEach((lot) => {
        let obj = {
          noOfCase: lot.allocatedcase,
          noOfProduct: lot.allocatedProduct,
          lotId: lot._id,
          remainingNoOfCases: lot.noOfCase,
          remainingNoOfProducts: lot.noOfProduct,
        };
        lotArrays.push(obj);
      });

      let lens = aaa?.length;
      let temps = bills.lotArray?.length;
      while (lens > temps) {
        bills.lotArray.push({
          lotId: "",
          ordNoOfCase: "",
          ordNoOfProduct: "",
          remainingNoOfCases: "",
          remainingNoOfProducts: "",
        });

        lens -= 1;
      }
      if (lotArrays.length > 0) {
        bills.lotArray = lotArrays;
        return {
          ...state,
          products: state.products.map((x) =>
            x._id === bills._id ? bills : x
          ),
        };
      } else {
        return state;
      }
    case "on_addLot_Product":
      return {
        ...state,
        products: state.products.map((p, pI) =>
          pI === action.value.productIndex
            ? {
                ...p,
                lotArray: [
                  ...p.lotArray,
                  {
                    lotId: "",
                    ordNoOfCase: "",
                    ordNoOfProduct: "",
                    remainingNoOfCases: "",
                    remainingNoOfProducts: "",
                  },
                ],
              }
            : p
        ),
      };
    case "on_lotChange":
      return {
        ...state,
        products: state.products.map((p, pi) =>
          pi == action.value.productIndex
            ? {
                ...p,
                lotArray: p.lotArray.map((l, li) =>
                  li === action.value.lotIndex
                    ? { ...l, lotId: action.value.lot._id }
                    : { ...l }
                ),
              }
            : { ...p }
        ),
      };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((x, i) => i !== action.value.index),
      };
    case "reset":
      return {
        ...action.value,
      };
    //   return {
    //   setBillData({
    //     ...state,
    //     products: ...state.products.filter((x, i) => i !== index),
    //   })
    // };
    default:
      return state;
  }
}

const CreateBill = ({
  selectedBusiness,
  selectedFacility,
  inventory,
  navigation,
  createDraft,
  createBill,
  products,
  coupon,
  addError,
  draftBills,
  removeDraftBill,
}) => {
  let pipe = new Pipes();

  const addLotArray = () => {
    return {
      lotId: "",
      ordNoOfCase: "",
      ordNoOfProduct: "",
      remainingNoOfCases: "",
      remainingNoOfProducts: "",
    };
  };
  let obj = {
    product: "",
    name: "",
    inventory: "",
    ordNoOfCase: "",
    ordNoOfProduct: "",
    maxNoOfCase: "",
    maxNoOfProduct: "",
    lotArray: [addLotArray()],
  };
  let posObj = {
    price: null,
    totalTax: null,
    subTotal: null,
    discountValue: 0,
    discount: 0,
    discountType: "flat",
    forcedDiscount: false,
    products: [
      {
        product: null,
        name: null,
        inventory: null,
        ordNoOfCase: "",
        ordNoOfProduct: "",
        maxNoOfCase: null,
        maxNoOfProduct: null,
        lotArray: [addLotArray()],
        productTotal: 0,
        productTax: 0,
      },
    ],
  };
  let productInventory = new ProductInventory();
  let idGenerate = new IdGenerate();
  const [excludeIds, setExcludeIds] = useState([]);
  const [isLotModal, setIsLotModal] = useState({ show: false, index: null });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { window } = useContext(DimensionContext);
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const [draftBillList, setDraftBillList] = useState([]);
  const [billData, setBillData] = useReducer(reducer, posObj);
  const [invalid, isInvalid] = useState(false);
  const onChange = ({ window }) => {
    setWidth(window.width - 400);
    setHeight(window.height);
  };
  const [discountAlertModal, setDiscountAlert] = useState(false);

  const getDate = (lotArray) => {
    if (lotArray) {
      let lotDate;
      lotArray.forEach((i) => {
        lotDate = new Date(
          parseInt(i?._id.toString().substring(0, 8), 16) * 1000
        );
        lotArray.forEach((i) => {
          i.lotDate = lotDate;
        });
      });
      return lotArray;
    } else {
      return [];
    }
  };

  const removeItem = async (index) => {
    setBillData({
      type: "REMOVE_PRODUCT",
      value: {
        index: index,
      },
    });
    // setBillData({
    //   ...billData,
    //   products: [...billData.products.filter((x, i) => i !== index)],
    // });
  };
  //Applying Coupon//

  const [selectedCoupon, setSelectedCoupon] = useState("");

  useEffect(() => {
    if (selectedFacility) {
      setDraftBillList([
        ...draftBills.filter((x) => x.suppliers === selectedFacility._id),
      ]);
    }
  }, [selectedFacility, draftBills]);

  let couponValue = coupon.map((element) => {
    if (element.name === selectedCoupon) {
      return element.discountAmount;
    }
  });

  let discounttype = coupon.find((element) => {
    if (element.name === selectedCoupon) {
      return element.discountType;
    }
  });

  const BillLineItem = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <AutoCompleteModal
            onSelection={(result) =>
              onSelectProductModalCallBack(result, index)
            }
            searchApi={searchProductByPhrase}
            renderData={filteredProducts.filter(
              (x) =>
                !billData.products
                  .filter((x, xi) => xi !== index)
                  .map((y) => y.product?._id)
                  .includes(x._id)
            )}
            isSubmitButtom={true}
            name={`Product`}
            displayField={"name"}
            data={
              row.product?.name
                ? {
                    data: filteredProducts.find(
                      (x) => x._id === row.product._id
                    ),
                    displayField: "name",
                  }
                : ""
            }
            value={
              row.product?.name
                ? filteredProducts.find((x) => x._id === row.product._id)
                : ""
            }
            textInputStyle={
              invalid
                ? { color: "red", borderColor: "red" }
                : { backgroundColor: "#fff" }
            }
          ></AutoCompleteModal>
        ),
      },
      {
        value: null,
        component: () => (
          <TextInput
            placeholder={"Required Case"}
            value={row.ordNoOfCase ? `${row.ordNoOfCase}` : ""}
            keyboardType={"numeric"}
            onChangeText={(e) => {
              if (e == "" || !isNaN(e)) {
                if (invalid) {
                  isInvalid(false);
                }
                onChangeProductInput(index, { ordNoOfCase: e === "" ? 0 : e });
              } else {
                addError("Insert numbers only", 3000);
              }
            }}
            onBlur={() => {
              fetchPrice();
            }}
            style={[
              styles.textInputStyle,
              {
                textDecorationLine:
                  row.maxNoOfCase || row.maxNoOfProduct === 0
                    ? "line-through"
                    : "none",
              },
              invalid ? { color: "red", borderColor: "red" } : {},
            ]}
          ></TextInput>
        ),
      },
      {
        value: null,
        component: () => (
          <TextInput
            placeholder={"Required Units"}
            value={row.ordNoOfProduct ? `${row.ordNoOfProduct}` : ""}
            keyboardType={"numeric"}
            onChangeText={(e) => {
              if (e == "" || !isNaN(e)) {
                if (invalid) {
                  isInvalid(false);
                }
                onChangeProductInput(index, {
                  ordNoOfProduct: e === "" ? 0 : e,
                });
              } else {
                addError("Insert numbers only", 3000);
              }
            }}
            onBlur={() => {
              fetchPrice();
            }}
            style={[
              styles.textInputStyle,
              {
                textDecorationLine:
                  row.maxNoOfProduct || row.maxNoOfProduct === 0
                    ? "line-through"
                    : "none",
              },
              invalid ? { color: "red", borderColor: "red" } : {},
            ]}
          ></TextInput>
        ),
      },
      {
        value: null,
        component: () => (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent:
                billData.products.length > 1 ||
                row.maxNoOfProduct ||
                row.maxNoOfCase
                  ? "space-between"
                  : "center",
              alignItems: "center",
              backgroundColor: "#fff",
              height: 38,
              borderWidth: 1,
              borderColor: "#E8E9EC",
            }}
          >
            <View style={{ paddingLeft: 5 }}>
              {row.maxNoOfCase ? (
                <View>
                  <Text
                    style={{
                      fontSize: window.width >= 667 ? 12 : 8,
                      color: "red",
                    }}
                  >
                    Max.NOC:{row.maxNoOfCase}
                  </Text>
                </View>
              ) : (
                <></>
              )}
              {row.maxNoOfProduct ? (
                <View>
                  <Text
                    style={{
                      fontSize: window.width >= 667 ? 12 : 8,
                      color: "red",
                    }}
                  >
                    Max.NOP:{row.maxNoOfProduct}
                  </Text>
                </View>
              ) : (
                <></>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              {billData.products.length > 1 ? (
                <TouchableOpacity onPress={() => removeItem(index)}>
                  <Icon
                    name="remove"
                    fill="#808080"
                    style={{ width: 33, height: 33 }}
                  ></Icon>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (row.product?._id) {
                    setIsLotModal({
                      show: true,
                      index: index,
                    });
                    setIsModalDisplay(true);
                  } else {
                    addError("Choose Prodcut 1st", 3000);
                  }
                }}
              >
                <Icon
                  name="info"
                  fill={row.isValid === "" ? "#808080" : "red"}
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: billData.products.length > 1 ? 1 : 0,
                  }}
                ></Icon>
              </TouchableOpacity>
            </View>
          </View>
        ),
      },
    ];
  };

  const onSelectProductModalCallBack = (selectedItem, index) => {
    if (invalid) {
      isInvalid(false);
    }
    if (selectedItem) {
      let prodInv = inventory.find(
        (i) =>
          i.facility === selectedFacility._id &&
          i.product._id === selectedItem._id
      );
      setExcludeIds([...excludeIds, selectedItem._id]);
      setBillData({
        type: "on_Select_Product",
        value: {
          selectedItem: selectedItem,
          prodInv: {
            ...prodInv,
            products: prodInv.products.map((x) => ({
              ...x,
              actualNoOfCase: x.noOfCase,
              actualNoOfProduct: x.noOfProduct,
            })),
          },
          index: index,
        },
      });
    }
  };

  useEffect(() => {
    if (inventory.length > 0) {
      setFilteredProducts([
        ...inventory
          .filter(
            (x) =>
              x.facility === selectedFacility._id &&
              x.products.length > 0 &&
              Object.keys(x.products[0]).length > 0
          )
          .map((x) => x.product),
      ]);
    }
  }, [inventory]);

  const searchProductByPhrase = (phrase) => {
    // !excludeIds.includes(x._id) && -to be added in filter
    setFilteredProducts([
      ...products.filter((x) =>
        x.name.toLowerCase().startsWith(phrase.toLowerCase())
      ),
    ]);
  };

  const addBill = () => {
    if (
      billData.products.filter((x) => x.ordNoOfCase || x.ordNoOfProduct)
        .length > 0
    ) {
      let obj1 = {
        id: idGenerate.generateId("B", selectedFacility.shortName, ""),
        products: billData.products
          .filter((x) => x.ordNoOfCase !== null && x.ordNoOfProduct !== null)
          .map((x, index) => ({
            product: x.product._id,
            ordNoOfProduct: x.ordNoOfProduct,
            ordNoOfCase: x.ordNoOfCase,
            lotArray: x.lotArray,
            productDetails: { name: x.product.name },
            extraTax: [],
            lots: x.lotArray,
          })),
        suppliers: selectedFacility._id,
        business: selectedBusiness.business._id,
        forcedDiscount: billData.forcedDiscount,
        discount: billData.discount,
        subTotal: billData.subTotal - billData.discount,
        type: "Bill",
        createdAt: new Date(),
      };
      createBill(obj1);
      setBillData(posObj);
      navigation.navigate("pos");
    } else {
      isInvalid(true);
      addError("Please add some product to create a bill", 3000);
    }
  };

  const saveDraft = () => {
    if (
      billData.products.filter((x) => x.ordNoOfCase || x.ordNoOfProduct)
        .length > 0
    ) {
      let objData = {
        email: "",
        products: billData.products
          .filter((x) => x.ordNoOfCase || x.ordNoOfProduct)
          .map((x) => ({
            product: x.product._id,
            ordNoOfProduct: x.ordNoOfProduct ? x.ordNoOfProduct : 0,
            ordNoOfCase: x.ordNoOfCase ? x.ordNoOfCase : 0,
          })),
        suppliers: selectedFacility._id,
        business: selectedBusiness.business._id,
        forcedDiscount: billData.forcedDiscount,
      };
      setBillData(posObj);
      createDraft(objData);
      navigation.navigate("pos");
    } else {
      isInvalid(true);
      addError("Please add some product to mark as draft", 3000);
    }
  };

  const checkNumber = (data) => {
    let newText = "";
    let numbers = "0123456789";
    let text = "";
    if (data.ordNoOfCase) {
      text = data.ordNoOfCase;
    }

    if (data.ordNoOfProduct) {
      text = data.ordNoOfProduct;
    }

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        addError("please enter numbers only", 3000);
        return;
      }
    }
  };
  const onChangeProductInput = (productIndex, data) => {
    checkNumber(data);
    setBillData({
      type: "on_changeInput_Product",
      value: {
        data: data,
        index: productIndex,
        productInventory: productInventory,
      },
    });
  };

  const onAddLotsData = (productIndex) => {
    if (isNaN(productIndex) || productIndex === "Close") {
      setIsLotModal({ show: false, index: null });
    } else {
      let selectedProduct = billData.products[productIndex];
      if (
        selectedProduct.inventory.products.length ===
        selectedProduct.lotArray.length
      ) {
        addError("There is no more Lots Available!", 3000);
      } else {
        setBillData({
          type: "on_addLot_Product",
          value: {
            productIndex: productIndex,
          },
        });
      }
    }
  };

  const onSelectLot = (productIndex, result, index) => {
    setBillData({
      type: "on_lotChange",
      value: {
        productIndex: productIndex,
        lot: result,
        lotIndex: index,
      },
    });
  };

  const onChangeLotInput = (num, productIndex, index, lot, cases) => {
    if (lot.lotId) {
      cases === "NoOfCaseInput"
        ? (lot.noOfCase = Number(num || 0))
        : (lot.noOfProduct = Number(num || 0));
      setBillData({
        type: "on_changeLotInput_Product",
        value: {
          productIndex: productIndex,
          lot: lot,
          lotIndex: index,
          productInventory: productInventory,
        },
      });
    } else {
      addError("Choose the lot first!", 3000);
    }
  };

  const onLotChange = (lot, productDataForLot) => {
    let lotArray = [];
    let productInventory = new ProductInventory();
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
    if (lotArray.length > 0) {
      productDataForLot.lotArray = lotArray;
      setSelectedOrder({
        ...selectedOrder,
        products: selectedOrder.products.map((x) =>
          x._id === productDataForLot._id ? productDataForLot : x
        ),
      });
    }
  };

  const calculateDiscount = () => {
    let costPrice = 0,
      retailPrice = 0,
      discountPrice = 0;
    for (let index = 0; index < billData.products.length; index++) {
      const product = billData.products[index];
      for (let index = 0; index < product.lotArray.length; index++) {
        const lot = product.lotArray[index];
        costPrice +=
          lot.costPrice * (lot.qtyPerCase * lot.noOfCase + lot.noOfProduct);
        retailPrice +=
          lot.retailPrice * (lot.qtyPerCase * lot.noOfCase + lot.noOfProduct);
      }
    }
    discountPrice = retailPrice - costPrice;
    if (billData.discount > discountPrice) {
      setBillData({
        type: "forcedDiscount",
        value: true,
      });
      setDiscountAlert(true);
    } else {
      addBill();
    }
  };

  const closeModal = () => {
    setDiscountAlert(false);
  };
  const fetchInformation = (index) => {
    let lotArray = [];
    let totalCase = 0;
    let totalProduct = 0;
    const bill = billData.products[index];
    bill?.inventory?.products.map((i) => {
      i.procurementDate = new Date(
        parseInt(i?._id?.substring(0, 8), 16) * 1000
      );
      i.forcedNoOfCases = undefined;
      i.forcedNoOfProducts = undefined;
    });

    productInventory.actualLots = bill.inventory.products;
    productInventory.noOfCase = bill.ordNoOfCase;
    productInventory.noOfProduct = bill.ordNoOfProduct;
    let lotFormArray = bill.lotArray;
    while (lotFormArray.length > 0) {
      lotFormArray.splice(0, 1);
      bill.maxNoOfCase = null;
      bill.maxNoOfProduct = null;
    }
    onAddLots(bill);
    let aa = productInventory.suggestedLots;
    let productPrice = 0,
      taxPrice = 0;
    aa.forEach((lot) => {
      totalCase += lot.allocatedcase;
      totalProduct += lot.allocatedProduct;
      let obj1 = {
        noOfCase: lot.allocatedcase,
        noOfProduct: lot.allocatedProduct,
        lotId: lot._id,
        remainingNoOfCases: lot.noOfCase,
        remainingNoOfProducts: lot.noOfProduct,
        costPrice: lot.costPrice,
        retailPrice: lot.retailPrice,
        qtyPerCase: lot.qtyPerCase,
      };
      lotArray.push(obj1);
      let total =
        (lot.allocatedcase * lot.qtyPerCase + lot.allocatedProduct) *
        lot.retailPrice;

      productPrice += total;

      taxPrice +=
        (total *
          (bill.product.hsnTaxes
            .filter((x) => x.name !== "IGST")
            .reduce((a, b) => a + b.percentage, 0) +
            bill.product.tax.reduce((a, b) => a + b.percentage, 0))) /
        100;
    });
    bill.productTotal = productPrice;
    bill.productTax = taxPrice;
    if (productInventory.noOfCase > totalCase) {
      bill.maxNoOfCase = totalCase;
    }
    if (productInventory.noOfProduct > totalProduct) {
      bill.maxNoOfProduct = totalProduct;
    }
    let len = aa.length;
    let temp = bill.lotArray.length;
    while (len > temp) {
      onAddLots(bill);
      len -= 1;
    }
    if (lotArray.length > 0) {
      bill.lotArray = lotArray;
    }
    let productTotal = billData.products.reduce(
      (a, b) => a + b.productTotal,
      0
    );
    let taxTotal = billData.products.reduce((a, b) => a + b.productTax, 0);
    setBillData({
      ...billData,
      price: productTotal,
      totalTax: taxTotal,
      subTotal: productTotal + taxTotal,
      products: billData.products.map((p, i) =>
        i === index ? { ...p, lotArray: p.lotArray.map((x) => x) } : p
      ),
    });
  };

  const fetchPrice = () => {};
  const handleCallback = (data) => {
    // setSelectedData(data);
    setIsModalDisplay({ show: false, index: null });
  };

  function vw(percentageWidth) {
    return window.width * (percentageWidth / 100);
  }

  function vh(percentageHeight) {
    return window.height * (percentageHeight / 100);
  }

  const COLUMNS = 3;
  const MARGIN = vw(1);
  const SPACING = ((COLUMNS + 1) / COLUMNS) * MARGIN;

  const grid = {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
  };

  const cell = {
    // marginLeft: MARGIN,
    // marginTop: MARGIN,
    maxWidth: vw(100) / COLUMNS - SPACING,
  };
  const selectDraft = (draft) => {
    setBillData({
      type: "oDraftChoose",
      value: {
        draft: draft,
        prodInv: inventory,
        productInventory: productInventory,
        selectedFacility: selectedFacility._id,
        filteredProducts: filteredProducts,
        lotArray: [
          {
            lotId: "",
            ordNoOfCase: "",
            ordNoOfProduct: "",
            remainingNoOfCases: "",
            remainingNoOfProducts: "",
          },
        ],
      },
    });
    removeDraftBill(draft._id);
  };

  return (
    <View style={[Styles.container]}>
      {/* <View style={[{ flexDirection: "column" }, Styles.marginTopTen]}>
        <View style={grid}> */}
      {draftBillList.length > 0 ? (
        <View
          style={{
            justifyContent: "space-between",
            minWidth: 150,
            marginBottom: 10,
            borderBottomColor: "#E8E9EC",
            borderBottomWidth: 1,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Draft Orders</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: 5,
              marginTop: 5,
            }}
          >
            {draftBillList.map((thing) => (
              <View
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 20,
                    backgroundColor: "#DBDBDB",
                    marginLeft: 5,
                    justifyContent: "space-between",
                    marginTop: 2,
                    marginBottom: 5,
                    padding: 5,
                  },
                  // cell,
                ]}
              >
                <TouchableOpacity onPress={() => selectDraft(thing)}>
                  <Text>
                    {moment(
                      new Date(
                        parseInt(thing._id.toString().substring(0, 8), 16) *
                          1000
                      )
                    ).format("MMMM Do YYYY, h:mm:ss a") + " "}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingTop: 5,
                    marginLeft: 5,
                  }}
                  onPress={() => removeDraftBill(thing._id)}
                >
                  <Icon fill="black" name="remove"></Icon>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <></>
      )}
      {/* </View> */}
      <View
        style={[
          {
            width:
              window.width >= 1040
                ? window.width - (320 + 20)
                : window.width - 20,
            maxHeight: Math.max((window.height - 84) / 2),
            height: Math.max((window.height - 84) / 2),
          },
          Styles.tableContainer,
        ]}
      >
        <DataTable
          data={billData.products ? billData.products : []}
          extractionLogic={BillLineItem}
          headerStyle={[Styles.headerStyle]}
          cellStyle={[Styles.cellStyle]}
          rowStyle={[Styles.rowStyle]}
          headers={[
            { value: "Item", minWidth: 100 },
            { value: "Req* Case", minWidth: 100 },
            { value: "Req* Units", minWidth: 100 },
            { value: "Action", minWidth: 100 },
          ]}
          width={
            window.width >= 1040 ? window.width - (320 + 20) : window.width - 20
          }
          height={Math.max((window.height - 84) / 2)}
          // onClickColumn={handleCallback}
        ></DataTable>
      </View>
      <View
        style={{
          alignItems: "flex-end",
          paddingTop: 5,
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
              setBillData({
                type: "add_Product",
                value: obj,
              });
            }}
          >
            <Icon name="plusOnly" fill="#fff"></Icon>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          alignItems: "flex-end",
          height: 200,
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
          }}
        >
          <View style={{ paddingLeft: 5 }}>
            {billData.price ? (
              <View style={{ marginTop: 10 }}>
                <Text style={{ color: "gray", width: 140 }}>
                  Price :
                  <Text style={{ color: "#000" }}>
                    {pipe.formatter.format(billData.price)}
                  </Text>
                </Text>
                <Text style={{ color: "gray", width: 140 }}>
                  Total Tax :
                  <Text style={{ color: "#000" }}>
                    {pipe.formatter.format(billData.totalTax)}
                  </Text>
                </Text>
                <View
                  style={{
                    borderWidth: 2,
                    borderColor: "black",
                    padding: 5,
                    width: 200,
                  }}
                >
                  <Text>Discount Info: </Text>
                  <View
                    style={{
                      marginTop: 5,
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <Checkbox
                      style={styles.checkBox}
                      label="Flat"
                      isLabel={true}
                      setValue={() =>
                        setBillData({
                          type: "discountType",
                          value: "flat",
                        })
                      }
                      value={billData.discountType === "flat"}
                    ></Checkbox>
                    <Checkbox
                      style={styles.checkBox}
                      label="Percent"
                      isLabel={true}
                      setValue={() =>
                        setBillData({
                          type: "discountType",
                          value: "percent",
                        })
                      }
                      value={billData.discountType === "percent"}
                    ></Checkbox>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      height: 40,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ paddingRight: 15, marginTop: 10 }}>
                      Discount
                    </Text>
                    <TextInput
                      value={`${billData.discountValue || ""}`}
                      onChangeText={(e) => {
                        if (e == "" || !isNaN(e)) {
                          setBillData({
                            type: "onDiscount",
                            value: e,
                          });
                        } else {
                          addError("Insert number only!", 3000);
                          return;
                        }
                      }}
                      style={{
                        borderColor: "gray",
                        borderWidth: 2,
                        backgroundColor: "#ffff",
                        paddingLeft: 3,
                        minWidth: 80,
                        maxWidth: 80,
                        height: "100%",
                      }}
                      placeholder="Discount"
                      keyboardType="numeric"
                    ></TextInput>
                  </View>
                  {billData.discountType == "percent" ? (
                    <View style={{ flexDirection: "row" }}>
                      <Text>Evaluated Value: </Text>
                      <Text>{pipe.formatter.format(billData.discount)}</Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
                <Text style={{ color: "gray", width: 140 }}>
                  SubTotal :
                  <Text style={{ color: "#000" }}>
                    {pipe.formatter.format(
                      billData.subTotal - (billData.discount || 0)
                    )}
                  </Text>
                </Text>
              </View>
            ) : (
              <></>
            )}
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ marginLeft: 5, marginRight: 5 }}>
              <Button
                pressFunc={() => calculateDiscount()}
                title={"Submit"}
              ></Button>
            </View>
            <View style={{ marginRight: 5 }}>
              <Button pressFunc={() => saveDraft()} title={"Draft"}></Button>
            </View>
            <View style={{ marginRight: 5 }}>
              <Button
                pressFunc={() =>
                  setBillData({
                    type: "reset",
                    value: posObj,
                  })
                }
                title={"Reset"}
              ></Button>
            </View>
            <View>
              <Button
                pressFunc={() => {
                  navigation.navigate("pos");
                }}
                title={"Cancel"}
              ></Button>
            </View>
          </View>
        </View>
      </View>
      <AddModal
        showModal={isLotModal.show}
        onSelection={handleCallback}
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
          paddingLeft: 5,
          paddingRight: 5,
        }}
        add={
          <DisplayLot
            lotData={
              isLotModal.show
                ? {
                    productIndex: isLotModal.index,
                    selectedData: billData.products[isLotModal.index],
                  }
                : {}
            }
            onAddLots={onAddLotsData}
            onChangeProductLotInput={onChangeLotInput}
            onSelectLot={onSelectLot}
            addError={addError}
          ></DisplayLot>
        }
      ></AddModal>

      <AddModal
        showModal={discountAlertModal}
        onSelection={handleCallback}
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
          paddingLeft: 5,
          paddingRight: 5,
        }}
        add={
          discountAlertModal ? (
            <View style={{ flex: 1 }}>
              <Text style={{ flex: 1, fontSize: 20 }}>
                Discount amount is greater than Cost price, do you want to
                continue ?
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    addBill(), setDiscountAlert(false);
                  }}
                >
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
                <TouchableOpacity onPress={() => setDiscountAlert(false)}>
                  <Text style={{ color: "#65ACCB", fontSize: 18 }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <></>
          )
        }
      ></AddModal>
      {/* </View> */}
    </View>
  );
};
const mapStateToProps = ({
  selectedBusiness,
  selectedFacility,
  inventory,
  coupon,
  draftBills,
}) => ({
  selectedBusiness,
  selectedFacility,
  inventory,
  coupon,
  draftBills,
});
export default connect(mapStateToProps, {
  createDraft,
  createBill,
  removeDraftBill,
  addError,
})(CreateBill);

const styles = StyleSheet.create({
  heading: {
    flex: 1,
    paddingHorizontal: 50,
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#E8E9EC",
    padding: 10,
    alignSelf: "stretch",
    backgroundColor: "#fff",
  },
  couponInputStyle: {
    color: "black",
    backgroundColor: "#fff",
    flex: 1,
    maxHeight: 40,
    minHeight: 40,
    maxWidth: 400,
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: "#E8E9EC",
  },
  parent: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  child: {
    width: "48%",
    margin: "1%",
    aspectRatio: 1,
  },
  checkBox: {
    width: 20,
    minHeight: 20,
    maxHeight: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 10,
    minWidth: 20,
    bottom: 2,
  },
});
