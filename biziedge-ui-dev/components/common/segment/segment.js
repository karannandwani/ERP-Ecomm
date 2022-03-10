import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const Segment = ({
  values,
  selectedValue,
  setSelectedValue,
  handleCallBack,
  headerStyle,
}) => {
  return (
    <View
      style={{
        minHeight: 50,
        maxHeight: 50,
        flex: 1,
        width: "100%",
      }}
    >
      <View style={styles.row}>
        {values.map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => {
              setSelectedValue(value);
              handleCallBack(value);
            }}
            style={[
              styles.button,
              selectedValue === value && styles.selected,
              [values.length > 2 ? { minWidth: "33.333%" } : {}],
            ]}
          >
            <Text
              style={[
                styles.buttonLabel,
                selectedValue === value && styles.selectedLabel,
                headerStyle,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Segment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    backgroundColor: "rgb(67, 66, 93)",
  },
  button: {
    backgroundColor: "#fff",
    minWidth: "50%",
    textAlign: "center",
    borderRadius: 0,
    minHeight: 50,
    maxHeight: 50,
    paddingTop: 5,
  },
  selected: {
    borderBottomColor: "#3880ff",
    borderBottomWidth: 1,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "black",
    paddingTop: 10,
    textAlign: "center",
  },
  selectedLabel: {
    color: "#3880ff",
  },
});
