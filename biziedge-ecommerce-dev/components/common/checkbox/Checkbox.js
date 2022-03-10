import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "../icon";

const Checkbox = ({
  value,
  setValue = () => {},
  style,
  disable,
  isLabel,
  labelStyle,
  label,
}) => {
  const [checked, setChecked] = React.useState(value ? value : false);

  React.useEffect(() => {
    setChecked(value ? value : false);
  }, [value]);

  return disable ? (
    <View
      style={[
        styles.checkbox,
        { backgroundColor: checked ? "#FA4248" : "#FFFFFF" },
        style,
      ]}
    >
      {value ? <Icon name="tick" style={styles.icon}></Icon> : <></>}
    </View>
  ) : (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          // justifyContent: "space-between",
        }}
        onPress={() => {
          setChecked(!checked);
          if (setValue) setValue(!checked);
        }}
      >
        <View
          style={[
            styles.checkbox,
            style,
            { backgroundColor: checked ? "#FA4248" : "#FFFFFF" },
          ]}
        >
          {checked ? <Icon name="tick" style={styles.icon}></Icon> : <></>}
        </View>
        <Text style={[labelStyle, { marginTop: 5 }]}>{label ? label : ""}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderColor: "#666",
    borderWidth: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 2,
    width: 25,
    maxWidth: 25,
    minHeight: 25,
    maxHeight: 25,

    marginRight: 30,
  },
});

export default Checkbox;
