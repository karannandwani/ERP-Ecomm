import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, Platform, Dimensions } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import CardWithoutGraph from "../../components/common/cards/CardWithoutGraph";
import Table from "../../components/common/table";
import moment from "moment";
import ProductHistory from "../../components/common/product-history";
import StockManagement from "./stock-management";
import AddModal from "../../components/addModal/addModal";
import { DataTable } from "../../components/dataTable/dataTable";
import Pipe from "../../util/pipes";
import { ScrollView } from "react-native-gesture-handler";
import { addError } from "../../redux/actions/toast.action";
import { DimensionContext } from "../../components/dimensionContext";
import { Styles } from "../../globalStyle";

const InventoryDetails = ({
  route,
  product,
  inventory,
  selectedFacility,
  ledger,
  addError,
  brandCount,
  productCount,
}) => {
  let pipe = new Pipe();
  const headerItems = [
    { value: "Date Time", minWidth: 50 },
    { value: "Cases", minWidth: 50 },
    { value: "Pieces", minWidth: 50 },
    { value: "Cost", minWidth: 50 },
    { value: "Wholesale", minWidth: 50 },
    { value: "Retail", minWidth: 50 },
    { value: "MRP", minWidth: 50 },
    { value: "Qty Per Case", minWidth: 50 },
    { value: "Expiry", minWidth: 50 },
  ];
  const name = "Lot Details";
  const [modalDisplay, openModal] = useState(false);
  const [productHistory, setProductHistory] = useState(null);
  const handleCallback = (data) => {
    openModal(data);
  };
  const [width, setWidth] = useState(Dimensions.get("window").width - 400);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const { window } = useContext(DimensionContext);

  const onChange = ({ window }) => {
    setWidth(window.width);
    setHeight(window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
      setProductHistory([]);
    };
  }, []);

  const extractionLogic = ({ row }) => {
    if (row && row._id) {
      return [
        moment(
          new Date(parseInt(row._id.toString().substring(0, 8), 16) * 1000)
        ).format("DD/MM/YYYY"),
        row.noOfCase,
        row.noOfProduct,
        pipe.formatter.format(row.costPrice),
        pipe.formatter.format(row.wholesalePrice),
        pipe.formatter.format(row.retailPrice),
        pipe.formatter.format(row.mrp),
        row.qtyPerCase,
        row.expiryDate
          ? moment(new Date(row.expiryDate)).format("DD/MM/YYYY")
          : "unavailable",
      ];
    } else {
      return [];
    }
  };

  const addMissingStockInProduct = (missingStock, index) => {
    product.products[index].missingStocks.push(missingStock);
  };

  var inventoryProduct = route?.params
    ? inventory.find((x) => x._id === route.params.inventoryId)
    : null;

  inventoryProduct?.products?.sort((a, b) =>
    new Date(parseInt(a._id.toString().substring(0, 8), 16) * 1000) >
    new Date(parseInt(b._id.toString().substring(0, 8), 16) * 1000)
      ? -1
      : 1
  );

  useEffect(() => {
    if (selectedFacility)
      setProductHistory({
        ...ledger.find(
          (x) =>
            x.facility === selectedFacility._id &&
            x.product === inventoryProduct.product._id
        ),
      });
  }, [route.params]);

  const onColumnClickHandler = (data) => {};

  const openMissingModal = () => {
    if (inventoryProduct.products && inventoryProduct.products[0]._id) {
      openModal(true);
    } else {
      addError("There is no lot to update the stock.", 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 20,
          marginRight: 20,
          marginTop: 20,
        }}
      >
        <View>
          <Text style={[Styles.h2]}>{inventoryProduct?.product?.name}</Text>
        </View>
        <View>
          {selectedFacility ? (
            <Button
              style={styles.ButtonStyle}
              textStyle={{ flex: 1, flexDirection: "row", fontSize: 12 }}
              title="Take Stock"
              pressFunc={() => openMissingModal()}
            ></Button>
          ) : (
            <></>
          )}
        </View>
      </View>
      {window.width > 667 ? (
        <View
          style={[
            styles.cardContainer,
            {
              width:
                window.width > 1040
                  ? window.width - (320 + 40)
                  : window.width - 60,
              marginLeft: 20,
              marginRight: 20,
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
            window.width > 1040 ? window.width - (320 + 450) : window.width,
          flexDirection: window.width > 1040 ? "row" : "column",
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
                ? window.width -
                  (320 + (selectedFacility ? (window.width - 350) / 3 : 0) + 40)
                : Platform.OS === "web"
                ? window.width - 50
                : window.width - 20,
            height: "50%",
          }}
        >
          <DataTable
            data={inventoryProduct.products}
            headers={headerItems}
            extractionLogic={extractionLogic || []}
            onClickColumn={onColumnClickHandler}
            headerStyle={[Styles.headerStyle]}
            cellStyle={[Styles.cellStyle]}
            rowStyle={[Styles.rowStyle]}
            width={
              window.width > 1040
                ? window.width -
                  (320 + (selectedFacility ? (window.width - 380) / 3 : 0) + 50)
                : Platform.OS === "web"
                ? window.width - 50
                : window.width - 20
            }
            height={Math.max(window.height / 2)}
          ></DataTable>
        </View>
        {/* end table section  */}

        {selectedFacility ? (
          <View
            style={{
              width:
                window.width > 1040
                  ? (window.width - 380) / 3
                  : window.width - 20,
              marginTop: window.width < 1040 ? 10 : 0,
              backgroundColor: "red",
              marginLeft: window.width > 1040 ? 10 : null,
              height: "50%",
            }}
          >
            <ProductHistory
              label="Product History"
              renderData={productHistory?.products}
              // style={{ flex: 1, maxHeight: Math.max(window.height / 2) }}
            ></ProductHistory>
          </View>
        ) : (
          <></>
        )}
      </View>

      <AddModal
        showModal={modalDisplay}
        onSelection={handleCallback}
        // modalViewStyle={{
        //   maxHeight: "90%",
        //   paddingTop: 30,
        //   minWidth: "40%",
        //   justifyContent: "center",
        // }}
        add={
          modalDisplay ? (
            <StockManagement
              onSelection={handleCallback}
              productDetails={inventoryProduct.products}
              addStocks={addMissingStockInProduct}
              inventoryId={inventoryProduct._id}
            ></StockManagement>
          ) : (
            <></>
          )
        }
      ></AddModal>
      {/* {window.width > 1040 ? (
        <></>
      ) : (
        <View
          style={{
            width: window.width - 20,
            position: "absolute",
            bottom: 0,
            left: 10,
            right: 10,
            height: "30%",
            paddingTop: 10,
            backgroundColor: "#fff",
          }}
        >
          <ProductHistory
            label="Product History"
            renderData={productHistory?.products}
            style={{ flex: 1, maxHeight: Math.max(window.height / 2) }}
          ></ProductHistory>
        </View>
      )} */}
    </View>
    // </View>
  );
};

const mapStateToProps = ({
  inventory,
  selectedFacility,
  selectedBusiness,
  ledger,
  brandCount,
  productCount,
}) => ({
  inventory,
  selectedFacility,
  selectedBusiness,
  ledger,
  brandCount,
  productCount,
});
export default connect(mapStateToProps, {
  addError,
})(InventoryDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ButtonStyle: {
    maxWidth: 150,
    // marginLeft: 10,
  },
  box: {
    flex: 1,
    minWidth: 400,
    margin: "1%",
    aspectRatio: 1,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    minWidth:
      window.width > 1040 ? window.width - (320 + 450 + 50) : window.width - 50,
    margin: 10,
    width: window.width > 1040 ? window.width - (320 + 40) : window.width - 60,
    marginLeft: window.width > 1040 ? 20 : 15,
    marginRight: window.width > 1040 ? 20 : 15,
    marginTop: window.width > 1040 ? 20 : 15,
  },
});
