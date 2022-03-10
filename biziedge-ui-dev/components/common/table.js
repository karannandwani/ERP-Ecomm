import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
export default function Table({
  renderData,
  headerItems,
  headerStyle,
  extractionLogic,
  keyExtractor,
  onClickColumn,
  isJsx,
  tableName,
  style,
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          height: "auto",
          width: "100%",
          backgroundColor: "#fff",
          padding: 15,
        },
        style,
      ]}
    >
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4D4F5C" }}>
          {tableName ? tableName : <></>}
        </Text>
      </View>
      <View style={styles.cardHeader}>
        {headerItems.map((item) => {
          return (
            <View style={styles.headerItems}>
              <Text style={styles.text}>{item}</Text>
            </View>
          );
        })}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flexDirection: "column",
        }}
      >
        {isJsx
          ? renderData.map((row, index) => {
              return (
                <View
                  key={`v-${keyExtractor ? keyExtractor(row) : index}`}
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    ...styles.row,
                    marginBottom: 2,
                    alignItems: "center",
                  }}
                >
                  {extractionLogic({ row, index })}
                </View>
              );
            })
          : renderData.map((row, index) => {
              return (
                <View key={`v-${keyExtractor ? keyExtractor(row) : index}`}>
                  <TouchableOpacity
                    onPress={() => {
                      onClickColumn(row);
                    }}
                    style={{
                      flexDirection: "row",
                      borderBottomColor: "#F1F1F3",
                      borderBottomWidth: 1,
                      ...styles.row,
                    }}
                  >
                    {extractionLogic({ row, index }).map((cell) => {
                      return (
                        <View style={styles.rowItems}>
                          <Text>{cell}</Text>
                        </View>
                      );
                    })}
                  </TouchableOpacity>
                </View>
              );
            })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F6FA",
    flexWrap: "wrap",
    flex: 1,
    minHeight: 35,
    alignItems: "center",
    maxHeight: 40,
  },
  headerItems: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#A3A6B4",
  },
  row: {
    justifyContent: "space-between",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    alignSelf: "center",
    alignContent: "center",
    padding: 10,
  },
  rowItems: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // flexWrap: "wrap"
    maxWidth: 300,
    alignItems: "center",
    padding: 10,
  },
});
