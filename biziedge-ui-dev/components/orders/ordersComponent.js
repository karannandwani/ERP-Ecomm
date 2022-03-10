import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import uuid from "react-native-uuid";
export const OrdersComponentDataTable = ({
  data,
  extractionLogic,
  headers,
  width,
  height,
  headerStyle,
  rowStyle,
  cellStyle,
  onClickColumn,
  selectedFacility,
  orderDetailStyle,
  businessView,
  navigation,
  procurement,
  supplyOrder,
  returnScreen,
  ecommerceOrder,
}) => {
  const w = headers.reduce((x, y) => x + y.minWidth || 50, 0);

  return (
    <View
      style={{
        flex: 1,
        minWidth: width,
        maxWidth: width,
        minHeight: height,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          flexGrow: 1,
          paddingBottom: 20,
          marginBottom: 20,
        }}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 5 }}
      >
        {data?.map((item) => {
          return (
            <View key={uuid.v4()} style={{ backgroundColor: "#fff" }}>
              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  flexWrap: "wrap",
                }}
              >
                <Text style={orderDetailStyle}>
                  Order #{item?.orderNo || item?.returnNo}
                </Text>
                {ecommerceOrder ? (
                  <></>
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={orderDetailStyle}>
                      {" By "} {item?.facility?.name}
                    </Text>
                    {!selectedFacility ? (
                      <Text style={orderDetailStyle}>
                        {" TO "} {item?.suppliers?.name}
                      </Text>
                    ) : (
                      <></>
                    )}
                    <Text style={orderDetailStyle}>
                      ,{item?.facility?.address}
                    </Text>
                  </View>
                )}
                <Text style={orderDetailStyle}>({item?.status?.name})</Text>
                <Text
                  style={[orderDetailStyle, { color: "rgb(56, 128, 255)" }]}
                >
                  /
                  {moment(
                    new Date(
                      parseInt(item?._id.toString().substring(0, 8), 16) * 1000
                    )
                  ).format("MMMM Do YYYY, h:mm:ss a") + " "}
                </Text>
              </View>
              {item?.products.map((row, i) => {
                return (
                  <View
                    key={row._id ? `row-${row._id}` : `row-${i}`}
                    style={[
                      {
                        flex: 1,
                        flexWrap: "wrap",
                        flexDirection: "row",
                        paddingBottom: 1,
                        borderBottomWidth:
                          i === item?.products.length - 1 ? 1 : 0,
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                      },
                      rowStyle,
                    ]}
                  >
                    {extractionLogic({ row, index: i }).map((value, index) => {
                      return (
                        <React.Fragment key={index}>
                          {width > w ? (
                            <></>
                          ) : (
                            <Text
                              key={`head-cell-${row._id} ? ${row._id} :${i}`}
                              style={[
                                { textAlign: "center" },
                                headerStyle,
                                {
                                  minWidth: width / 2 - 10,
                                },
                              ]}
                            >
                              {headers[index].value}
                            </Text>
                          )}
                          {value.component ? (
                            <View
                              style={[
                                { textAlign: "center", flex: 1 },
                                cellStyle,
                                {
                                  minWidth:
                                    width > w
                                      ? headers[index]?.minWidth
                                      : width / 2 - 10,
                                },
                              ]}
                            >
                              {value.component()}
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={[
                                { textAlign: "center", flex: 1 },
                                cellStyle,
                                {
                                  minWidth:
                                    width > w
                                      ? headers[index]?.minWidth
                                      : width / 2 - 10,
                                },
                              ]}
                              onPress={() => {
                                onClickColumn(row);
                              }}
                            >
                              {value.value ? (
                                <Text
                                  key={`cell-${row._id} ? ${row._id} :${i}`}
                                >
                                  {value.value}
                                </Text>
                              ) : (
                                <Text
                                  key={`cell--${row._id} ? ${row._id} :${i}`}
                                >
                                  {value}
                                </Text>
                              )}
                            </TouchableOpacity>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </View>
                );
              })}
              {businessView ? (
                <></>
              ) : (
                <TouchableOpacity
                  style={{ alignSelf: "flex-end", paddingTop: 5 }}
                  onPress={() => {
                    returnScreen
                      ? navigation.navigate("return-details", {
                          itemId: item._id,
                          type: supplyOrder ? "Supply" : "Procurement",
                        })
                      : navigation.navigate("orderDetails", {
                          itemId: item._id,
                          procurement: procurement,
                          supplyOrder: supplyOrder,
                          ecommerceOrder: ecommerceOrder,
                        });
                  }}
                >
                  <Text style={[orderDetailStyle, { color: "#2B547E" }]}>
                    Show Details
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
