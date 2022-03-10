import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import CardWithoutGraph from "../../components/common/cards/CardWithoutGraph";
import Segment from "../../components/common/segment/segment";
import QuickDetailsList from "../../components/quickDetailsList/quickDetailsList";
import {
  fetchReturnOrders,
  fetchReturnCountForLast24Hour,
} from "../../redux/actions/return.action";
import { Styles } from "../../globalStyle";
import { OrdersComponentDataTable } from "../../components/orders/ordersComponent";
import { DimensionContext } from "../../components/dimensionContext";
const OrderReturns = ({
  selectedBusiness,
  selectedFacility,
  user,
  fetchReturnOrders,
  returnOrders,
  navigation,
  productCount,
  brandCount,
}) => {
  let quickDetailArray = [
    { name: "Last24Hours", details: { count: returnCount } },
  ];

  let headers = [
    { value: "Order", minWidth: 100 },
    { value: "Case Quantity", minWidth: 100 },
    { value: "Units", minWidth: 100 },
    { value: "", minWidth: 100 },
  ];

  const w = headers.reduce((x, y) => x + y.minWidth || 50, 0);

  const [selected, setSelected] = useState("Supply Order");
  const [returnCount, setReturnCount] = useState(0);
  const [returnList, setReturnList] = useState([]);
  const tableHandleCallBack = (data) => {};
  const { window } = useContext(DimensionContext);

  const onClickSeeMore = (returnData) => {
    navigation.navigate("return-details", {
      itemId: returnData._id,
      type: selected.split(" ")[0],
    });
  };

  useEffect(() => {
    if (selectedFacility) {
      setReturnList(
        returnOrders.filter(
          (x) =>
            (selected === "Supply Order"
              ? x.suppliers._id === selectedFacility.supplierDoc
              : x.facility._id === selectedFacility._id) &&
            x.status.name !== "Delivered"
        )
      );
    } else {
      setReturnList(returnOrders.filter((x) => x.status.name !== "Delivered"));
    }
  }, [returnOrders, selectedFacility]);

  const extractionLogic = ({ row }) => {
    return [row.product.name, row.reqNoOfCase, row.reqNoOfProduct];
  };

  const segmentCallBack = (childData) => {
    setReturnList(
      returnOrders.filter(
        (x) =>
          (childData === "Supply Order"
            ? x.suppliers._id === selectedFacility.supplierDoc
            : x.facility._id === selectedFacility._id) &&
          x.status.name !== "Delivered"
      )
    );
  };

  const ExtractionLogic = ({ row, index }) => {
    return [
      {
        value: null,
        component: () => (
          <Text style={[styles.text, { padding: 2 }]}>
            {row?.product?.name}
          </Text>
        ),
      },
      {
        value: null,
        component: () => (
          <View>
            <Text style={[styles.text, { padding: 2 }]}>
              {row.reqNoOfCase} x Case
            </Text>
          </View>
        ),
      },
      {
        value: null,
        component: () => (
          <View>
            <Text style={[styles.text, { padding: 2 }]}>
              {row.reqNoOfProduct} x Product
            </Text>
          </View>
        ),
      },
    ];
  };

  return (
    <View style={styles.container}>
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
          width: window.width > 1040 ? window.width - 320 : window.width,
          flexDirection: "row",
          paddingLeft: Platform.OS === "web" ? 20 : 10,
          paddingRight: Platform.OS === "web" ? 20 : 10,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <View style={{ width: "100%" }}>
          {selectedFacility ? (
            <Segment
              label="justifyContent"
              selectedValue={selected}
              values={["Supply Order", "Procurement Order"]}
              setSelectedValue={setSelected}
              handleCallBack={segmentCallBack}
            ></Segment>
          ) : (
            <></>
          )}
          {window.width - 50 > w ? (
            <View
              style={[
                {
                  flex: 1,
                  flexWrap: "wrap",
                  flexDirection: "row",
                  maxHeight: 50,
                  minWidth: window.width,
                  maxWidth: window.width,
                },
                {
                  color: "#fff",
                  backgroundColor: "#DCDCDC",
                  alignContent: "center",
                  justifyContent: "center",
                  padding: 2,
                  minWidth: 80,
                  fontWeight: "200",
                },
                Styles.topMargin_10,
              ]}
            >
              {headers.map((header, i) => {
                return (
                  <Text
                    key={`header-${i.toString()}`}
                    style={[
                      { textAlign: "center", flex: 1 },
                      { minWidth: header.minWidth },
                      {
                        color: "#696969",
                        backgroundColor: "#DCDCDC",
                        alignContent: "center",
                        justifyContent: "center",
                        padding: 2,
                        minWidth: 80,
                        fontWeight: "200",
                        fontSize: 12,
                      },
                    ]}
                  >
                    {header.value}
                  </Text>
                );
              })}
            </View>
          ) : (
            <></>
          )}
          <View
            style={{
              minWidth:
                window.width > 1040
                  ? window.width - (320 + 40)
                  : Platform.OS === "web"
                  ? window.width - 40
                  : window.width - 20,
              height: window.height - 200,
            }}
          >
            {returnList.length > 0 ? (
              <OrdersComponentDataTable
                data={returnList}
                extractionLogic={ExtractionLogic}
                headers={headers}
                headerStyle={[Styles.headerStyle]}
                cellStyle={[Styles.cellStyle]}
                rowStyle={[Styles.rowStyle]}
                width={
                  window.width > 1040
                    ? window.width - (320 + 40)
                    : Platform.OS === "web"
                    ? window.width - 40
                    : window.width - 20
                }
                height={Math.max(window.height - 200)}
                selectedFacility={selectedFacility}
                orderDetailStyle={styles.orderDetail}
                businessView={selectedFacility ? false : true}
                navigation={navigation}
                procurement={selected === "Procurement Order"}
                supplyOrder={selected === "Supply Order"}
                returnScreen={true}
              ></OrdersComponentDataTable>
            ) : (
              <View
                style={{
                  padding: 10,
                  height: 40,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  No Data Available...
                </Text>
              </View>
            )}
          </View>
        </View>
        {/* <View>
          {window.width > 1040 ? (
            <View style={{ width: 220, marginLeft: 10 }}>
              <QuickDetailsList
                level="Quick Details List"
                renderData={quickDetailArray}
                style={{ marginLeft: 10, width: "100%", padding: 5 }}
              ></QuickDetailsList>
            </View>
          ) : (
            <></>
          )}
        </View> */}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  text: {
    fontSize: 12,
    color: "#000",
  },
  orderDetail: {
    color: "#696969",
    fontSize: 12,
  },
});
const mapStateToProps = ({
  selectedBusiness,
  selectedFacility,
  returnOrders,
  user,
  brandCount,
  productCount,
}) => ({
  selectedBusiness,
  selectedFacility,
  returnOrders,
  user,
  brandCount,
  productCount,
});
export default connect(mapStateToProps, {
  fetchReturnOrders,
})(OrderReturns);
