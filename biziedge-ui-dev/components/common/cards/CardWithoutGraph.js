import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "react-native";
import Icon from "../../common/icon";

export default function CardWithoutGraph({
  styleContainer,
  header,
  subHeader,
  icon,
  headerStyle,
  subHeaderStyle,
  curLowerStyle,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.boxContainer, styleContainer]}
      onPress={onPress}
    >
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: "#fff",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            paddingRight: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {icon ? (
            <Icon
              style={{ resizeMode: "cover", width: 38, height: 38 }}
              name={icon}
            />
          ) : (
            <Image
              style={{ resizeMode: "cover", width: 38, height: 38 }}
              source={require("../../../assets/icon.png")}
            />
          )}
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.headerStyle, headerStyle]}>{header}</Text>
            <Text style={[styles.subHeaderStyle, subHeaderStyle]}>
              {subHeader}
            </Text>
          </View>
        </View>

        <View style={{ justifyContent: "flex-start" }}>
          <Text
            style={{
              fontSize: 30,
              color: "gray",
              alignSelf: "center",
            }}
          >
            ...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    flex: 1,
    backgroundColor: "#efefef",
    maxWidth: "100%",
  },
  cardContainer: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    padding: 5,
  },

  headerStyle: {
    fontSize: 12,
    color: "red",
  },

  subHeaderStyle: {
    fontSize: 12,
    color: "#4D4F5C",
    fontWeight: "200",
  },

  curLowerStyle: {
    fontSize: 12,
    color: "#FF4141",
    fontWeight: "200",
  },
});
