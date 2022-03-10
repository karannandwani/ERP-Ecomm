import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Platform,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import CardWithoutGraph from "../../components/common/cards/CardWithoutGraph";
import QuickDetailsList from "../../components/quickDetailsList/quickDetailsList";
import AddModal from "../../components/addModal/addModal";
import SaveOrderComponent from "./generate-order";
// import ReturnOrderComponent from "./return-order";
import SupplierList from "./supplier-selection-modal";
import Checkbox from "../../components/common/checkBox/checkbox";
import { DataTable } from "../../components/dataTable/dataTable";
import Icon from "../../components/common/icon";
import { DimensionContext } from "../../components/dimensionContext";
import { Styles } from "../../globalStyle";
import {
  setBrandCount,
  setProductCount,
} from "../../redux/actions/inventory.action";

const extractionLogic = ({ row }) => {
  if (row) {
    return [
      row?.product?.name,
      row?.expiredCount,
      row?.products?.map((lot) => lot.noOfCase).reduce((x, y) => x + y, 0) || 0,
      row?.products?.map((lot) => lot.noOfProduct).reduce((x, y) => x + y, 0) ||
        0,
      row?.inTransit ? row.inTransit : 0,
    ];
  } else {
    return [];
  }
};

const Inventory = ({
  selectedBusiness,
  brandCount,
  productCount,
  draft,
  navigation,
  selectedFacility,
  expiredProduct,
  inventory,
  setBrandCount,
  setProductCount,
}) => {
  const headerItems = [
    { value: "Brand Product", minWidth: 100 },
    { value: "Expired Count", minWidth: 100 },
    { value: "Available Case", minWidth: 100 },
    { value: "Available Units", minWidth: 100 },
    { value: "In Transit", minWidth: 100 },
  ];
  const [modalDisplay, showGenerateOrderModal] = useState(false);
  const [isReturnProductModal, setIsReturnProductModal] = useState(false);
  const [supplierSelectionModal, showSupplierSelectionModal] = useState(false);
  const [supplierObject, setSupplierObject] = useState(false);
  const [isReturnModal, setIsReturnModal] = useState(false);
  const [expired, setExpired] = useState(false);
  const [stockOut, setStockOut] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [expiredProducts, setExpiredProducts] = useState([]);
  const { window } = useContext(DimensionContext);
  const w = headerItems.reduce((x, y) => x + y.minWidth || 50, 0);

  useEffect(() => {
    if (selectedFacility) {
      setFilteredProducts([
        ...inventory.filter((x) => x.facility === selectedFacility._id),
      ]);
      setExpiredProducts([
        ...expiredProduct.filter((x) => x.facility === selectedFacility._id),
      ]);
    } else {
      setFilteredProducts([...inventory.filter((x) => x.type === "Business")]);
    }
  }, [selectedFacility, !filteredProducts, inventory]);

  const filterInventory = (data, param) => {
    if (param) {
      if (param === "OUT") {
        setStockOut(data);
      } else {
        setExpired(data);
      }
    } else {
      setFilterText(data);
    }

    let tempInv = inventory.filter((x) =>
      selectedFacility
        ? x.facility === selectedFacility._id
        : x.type === "Business"
    );
    let text = !param ? data : filterText;
    if (text !== "")
      tempInv = tempInv.filter((x) =>
        x.product.name.toLowerCase().startsWith(text.toLowerCase())
      );
    if (param && param === "OUT" ? data : stockOut)
      tempInv = tempInv.filter((x) => x.status === "Out Of Stock");

    if (param && param === "EXPIRED" && data) {
      tempInv = tempInv.filter((x) =>
        expiredProducts.map((x) => x.product._id).includes(x.product._id)
      );
    }
    setFilteredProducts([...tempInv]);
  };

  const onOrderGeneration = () => {
    if (selectedFacility.suppliers.length > 1) {
      let obj = {
        supplierDetails: selectedFacility.suppliers,
      };
      setSupplierObject(obj);
      showSupplierSelectionModal(true);
    } else {
      navigateToGenerateOrder(selectedFacility.suppliers[0]._id);
    }
  };

  useEffect(() => {
    if (inventory) {
      setProductCount(
        inventory.filter((x) => x.facility === selectedFacility?._id).length
      );
      setBrandCount(
        new Set(
          inventory
            .filter((x) => x.facility === selectedFacility?._id)
            .map((x) => x.product.brand) || []
        ).size
      );
    }
  }, [inventory, selectedFacility]);
  const getSelectedSupplier = (item) => {
    showSupplierSelectionModal(false);
    navigateToGenerateOrder(item._id);
  };

  const navigateToGenerateOrder = (supplierId) => {
    navigation.navigate("generateOrder", {
      supplier: supplierId,
    });
  };

  const onReturnProduct = () => {
    if (selectedFacility.suppliers && selectedFacility.suppliers.length > 1) {
      let obj = {
        facility: selectedFacility._id,
        business: selectedBusiness.business._id,
        supplierDetails: selectedFacility.suppliers,
      };
      setSupplierObject(obj);
      setIsReturnModal(true);
    } else if (selectedFacility.suppliers && selectedFacility.suppliers) {
      returnSelectedSupplierHandler(selectedFacility.suppliers[0]);
    }
  };

  const returnSelectedSupplierHandler = (item) => {
    setIsReturnModal(false);
    let inv = filteredProducts.map((element) => ({
      ...element,
      products: element.products.filter((x) => x.supplier === item._id),
    }));
    // setInventoryState(inv.filter((x1) => x1.products?.length > 0));
    navigation.navigate("return_product", { supplier: item._id });
  };

  const onColumnClickHandler = (data) => {
    navigation.navigate("inventory-details", {
      inventoryId: data._id,
    });
  };

  const navigateToExpiry = (item) => {
    navigation.navigate("expired-product-details", { productId: item._id });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[
        styles.container,
        {
          padding: Platform.OS === "web" ? 20 : 10,
        },
      ]}
    >
      {selectedFacility ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            title="Generate Order"
            style={styles.ButtonStyle}
            pressFunc={() => {
              onOrderGeneration();
            }}
          ></Button>
          <View style={{ marginLeft: 5 }}>
            <Button
              title="Return Products"
              pressFunc={() => {
                // setInventoryState([...inventory]);
                onReturnProduct();
              }}
            ></Button>
          </View>
        </View>
      ) : (
        <></>
      )}
      {window.width > 667 ? (
        <View
          style={[
            styles.cardContainer,
            {
              width:
                window.width > 1040
                  ? Platform.OS === "web"
                    ? window.width - (320 + 40)
                    : window.width - (320 + 20)
                  : Platform.OS === "web"
                  ? window.width - 40
                  : window.width - 20,
              marginTop: 10,
            },
          ]}
        >
          <View
            style={[
              {
                maxWidth:
                  window.width > 1040
                    ? Platform.OS === "web"
                      ? (window.width - 380) / 3
                      : (window.width - 360) / 3
                    : Platform.OS === "web"
                    ? (window.width - 60) / 3
                    : (window.width - 40) / 3,
                minWidth:
                  window.width > 1040
                    ? Platform.OS === "web"
                      ? (window.width - 380) / 3
                      : (window.width - 360) / 3
                    : Platform.OS === "web"
                    ? (window.width - 60) / 3
                    : (window.width - 40) / 3,
              },
              Styles.cardSize,
            ]}
          >
            <CardWithoutGraph
              icon="revenue"
              header={productCount}
              // subHeader="Total Product"
              subHeader={`${window.width}`}
            ></CardWithoutGraph>
          </View>
          <View
            style={[
              {
                maxWidth:
                  window.width > 1040
                    ? Platform.OS === "web"
                      ? (window.width - 380) / 3
                      : (window.width - 360) / 3
                    : Platform.OS === "web"
                    ? (window.width - 60) / 3
                    : (window.width - 40) / 3,
                minWidth:
                  window.width > 1040
                    ? Platform.OS === "web"
                      ? (window.width - 380) / 3
                      : (window.width - 360) / 3
                    : Platform.OS === "web"
                    ? (window.width - 60) / 3
                    : (window.width - 40) / 3,
              },
              Styles.cardSize,
            ]}
          >
            <CardWithoutGraph
              header={brandCount}
              icon="store"
              subHeader={"Total Brand"}
            ></CardWithoutGraph>
          </View>
          <View
            style={[
              {
                maxWidth:
                  window.width > 1040
                    ? Platform.OS === "web"
                      ? (window.width - 380) / 3
                      : (window.width - 360) / 3
                    : Platform.OS === "web"
                    ? (window.width - 60) / 3
                    : (window.width - 40) / 3,
                minWidth:
                  window.width > 1040
                    ? Platform.OS === "web"
                      ? (window.width - 380) / 3
                      : (window.width - 360) / 3
                    : Platform.OS === "web"
                    ? (window.width - 60) / 3
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
            window.width > 1040
              ? Platform.OS === "web"
                ? window.width - (320 + 220 + 40)
                : window.width - (320 + 220 + 20)
              : Platform.OS === "web"
              ? window.width - 40
              : window.width - 20,
          flexDirection: window.width > 1040 ? "row" : "column",
          paddingTop: 10,
          paddingBottom: 10,
          height: "100%",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            height: "50%",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              maxWidth: 500,
              minWidth: "100%",
              maxHeight:
                Platform.OS === "android" || Platform.OS === "ios"
                  ? window.height / 15
                  : 40,
              minHeight:
                Platform.OS === "android" || Platform.OS === "ios"
                  ? window.height / 15
                  : 30,
              backgroundColor: "#FFFFFF",
              padding: 5,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Icon style={{ alignSelf: "center" }} name="search"></Icon>
            </View>
            <TextInput
              placeholder="Search"
              style={{ flex: 1, paddingLeft: 5 }}
              onChangeText={(e) => filterInventory(e)}
            ></TextInput>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: 5,
              height: 40,
              flex: 1,
            }}
          >
            <Checkbox
              containerStyle={{
                marginRight: 5,
              }}
              style={{
                borderRadius: 19,
                // margin: 5,
              }}
              isLabel={true}
              label={"Out of Stock"}
              value={stockOut}
              setValue={(data) => {
                filterInventory(data, "OUT");
              }}
            ></Checkbox>
            <Checkbox
              style={{
                borderRadius: 19,
              }}
              isLabel={true}
              label={"Expired"}
              value={expired}
              setValue={(data) => {
                filterInventory(data, "EXPIRED");
              }}
            ></Checkbox>
          </View>
          <View
            style={{
              minWidth:
                window.width > 1040
                  ? Platform.OS === "web"
                    ? window.width - (320 + 220 + 40)
                    : window.width - (320 + 220 + 20)
                  : Platform.OS === "web"
                  ? window.width - 40
                  : window.width - 20,
              backgroundColor: "#fff",
              height:
                Platform.OS === "web"
                  ? window.height / 1.8
                  : window.height / 1.3,
            }}
          >
            <DataTable
              data={filteredProducts.map((x) => ({
                ...x,
                expiredCount: expiredProducts.find(
                  (y) => y.product._id === x.product._id
                )
                  ? expiredProducts
                      .find((y) => y.product._id === x.product._id)
                      .products.map((t) =>
                        (t.noOfCase ? Number(t.noOfCase) : 0) *
                          Number(t.qtyPerCase) +
                        t.noOfProduct
                          ? Number(t.noOfProduct)
                          : 0
                      )
                      .reduce((a, b) => a + b, 0)
                  : 0,
              }))}
              extractionLogic={extractionLogic}
              headers={headerItems}
              headerStyle={[Styles.headerStyle]}
              cellStyle={[Styles.cellStyle]}
              rowStyle={[Styles.rowStyle]}
              width={
                window.width > 1040
                  ? Platform.OS === "web"
                    ? window.width - (320 + 220 + 40)
                    : window.width - (320 + 220 + 20)
                  : Platform.OS === "web"
                  ? window.width - 40
                  : window.width - 20
              }
              onClickColumn={onColumnClickHandler}
            ></DataTable>
          </View>
        </View>

        {window.width > 1040 ? (
          <View
            style={{
              width: window.width > 1040 ? 220 : window.width - 20,
              marginTop: window.width < 1040 ? 10 : 0,
              marginLeft: window.width < 1040 ? 0 : 10,
              height:
                Platform.OS === "web"
                  ? window.height / 1.8 + 80
                  : window.height / 1.3 + 80,
              paddingRight: 10,
              // height: "100%",
            }}
          >
            <QuickDetailsList
              level={"Expired Products"}
              renderData={expiredProducts}
              onNavigation={navigateToExpiry}
            ></QuickDetailsList>
          </View>
        ) : (
          <View style={{ marginTop: 180 }}>
            <QuickDetailsList
              level={"Expired Products"}
              renderData={expiredProducts}
              onNavigation={navigateToExpiry}
            ></QuickDetailsList>
          </View>
        )}
      </View>
      <View>
        {modalDisplay ? (
          <AddModal
            showModal={modalDisplay}
            onSelection={(data) => showGenerateOrderModal(data)}
            modalViewStyle={{
              padding: 20,
            }}
            add={
              <ScrollView nestedScrollEnabled={true} style={[styles.modalView]}>
                <SaveOrderComponent
                  draft={draft}
                  closeModal={(data) => showGenerateOrderModal(data)}
                ></SaveOrderComponent>
              </ScrollView>
            }
          ></AddModal>
        ) : (
          <></>
        )}
      </View>

      <View>
        <AddModal
          showModal={supplierSelectionModal}
          onSelection={(data) => showSupplierSelectionModal(data)}
          modalViewStyle={{
            padding: 20,
          }}
          add={
            <SupplierList
              supplierInfo={supplierObject}
              onSupplierSelection={getSelectedSupplier}
            ></SupplierList>
          }
        ></AddModal>
      </View>
      <View>
        <AddModal
          showModal={isReturnModal}
          onSelection={setIsReturnModal}
          add={
            <SupplierList
              supplierInfo={supplierObject}
              onSupplierSelection={returnSelectedSupplierHandler}
            ></SupplierList>
          }
        ></AddModal>
      </View>
    </ScrollView>
  );
};

const mapStateToProps = ({
  selectedBusiness,
  brandCount,
  productCount,
  draft,
  selectedFacility,
  expiredProduct,
  inventory,
}) => ({
  selectedBusiness,
  brandCount,
  productCount,
  draft,
  selectedFacility,
  expiredProduct,
  inventory,
});
export default connect(mapStateToProps, { setBrandCount, setProductCount })(
  Inventory
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ButtonStyle: {
    // maxWidth: 150,
    margin: 5,
  },
  box: {
    flex: 1,
    minWidth: 350,
    aspectRatio: 1,
  },
  // cardContainer: {
  //   width: "100%",
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   alignItems: "flex-start",
  // },
  card: {
    // flex: 7,
    minWidth:
      window.width > 1040 ? window.width - (320 + 500 + 50) : window.width - 50,
    margin: 10,
    width: window.width > 1040 ? window.width - (320 + 40) : window.width - 60,
    marginLeft: window.width > 1040 ? 20 : 15,
    marginRight: window.width > 1040 ? 20 : 15,
    marginTop: window.width > 1040 ? 20 : 15,
  },
  subCard: {
    backgroundColor: "#efefef",
    maxHeight: 133,
    flexDirection: "row",
    margin: 10,
    padding: 10,
  },
  cardHeader: {
    backgroundColor: "lightgrey",
    width: "100%",
    flexDirection: "row",
    padding: 15,
  },
  textStyle: {
    color: "black",
    alignSelf: "center",
    margin: 20,
  },
  headerStyle: {
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  textInput: {
    // borderBottomWidth: 1,
    // borderBottomColor: "grey",
    // margin: 2,
  },
});
