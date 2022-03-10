import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import orderDetails from "../../screens/orderAndReturns/orderDetails";
import Button from "../common/buttom/button";
import * as Print from "expo-print";
import lodash from "lodash";
import uuid from "react-native-uuid";
import Pipes from "../../util/pipes";
import moment from "moment";
import { DimensionContext } from "../../components/dimensionContext";
import { Styles } from "../../globalStyle";
const printForWeb = (content) => {
  var wnd = window.open("about:blank", "", "_blank");
  wnd.document.write(content);
  wnd.print();
};
const OrderInvoiceComponent = ({ data, pressFunc, password, ecomOrder }) => {
  const [printButton, setPrintButton] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [taxes, setTaxes] = useState([]);
  let pipe = new Pipes();

  useEffect(() => {
    if (data) {
      let taxList = data?.products
        .map((x) => x.lots.map((x) => x.tax))
        .flat()
        .flat();

      let extraTaxes = data?.products
        .filter((x) => x.extraTax && x.extraTax.length > 0)
        .map((x) => x.extraTax)
        .flat()
        .map((x) => ({ ...x, type: x.name, percent: x.percentage }));
      let total = Object.entries(
        lodash.groupBy([...taxList, ...extraTaxes], "type")
      ).map((aa) => ({
        type: aa[0],
        taxes: Object.entries(lodash.groupBy(aa[1], "percent")).map((x) => ({
          percent: x[0],
          sum: x[1].map((x) => x.amount).reduce((a, b) => a + b, 0),
        })),
      }));
      setTaxes(total);

      let products = data?.products.map((x) => ({
        ...x,
        lots: x.lots.map((xy) => ({
          ...xy,
          lotTotal:
            // xy.tax.map((t) => t.amount).reduce((a, b) => a + b, 0) +
            (xy.noOfCase * xy.qtyPerCase + xy.noOfProduct) * xy.costPrice,
        })),
      }));
      setOrderProducts(products);
    }
  }, [data]);
  const print = async () => {
    try {
      const html = `<html>
    <head>
    <style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    .header{
      background-color: #dddddd;
    }
    .row{
      display:flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .address{
      margin: 0px;
    }
    .tableData{
      text-align: center
    }
    </style>
    </head>
    <body>
      <div>
    <h3>Invoice</h3>
      </div>
      <div class="row">
      <div>
    <h2>Supplier: ${data?.suppliers?.name}<h2>  
      </div>
      <div>
      <p>Invoice:# ${data?.orderNo}<p>  
        </div>
        </div>
      <div>
      <p>Phone No:-${data?.suppliers?.phone ? data?.suppliers?.phone : ""}<p>  
        </div>
        <div class="row">
        <div>
        ${
          ecomOrder
            ? `<h3 class="address">${data?.address?.name}</h3>
          <p class="address">${data?.address.email}</p>
          <p class="address">
            ${data?.address.phone}
            ${
              data?.address.alternativePhone
                ? `, ${data?.address.alternativePhone}`
                : ""
            }
          </p>
          <p class="address">
            ${data?.address.street1} ${", " + data?.address.street2}
          </p>
          <p class="address">
            ${data?.address.city} ${", " + data?.address.pincode}
          </p>
          <p class="address">
            ${data?.address.state} ${", " + data?.address.country}
          </p>`
            : `<h3 class="address"> ${data?.facility?.name}</h3>
        <p class="address"> ${data?.facility?.address}<p>`
        }  
          </div>
          <div>
          <h3> Order Date: ${moment(
            new Date(parseInt(data?._id.toString().substring(0, 8), 16) * 1000)
          ).format("DD/MM/YYYY")}<h3>  
            </div>
        </div>        
      <div>
      <div style="margin-top: 10px;">
        <table class="table">
          <tr class="header">
            <th>Item</th>
            <th>PRICE/UNIT</th>
            <th>PRODUCT QTY</th>
            <th>CASE QTY</th>
            <th> CGST %</th>
            <th> CGST in ₹</th>
            <th> SGST %</th>
            <th> SGST in ₹</th>
            <th>TOTAL</th>
          </tr>
          ${orderProducts?.map((op) =>
            op.lots.map((x) => {
              return `
          <tr >
            <td class="tableData">
              <p >${op.product.name}</p>
            </td>
            <td class="tableData">
              <p> ${x.costPrice}</p>
            </td>
            <td class="tableData">
            <p> ${x.noOfProduct}</p>
            </td>
            <td class="tableData">
             <p> ${x.noOfCase}</p>
            </td>
           <td class="tableData">
            <p> ${x.tax.find((t) => t.type === "CGST").percent}%</p>
           </td>
           <td class="tableData">
            <p> ${pipe.formatter.format(
              x.tax.find((t) => t.type === "CGST").amount
            )}</p>
           </td>
           <td class="tableData">
            <p> ${x.tax.find((t) => t.type === "SGST").percent}%</p>
          </td>
           <td class="tableData">
           <p>  ${pipe.formatter.format(
             x.tax.find((t) => t.type === "SGST").amount
           )}</p>
          </td>
          <td class="tableData">
           <p>  ${x.lotTotal}</p>
           </td>
          </tr>
          `;
            })
          )}
      </table>
      
     
<div style="padding-top:30px;text-align: end">
${taxes?.map((x) => {
  return `
  <div class="row" style="justify-content: flex-end; align-items: center;">
      <div >
         <b> ${x.type}</b>
      </div>
      <div style="min-width: 110px">
        ${x.taxes.map((y) => {
          return `<p>${
            " @" + y.percent + "%" + "  " + pipe.formatter.format(y.sum)
          }</p>`;
        })}
          </div>
       </div>
      `;
})}
      </div>
      <div class="row" style="justify-content: flex-end; align-items: center;">
    <div>
      <b>SubTotal:</b>
      </div>
      <div style="min-width: 70px; text-align: end">
        <p>  ${pipe.formatter.format(data?.subTotal)}</p>
       </div>
    </div>
    <div style="padding-top:100px;text-align:start;  ">
      ${!ecomOrder ? `<p>Delivery Password:${data?.password}</p>` : ``}
      </div>
    </body>
    </html>`;
      Platform.OS === "web"
        ? printForWeb(html)
        : await Print.printAsync({ html: html });
    } catch (err) {
      console.error(err);
    }
  };
  const headers = [
    { value: "ITEM", minWidth: 100 },
    { value: "PRICE/UNIT", minWidth: 100 },
    { value: " PRODUCT QTY", minWidth: 100 },
    { value: "CASE QTY", minWidth: 100 },
    { value: "CGST %", minWidth: 100 },
    { value: " CGST in ₹", minWidth: 100 },
    { value: "SGST %", minWidth: 100 },
    { value: "SGST in ₹", minWidth: 100 },
    { value: "TOTAL", minWidth: 100 },
  ];
  const w = headers.reduce((x, y) => x + y.minWidth || 50, 0);
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const onChange = ({ window }) => {
    setWidth(window.width >= 1040 ? window.width - 260 : window.width - 40);
    setHeight(window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  const extractionLogic = ({ op, row, index }) => {
    if (row) {
      return [
        <Text>{op.product.name}</Text>,
        <Text key={uuid.v4()}>
          {pipe.formatter.format(ecomOrder ? row.retailPrice : row.costPrice)}
        </Text>,
        <Text>{row.noOfProduct}</Text>,
        <Text>{row.noOfCase}</Text>,
        <Text key={uuid.v4()}>
          {row.tax.find((t) => t.type === "CGST")?.percent}%
        </Text>,
        <Text key={uuid.v4()}>
          {pipe.formatter.format(
            row.tax.find((t) => t.type === "CGST")?.amount
          )}
        </Text>,
        <Text key={uuid.v4()}>
          {row.tax.find((t) => t.type === "SGST")?.percent}%
        </Text>,
        <Text key={uuid.v4()}>
          {pipe.formatter.format(
            row.tax.find((t) => t.type === "SGST")?.amount
          )}
        </Text>,
        <Text>{pipe.formatter.format(row.lotTotal)}</Text>,
      ];
    } else {
      return [];
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {width > w ? (
        <View
          style={[
            {
              flex: 1,
              flexWrap: "wrap",
              flexDirection: "row",
              maxHeight: 50,
              backgroundColor: "#43425d",
            },
            Styles.headerStyle,
          ]}
        >
          {headers.map((header, i) => {
            return (
              <Text
                key={`header-${i.toString()}`}
                style={[
                  { textAlign: "center", flex: 1 },
                  Styles.headerStyle,
                  { minWidth: header.minWidth },
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
      <ScrollView
        style={{
          flex: 1,
          flexGrow: 1,
        }}
        nestedScrollEnabled={true}
      >
        {orderProducts?.map((op) =>
          op.lots.map((row, i) => {
            return (
              <View
                key={"row-" + row._id || i}
                style={[
                  {
                    flex: 1,
                    flexWrap: "wrap",
                    flexDirection: "row",
                  },
                  Styles.rowStyle,
                ]}
              >
                {extractionLogic({ op, row, index: i }).map((value, index) => {
                  return (
                    <React.Fragment key={index}>
                      {width > w ? (
                        <></>
                      ) : (
                        <Text
                          style={[
                            {
                              textAlign: "center",
                              flex: 1,
                              maxHeight: 40,
                              minHeight: 40,
                              justifyContent: "center",
                              paddingTop: 10,
                            },
                            Styles.headerStyle,
                            {
                              minWidth: width / 2 - 10,
                            },
                          ]}
                        >
                          {headers[index].value}
                        </Text>
                      )}
                      <TouchableOpacity
                        style={[
                          {
                            textAlign: "center",
                            flex: 1,
                            minHeight: 40,
                            maxHeight: 40,
                          },
                          Styles.cellStyle,
                          // {
                          //   minWidth:
                          //     width > w
                          //       ? headers[index]?.minWidth
                          //       : width / 2 - 10,
                          // },
                        ]}
                      >
                        <Text>{value}</Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </View>
            );
          })
        )}
      </ScrollView>
      <View style={{ alignSelf: "flex-end" }}>
        <View
          style={{
            marginRight: 20,
          }}
        >
          {taxes?.map((x) => {
            return (
              <View
                key={Math.random()}
                style={{ flexDirection: "row", margin: 3 }}
              >
                <Text style={{ fontWeight: "bold" }}>{x.type} - </Text>
                <View style={{ flexWrap: "wrap", alignItems: "center" }}>
                  {x.taxes.map((y) => {
                    return (
                      <Text key={Math.random()}>
                        {" @" +
                          y.percent +
                          "%" +
                          "  " +
                          pipe.formatter.format(y.sum)}
                      </Text>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
        {data?.discount ? (
          <View
            style={{
              maxHeight: 30,
            }}
          >
            <Text style={{ fontWeight: "bold", margin: 20, fontSize: 16 }}>
              Discount:
            </Text>
            <Text>{pipe.formatter.format(data?.discount)}</Text>
          </View>
        ) : (
          <></>
        )}
        <View
          style={{
            maxHeight: 30,
          }}
        >
          <View style={{ flexDirection: "row", maxHeight: 50, margin: 3 }}>
            <Text style={{ fontWeight: "bold" }}>Subtotal- </Text>
            <View style={{ flexWrap: "wrap", alignItems: "center" }}>
              {data?.discount ? (
                <Text>
                  {pipe.formatter.format(data?.subTotal - data?.discount)}
                </Text>
              ) : (
                <></>
              )}
              <Text
                style={{
                  textDecorationLine: data?.discount ? "line-through" : "none",
                }}
              >
                {pipe.formatter.format(data?.subTotal)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ marginBottom: 10, marginLeft: 10 }}>
          {data?.password && !ecomOrder ? (
            <Text>Delivery Password : {data?.password}</Text>
          ) : (
            <></>
          )}
        </View>
        <View
          style={{
            maxWidth: 200,
            minWidth: 150,
            marginRight: 20,
          }}
        >
          {data?.password == null ? (
            <Button
              pressFunc={pressFunc}
              title={ecomOrder ? "Send OTP" : "Submit"}
            ></Button>
          ) : (
            <Button pressFunc={print} title="Print"></Button>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 0.2,
    borderColor: "#D8DBDE",
    borderRadius: 8,
  },
});
export default OrderInvoiceComponent;
