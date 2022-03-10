import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Button from "../common/buttom/button";
import * as Print from "expo-print";
import uuid from "react-native-uuid";
import Pipes from "../../util/pipes";
import moment from "moment";
import { Styles } from "../../globalStyle";

const ReturnInvoiceComponent = ({ data, pressFunc, password }) => {
  let pipe = new Pipes();

  const printForWeb = (content) => {
    var wnd = window.open("about:blank", "", "_blank");
    wnd.document.write(content);
    wnd.print();
  };
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
    .tableData{
      text-align: center
    }
    </style>
    </head>
    <body>
      <div>
    <h3>Return Invoice</h3>
      </div>
      <div class="row">
      <div>
    <h2>${data?.facility?.name}<h2>  
      </div>
      <div>
      <p>Invoice:# ${data?.returnNo}<p>  
        </div>
        </div>
      <div>
      <p>ph-${data?.suppliers?.phone}<p>  
        </div>
        <div class="row">
        <div>
        <h3>Invoice to ${" " + data?.suppliers?.name}<h3>  
          </div>
          <div>
          <h3> Request Date: ${moment(
            new Date(parseInt(data?._id.toString().substring(0, 8), 16) * 1000)
          ).format("DD/MM/YYYY")}<h3>  
            </div>
        </div>
       <div class="row">
       <div>
       <p>${data?.facility?.address}<p>  
         </div>
         <div>
         <h3>Return No: #${data?.returnNo}<h3>  
           </div>
       </div>
        
      <div>
      <div style="margin-top: 10px;">
        <table class="table">
          <tr class="header">
            <th>ITEM</th>
            <th>DESCRIPTION</th>
            <th>PRICE/UNIT</th>
            <th>PRODUCT QTY</th>
            <th>CASE QTY</th>
          </tr>
          ${data?.products?.map((op) =>
            op.lotArray.map((x) => {
              return `
          <tr >
            <td class="tableData">
              <p >${op.product.name}</p>
            </td>
            <td class="tableData">
            <p >${op.product.description}</p>
          </td>
            <td class="tableData">
              <p>₹ ${x.wholesalePrice}</p>
            </td>
            <td class="tableData">
            <p> ${x.noOfProduct}</p>
            </td>
            <td class="tableData">
             <p> ${x.noOfCase}</p>
            </td>
           
          </tr>
          `;
            })
          )}
      </table>


     <div class="row">
     <div style="padding-top:30px;text-align:start;  ">
     <p>Delivery Password: ${data?.password}</p>
     </div>
<div class="row" style="justify-content: flex-end; align-items: center;padding-top:30px">
    <div>
      <b>SubTotal:</b>
      </div>
      <div style="min-width: 70px; text-align: end">
        <p>${pipe.formatter.format(data?.subTotal)}</p>
       </div>
    </div>
   
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
    { value: "DESCRIPTION", minWidth: 100 },
    { value: "PRICE/UNIT", minWidth: 100 },
    { value: " PRODUCT QTY", minWidth: 100 },
    { value: "CASE QTY", minWidth: 100 },
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
        <Text>{op.product.description}</Text>,
        <Text key={uuid.v4()}>
          {pipe.formatter.format(row.wholesalePrice)}
        </Text>,
        <Text>{row.noOfProduct}</Text>,
        <Text>{row.noOfCase}</Text>,
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
        {data?.products?.map((op) =>
          op.lotArray.map((row, i) => {
            return (
              <View
                key={row._id ? `row-${row._id}` : `row-${i}`}
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
                        <Text numberOfLines={2}>{value}</Text>
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
            maxHeight: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              maxHeight: 50,
              margin: 3,
              marginRight: 20,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Subtotal- </Text>
            <View style={{ flexWrap: "wrap", alignItems: "center" }}>
              <Text> {`${" "}  ${pipe.formatter.format(data?.subTotal)}`}</Text>
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
          {data?.password ? (
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
            <Button pressFunc={pressFunc} title="Submit"></Button>
          ) : (
            <Button pressFunc={() => print()} title="Print"></Button>
          )}
        </View>
      </View>
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <View
  //       style={{
  //         backgroundColor: "#D8DBDE",
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         minHeight: 30,
  //         maxHeight: 30,
  //         flex: 1,
  //         alignContent: "center",
  //         alignItems: "center",
  //         padding: 10,
  //       }}
  //     >
  //       <Text style={{ flex: 1, fontWeight: "bold" }}>ITEM</Text>
  //       <Text style={{ flex: 1, fontWeight: "bold", marginRight: 10 }}>
  //         DESCRIPTION
  //       </Text>
  //       <Text style={{ flex: 1, fontWeight: "bold", marginRight: 10 }}>
  //         PRICE/UNIT
  //       </Text>
  //       <Text style={{ flex: 1, fontWeight: "bold", marginRight: 10 }}>
  //         PRODUCT QTY
  //       </Text>
  //       <Text style={{ flex: 1, fontWeight: "bold", marginRight: 10 }}>
  //         CASE QTY
  //       </Text>
  //     </View>
  //     {data?.products?.map((op) =>
  //       op.lotArray.map((x) => {
  //         return (
  //           <View
  //             key={uuid.v4()}
  //             style={{
  //               flexDirection: "row",
  //               justifyContent: "space-between",
  //               flex: 1,
  //               padding: 10,
  //               alignItems: "center",
  //             }}
  //           >
  //             <View style={{ flex: 1 }}>
  //               <Text>{op.product.name}</Text>
  //             </View>
  //             <View style={{ flex: 1 }}>
  //               <Text>{op.product.description}</Text>
  //             </View>
  //             <View style={{ flex: 1 }}>
  //               <Text key={uuid.v4()}>
  //                 {pipe.formatter.format(x.wholesalePrice)}
  //               </Text>
  //             </View>
  //             <View
  //               style={{
  //                 flex: 1,
  //                 marginLeft: 10,
  //               }}
  //             >
  //               <Text>{x.noOfProduct}</Text>
  //             </View>
  //             <View style={{ flex: 1 }}>
  //               <Text>{x.noOfCase}</Text>
  //             </View>
  //           </View>
  //         );
  //       })
  //     )}

  //     <View
  //       style={{
  //         flex: 1,
  //         alignSelf: "flex-end",
  //         flexDirection: "row",
  //         marginRight: 50,
  //         alignItems: "center",
  //       }}
  //     >
  //       <Text style={{ fontWeight: "bold", margin: 20, fontSize: 16 }}>
  //         Subtotal:
  //       </Text>
  //       <Text>{pipe.formatter.format(data?.subTotal)}</Text>
  //     </View>
  //     <View
  //       style={{
  //         justifyContent: "space-between",
  //         flexDirection: "row",
  //         alignItems: "center",
  //       }}
  //     >
  //       <View style={{ marginBottom: 10, marginLeft: 10 }}>
  //         {data?.password ? (
  //           <Text>Delivery Password : {data?.password}</Text>
  //         ) : (
  //           <></>
  //         )}
  //       </View>
  //       <View
  //         style={{
  //           maxWidth: 200,
  //           minWidth: 150,
  //           marginRight: 20,
  //         }}
  //       >
  //         {data?.password == null ? (
  //           <Button pressFunc={pressFunc} title="Submit"></Button>
  //         ) : (
  //           <Button
  //             pressFunc={() => print()}
  //             title="Print"
  //           ></Button>
  //         )}
  //       </View>
  //     </View>
  //   </View>
  // );
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
export default ReturnInvoiceComponent;
