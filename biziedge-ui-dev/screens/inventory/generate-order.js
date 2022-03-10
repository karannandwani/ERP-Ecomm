import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import AutoCompleteModal from "../../components/common/autocompleteModal/auto-complete-modal";
import Button from "../../components/common/buttom/button";
import Icon from "../../components/common/icon";
import { fetchProducts } from "../../redux/actions/propduct.action";
import { generateOrder, saveOrder } from "../../redux/actions/inventory.action";
import { saveDraft, removeDraft } from "../../redux/actions/draft-order.action";
import moment from "moment";
import { DataTable } from "../../components/dataTable/dataTable";
import IdGenerate from "../../util/id-generate";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import { addError } from "../../redux/actions/toast.action";
import { isNumber } from "lodash";

const SaveOrderComponent = ({
  selectedBusiness,
  fetchProducts,
  products,
  saveDraft,
  draft,
  removeDraft,
  saveOrder,
  selectedFacility,
  route,
  navigation,
  productByNorm,
  generateOrder,
  addError,
}) => {
  let initData = [
    { productId: null, item: null, ordNoOfCase: null, ordNoOfProduct: null },
  ];
  let idGenerate = new IdGenerate();
  const [data, setData] = useState(initData);
  const headerElements = ["Item", "Case Quantity", "Product Quantity"];
  const [draftList, setDraftList] = useState([]);
  const [fetchedProductNorm, setFecthedProductNorm] = useState(false);
  const { window } = useContext(DimensionContext);
  const [width, setWidth] = useState(Dimensions.get("window").width - 400);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [invalid, isInvalid] = useState(false);

  const onChange = ({ window }) => {
    setWidth(window.width);
    setHeight(window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
      setData(initData);
    };
  }, []);

  useEffect(() => {
    setFilteredProducts([...products]);
  }, [products]);

  useEffect(() => {
    let obj = {
      facility: selectedFacility._id,
      suppliers: route.params.supplier,
    };
    if (!fetchedProductNorm) {
      setFecthedProductNorm(true);
      generateOrder(obj);
    }
    if (productByNorm && productByNorm.length > 0) {
      const tempData = productByNorm?.map((prod) => ({
        productId: prod.product._id,
        item: prod.product.name,
        ordNoOfCase: prod.ordNoOfCase,
        ordNoOfProduct: prod.ordNoOfProduct,
      }));
      setData(tempData);
    }
  }, [productByNorm]);

  useEffect(() => {
    let filteredDraft =
      draft.length > 0
        ? draft.filter(
            (x) =>
              x.facility === selectedFacility._id &&
              x.suppliers === route.params.supplier
          )
        : [];
    setDraftList([...filteredDraft]);
  }, [route.params.supplier, draft]);

  const searchProductByPhrase = (phrase) => {
    setFilteredProducts([
      ...products.filter((x) =>
        x.name.toLowerCase().startsWith(phrase.toLowerCase())
      ),
    ]);
  };

  const setDraftValue = (draftObj) => {
    setData(
      draftObj.products.map((i) => ({
        productId: i.product._id,
        item: i.product.name,
        ordNoOfCase: i.ordNoOfCase,
        ordNoOfProduct: i.ordNoOfProduct,
      }))
    );
    deleteDraft(draftObj._id);
  };
  const deleteDraft = (draftId) => {
    removeDraft(draftId);
  };

  const modalCallBack = (selectedItem, index) => {
    if (invalid) {
      isInvalid(false);
    }
    data[index].item = selectedItem.name;
    data[index].productId = selectedItem._id;
    // setFilter([
    //   ...filteredProducts.filter((x, i) => x._id !== selectedItem._id),
    // ]);
  };

  function confirmOrder() {
    if (data.filter((i) => i.ordNoOfCase || i.ordNoOfProduct).length > 0) {
      let obj = {
        id: idGenerate.generateId("O", selectedFacility.shortName, ""),
        business: selectedBusiness.business._id,
        facility: selectedFacility._id,
        suppliers: route.params.supplier,
        totalPrice: null,
        products: data
          .filter((i) => i.ordNoOfCase || i.ordNoOfProduct)
          .map((i) => ({
            product: i.productId,
            ordNoOfCase: i.ordNoOfCase ? i.ordNoOfCase : 0,
            ordNoOfProduct: i.ordNoOfProduct ? i.ordNoOfProduct : 0,
          })),
      };
      saveOrder(obj);
      navigateToInventory();
    } else {
      isInvalid(true);
      addError("Please fill details to generate order!", 3000);
    }
  }
  const draftOrder = () => {
    if (data.filter((i) => i.ordNoOfCase || i.ordNoOfProduct).length > 0) {
      let obj = {
        business: selectedBusiness.business._id,
        facility: selectedFacility._id,
        suppliers: route.params.supplier,
        products: data
          .filter((i) => i.ordNoOfCase || i.ordNoOfProduct)
          .map((i) => ({
            product: i.productId,
            ordNoOfCase: i.ordNoOfCase ? i.ordNoOfCase : 0,
            ordNoOfProduct: i.ordNoOfProduct ? i.ordNoOfProduct : 0,
          })),
      };
      saveDraft(obj);
      navigateToInventory();
    } else {
      isInvalid(true);
      addError("Please fill any details to draft the order!", 3000);
    }
  };

  const navigateToInventory = () => {
    setData([
      { productId: null, item: null, ordNoOfCase: null, ordNoOfProduct: null },
    ]);
    navigation.navigate("inventory");
  };
  const remove = (row, index) => {
    setData([...data.filter((a, i) => i !== index)]);
  };

  const GenerateOrderItem = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <AutoCompleteModal
            name={"Product"}
            data={{
              data: { name: row.item ? row.item : "" },
              displayField: "name",
            }}
            onSelection={(result) => modalCallBack(result, index)}
            styleSingleSelect={{
              backgroundColor: "#fff",
            }}
            searchApi={searchProductByPhrase}
            renderData={filteredProducts.filter(
              (x) =>
                !data
                  .filter((x, i) => x.productId && i !== index)
                  .map((x) => x.productId)
                  .includes(x._id)
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
            placeholder={"Required Case"}
            placeholderTextColor="#AFAEBF"
            value={
              row.ordNoOfCase === undefined || row.ordNoOfCase === null
                ? ""
                : `${row.ordNoOfCase}`
            }
            // value={row.ordNoOfCase}
            onChangeText={(num) => {
              if (!isNaN(num)) {
                if (invalid) {
                  isInvalid(false);
                }
                setData(
                  data.map((r) => (r === row ? { ...r, ordNoOfCase: num } : r))
                );
              }
            }}
            style={[
              styles.textInputStyle,
              invalid ? { colr: "red", borderColor: "red" } : {},
            ]}
            keyboardType="numeric"
          ></TextInput>
        ),
      },
      {
        value: null,
        component: () => {
          return (
            <TextInput
              placeholderTextColor="#AFAEBF"
              placeholder={"Required Units"}
              // value={row.ordNoOfProduct}
              value={
                row.ordNoOfProduct === undefined || row.ordNoOfProduct === null
                  ? ""
                  : `${row.ordNoOfProduct}`
              }
              onChangeText={(num) => {
                if (!isNaN(num)) {
                  if (invalid) {
                    isInvalid(false);
                  }
                  setData(
                    data.map((r) =>
                      r === row ? { ...r, ordNoOfProduct: num } : r
                    )
                  );
                }
              }}
              style={[
                styles.textInputStyle,
                invalid ? { colr: "red", borderColor: "red" } : {},
              ]}
              keyboardType="numeric"
            ></TextInput>
          );
        },
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
              <TouchableOpacity onPress={() => remove(row, index)}>
                <Icon
                  name="remove"
                  fill="#808080"
                  style={{ width: 35, height: 35, marginTop: 7 }}
                ></Icon>
              </TouchableOpacity>
            ) : (
              <></>
            )}
            {index === data.length - 1 ? (
              <TouchableOpacity
                onPress={() =>
                  setData([
                    ...data,
                    { item: null, ordNoOfCase: null, ordNoOfProduct: null },
                  ])
                }
              >
                <Icon name="plus" fill="#808080"></Icon>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        ),
      },
    ];
  };

  return (
    <View style={[Styles.container]}>
      {draftList.length > 0 ? (
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
            {draftList.map((x) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 20,
                  backgroundColor: "#DBDBDB",
                  marginLeft: 5,
                  justifyContent: "space-between",
                  marginTop: 2,
                  marginBottom: 5,
                  padding: 5,
                }}
              >
                <TouchableOpacity onPress={() => setDraftValue(x)}>
                  <Text style={{ fontSize: 14 }}>
                    {moment(
                      new Date(
                        parseInt(x._id.toString().substring(0, 8), 16) * 1000
                      )
                    ).format("MMMM Do YYYY, h:mm:ss a") + " "}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteDraft(x._id)}>
                  <Icon
                    name="remove"
                    style={{
                      marginLeft: 5,
                      paddingTop: 5,
                    }}
                  ></Icon>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <></>
      )}
      {/* hjdghgds */}

      <View
        style={[
          {
            width:
              window.width >= 1040
                ? window.width - (320 + 20)
                : window.width - 20,
            minHeight: Math.max((window.height - 84) / 2),
            height: Math.max((window.height - 84) / 2),
            backgroundColor: "#fff",
          },
          Styles.tableContainer,
        ]}
      >
        <DataTable
          data={data}
          extractionLogic={GenerateOrderItem}
          headers={[
            { value: "ITEM", minWidth: 100 },
            { value: "REQ* CASE", minWidth: 100 },
            { value: "REQ* UNITS", minWidth: 100 },
            { value: "Action", minWidth: 100 },
          ]}
          headerStyle={[Styles.headerStyle]}
          cellStyle={[Styles.cellStyle]}
          rowStyle={[Styles.rowStyle]}
          width={
            window.width >= 1040 ? window.width - (320 + 20) : window.width - 20
          }
          height={Math.max((window.height - 84) / 2)}
        ></DataTable>
      </View>
      <View
        style={{
          margin: 5,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <View>
          <Button
            title="Confirm Order"
            pressFunc={() => confirmOrder()}
          ></Button>
        </View>

        <View style={{ marginLeft: 5 }}>
          <Button
            title="Draft Order"
            pressFunc={() => {
              draftOrder();
            }}
          ></Button>
        </View>
        <View style={{ marginLeft: 5 }}>
          <Button
            title="Cancel"
            pressFunc={() => navigation.navigate("inventory")}
          ></Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    // flex: 1,
    // paddingHorizontal: 50,
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
  chip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    width: 120,
    alignItems: "center",
    padding: 2,
    backgroundColor: "#43425D",
    marginBottom: 3,
  },
  draftContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E9EC",
  },
  draftRemove: {
    // width: 16,
    // height: 16,
    zIndex: 9,
    position: "absolute",
    bottom: 13,
    left: 108,
  },
});

const mapStateToProps = ({
  selectedBusiness,
  products,
  productByNorm,
  selectedFacility,
  draft,
}) => ({
  selectedBusiness,
  products,
  productByNorm,
  selectedFacility,
  draft,
});
export default connect(mapStateToProps, {
  fetchProducts,
  generateOrder,
  saveDraft,
  removeDraft,
  saveOrder,
  addError,
})(SaveOrderComponent);
