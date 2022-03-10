import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
export const DataTable = ({
  data,
  extractionLogic,
  headers,
  width,
  height,
  headerStyle,
  rowStyle,
  cellStyle,
  onClickColumn,
}) => {
  const w = headers?.reduce((x, y) => x + y.minWidth || 50, 0);
  return (
    <View
      style={{
        minWidth: width,
        maxWidth: width,
        maxHeight: height,
        flex: 1,
      }}
    >
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
            headerStyle,
          ]}
        >
          {headers.map((header, i) => {
            return (
              <Text
                key={`header-${i.toString()}`}
                style={[
                  { textAlign: "center", flex: 1 },
                  headerStyle,
                  { minWidth: header.minWidth },
                  header.maxWidth ? { maxWidth: header.maxWidth } : {},
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
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{
          flex: 1,
          flexGrow: 1,
        }}
        nestedScrollEnabled={true}
      >
        {data.map((row, i) => {
          return (
            <View
              key={row && row._id ? `row-${row._id}` : `row-${i}`}
              style={[
                {
                  flex: 1,
                  flexWrap: "wrap",
                  flexDirection: "row",
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
                        key={`head-cell-${i}`}
                        style={[
                          {
                            textAlign: "center",
                            flex: 1,
                            maxHeight: 40,
                            minHeight: 40,
                            justifyContent: "center",
                            paddingTop: 10,
                          },
                          headerStyle,
                          {
                            minWidth: width / 2 - 10,
                          },
                        ]}
                      >
                        {headers[index]?.value}
                      </Text>
                    )}
                    {value.component ? (
                      <View
                        // key={`head-cell-${row._id} ? ${row._id} :${i}`}
                        style={[
                          {
                            textAlign: "center",
                            flex: 1,
                            minHeight: 40,
                            maxHeight: 40,
                          },
                          cellStyle,
                          {
                            minWidth:
                              width > w
                                ? headers[index]?.minWidth
                                : width / 2 - 10,
                          },
                          headers[index]?.maxWidth
                            ? { maxWidth: headers[index].maxWidth }
                            : {},
                        ]}
                      >
                        {value.component()}
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          {
                            textAlign: "center",
                            flex: 1,
                            minHeight: 40,
                            maxHeight: 40,
                          },
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
                          <Text>{value.value}</Text>
                        ) : (
                          <Text numberOfLines={2}>{value}</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
