import React, { useState, useEffect, useContext } from "react";
import { View, Platform, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import CardWithoutGraph from "../../components/common/cards/CardWithoutGraph";
import { OrdersComponentDataTable } from "../../components/orders/ordersComponent";
import QuickDetailsList from "../../components/quickDetailsList/quickDetailsList";
import { fetchOrder } from "../../redux/actions/order.action";
import { fetchFacility } from "../../redux/actions/facility.action";
import { fetchQuickDetails } from "../../redux/actions/quickDetails.action";
import Segment from "../../components/common/segment/segment";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
const Order = ({
  fetchOrder,
  selectedBusiness,
  order,
  brandCount,
  fetchFacility,
  facility,
  productCount,
  fetchQuickDetails,
  quickDetails,
  navigation,
  selectedFacility,
  user,
  inventory,
  ecommerceOrders,
}) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selected, setSelected] = useState("Supply Order");
  let quickDetailArray = [
    { name: "Last24Hours", details: quickDetails?.last24Hour },
    { name: "Awaiting", details: quickDetails?.await },
    { name: "On Hold", details: quickDetails?.hold },
  ];
  const [headers, setHeaders] = useState([
    { value: "Order", minWidth: 100 },
    { value: "Case Quantity", minWidth: 100 },
    { value: "Units", minWidth: 100 },
    { value: "Availability", minWidth: 100 },
  ]);
  const w = headers.reduce((x, y) => x + y.minWidth || 50, 0);
  const { window } = useContext(DimensionContext);

  useEffect(() => {
    if (selectedFacility) {
      fetchQuickDetails({
        facility: selectedBusiness?.facilities
          ? selectedBusiness.facilities[0]._id
          : null,
      });
    }
  }, [selectedFacility]);

  // useEffect(() => {
  //   fetchFacility({
  //     business: selectedBusiness?.business?._id,
  //     pageNo: 0,
  //     pageSize: 15,
  //   });
  // }, [!facility]);

  // useEffect(() => {
  //   fetchOrder({
  //     business: selectedBusiness.business._id,
  //     facilities: selectedBusiness.facilities?.map((x) => x._id),
  //     type: "Active",
  //   });
  // }, [!order]);

  useEffect(() => {
    refresh("Supply Order");
  }, [order, selectedFacility, ecommerceOrders]);

  const refresh = (value) => {
    if (selectedFacility) {
      if (value === "Supply Order") {
        setFilteredOrders(
          order && order.length > 0
            ? [
                ...order.filter(
                  (x) => x.suppliers._id === selectedFacility.supplierDoc
                ),
              ]
            : []
        );
        setSelected("Supply Order");
        setHeaders([
          { value: "Order", minWidth: 100 },
          { value: "Case Quantity", minWidth: 100 },
          { value: "Units", minWidth: 100 },
          { value: "Availability", minWidth: 100 },
        ]);
      } else if (value === "E-Commerce Order") {
        setHeaders([
          { value: "Order", minWidth: 150 },
          { value: "Units", minWidth: 150 },
          { value: "Availability", minWidth: 150 },
        ]);
        setFilteredOrders([
          ...ecommerceOrders.filter(
            (x) =>
              x.suppliers._id === selectedFacility._id &&
              x.status.name !== "Rejected"
          ),
        ]);
      } else {
        setFilteredOrders(
          order && order.length > 0
            ? [...order.filter((x) => x.facility._id === selectedFacility._id)]
            : []
        );
        setHeaders([
          { value: "Order", minWidth: 100 },
          { value: "Case Quantity", minWidth: 100 },
          { value: "Units", minWidth: 100 },
          { value: "Availability", minWidth: 100 },
        ]);
      }
    } else {
      setFilteredOrders([...order]);
      setHeaders([
        { value: "Order", minWidth: 100 },
        { value: "Case Quantity", minWidth: 100 },
        { value: "Units", minWidth: 100 },
        { value: "Availability", minWidth: 100 },
      ]);
    }
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
      ...(selected === "E-Commerce Order"
        ? []
        : [
            {
              value: null,
              component: () => (
                <View>
                  <Text style={[styles.text, { padding: 2 }]}>
                    {row.acpNoOfCase || row.ordNoOfCase} x Case
                  </Text>
                </View>
              ),
            },
          ]),
      {
        value: null,
        component: () => (
          <View>
            <Text style={[styles.text, { padding: 2 }]}>
              {row.acpNoOfProduct || row.ordNoOfProduct} x Product
            </Text>
          </View>
        ),
      },
      {
        value: null,
        component: () => (
          <Text style={[styles.text, { padding: 2, flexDirection: "row" }]}>
            {inventory.find(
              (ip) =>
                ip?.facility === selectedFacility?._id &&
                ip?.product._id === row?.product?._id
            )?.total || 0}
          </Text>
        ),
      },
    ];
  };
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
          // window.width > 1040 ? window.width - (320 + 220) : window.width,
        }}
      >
        <View style={{ width: "100%" }}>
          {selectedFacility ? (
            <Segment
              label="justifyContent"
              selectedValue={selected}
              values={["Supply Order", "Procurement Order", "E-Commerce Order"]}
              setSelectedValue={setSelected}
              headerStyle={
                {
                  // fontSize: 12,
                  // fontWeight: "200",
                }
              }
              handleCallBack={refresh}
            ></Segment>
          ) : (
            <></>
          )}
          {window.width - 40 > w ? (
            <View
              style={[
                {
                  flex: 1,
                  flexWrap: "wrap",
                  flexDirection: "row",
                  minHeight: 50,
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
            // window.width - (320 + 220 + 50)
          >
            {filteredOrders.length > 0 ? (
              <OrdersComponentDataTable
                data={filteredOrders}
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
                ecommerceOrder={selected === "E-Commerce Order"}
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
                headerStyle={{
                  fontSize: 12,
                  fontWeight: "200",
                  color: "#000",
                }}
                onNavigation={() => console.log("")}
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
  text: {
    fontSize: 12,
    color: "#000",
  },
  orderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "200",
    color: "#A3A6B4",
  },
  orderDetail: {
    color: "#696969",
    fontSize: 12,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
const mapStateToProps = ({
  selectedBusiness,
  order,
  brandCount,
  facility,
  productCount,
  quickDetails,
  selectedFacility,
  inventory,
  user,
  ecommerceOrders,
}) => ({
  selectedBusiness,
  order,
  brandCount,
  facility,
  productCount,
  quickDetails,
  selectedFacility,
  inventory,
  user,
  ecommerceOrders,
});
export default connect(mapStateToProps, {
  fetchOrder,
  fetchFacility,
  fetchQuickDetails,
})(Order);
