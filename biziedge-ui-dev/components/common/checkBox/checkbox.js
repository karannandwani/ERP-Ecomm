import * as React from "react";
import { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { DimensionContext } from "../../dimensionContext";
import Icon from "../icon";

const Checkbox = ({
  value,
  setValue = () => {},
  style,
  disable,
  isLabel,
  labelStyle,
  label,
  selectionValue,
  containerStyle,
}) => {
  const [checked, setChecked] = React.useState(value ? value : false);
  React.useEffect(() => {
    setChecked(value ? value : false);
  }, [value]);
  const { window } = useContext(DimensionContext);
  return disable ? (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styles.checkbox,
          { backgroundColor: checked ? "#43425D" : "#FFFFFF" },
          style,
        ]}
      >
        {value ? <Icon name="tick" style={styles.icon}></Icon> : <></>}
        {isLabel ? (
          <Text
            style={[{ flex: 2, marginLeft: 10 }, labelStyle, styles.labelStyle]}
          >
            {label ? label : "Available"}
          </Text>
        ) : (
          <></>
        )}
      </View>
    </View>
  ) : (
    <View>
      <TouchableOpacity
        style={[
          {
            // flex: 1,
            flexDirection: "row",
            alignItems: "center",
          },
          containerStyle,
        ]}
        onPress={() => {
          setChecked(!checked);
          if (setValue) setValue(!checked);
        }}
      >
        <View
          style={[
            styles.checkbox,
            style,
            { backgroundColor: checked ? "#41B000" : "#FFFFFF" },
          ]}
        >
          {checked ? <Icon name="tick" style={styles.icon}></Icon> : <></>}
        </View>
        {isLabel ? (
          <Text
            style={[
              {
                marginLeft: 5,
              },
              styles.labelStyle,
              labelStyle,
            ]}
          >
            {label ? label : "Available"}
          </Text>
        ) : (
          <></>
        )}
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
    minWidth: 25,
    height: 25,
    minHeight: 25,
    maxHeight: 25,
    // flex: 1,
  },
  labelStyle: {
    color: "#000",
  },
  icon: {
    color: "red",
  },
});

export default Checkbox;
