import React, { useState, useEffect } from "react";

import {
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "../components/common/icon";
import { connect } from "react-redux";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
function tabNavigationDesign({
  state,
  descriptors,
  navigation,
  currentCart,
  backgroundColor,
  changeBackground,
}) {
  const [dimensions, setDimensions] = useState({ window, screen });
  const [width, setWidth] = useState(dimensions.window.width);
  const [height, setHeight] = useState(dimensions.window.height);
  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
    setWidth(window.width, screen.width);
    setHeight(window.height, screen.height);
  };
  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

  return (
    // <View
    //   style={{
    //     backgroundColor: "red",
    //   }}
    // >
    <View
      style={{
        backgroundColor:
          descriptors[state.routes[state.index].key].options.backgroundColor ||
          "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 50,
      }}
    >
      <View style={styles.tabNavigationCss}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const icon =
            options.tabBarIcon !== undefined ? options.tabBarIcon : null;
          // const backgroundColor =
          //   options.activeBackgroundColor !== undefined
          //     ? options.activeBackgroundColor
          //     : null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <View key={`menu-${label}`}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityStates={isFocused ? ["selected"] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={
                  {
                    // backgroundColor: "yellow",
                    // paddingHorizontal: window.width > 450 ? 20 : window.width / 18,
                    // flex: 1,
                    // alignItems: "center",
                  }
                }
              >
                <View
                  style={{
                    // marginTop: window.height > 600 ? 20 : window.height / 18,
                    // justifyContent: "space-between",
                    // marginRight: window.width > 450 ? 18 : window.width / 21.17,
                    // left: 6,
                    alignSelf: "center",
                  }}
                >
                  <View style={{}}>
                    <Icon
                      fill={isFocused ? "#FA4248" : "#A9A9A9"}
                      name={icon}
                    ></Icon>
                  </View>
                  <View>
                    {!currentCart || currentCart.products.length === 0 ? (
                      <></>
                    ) : icon === "cart" ? (
                      <View
                        style={{
                          position: "absolute",
                          bottom: 10,
                          right: -5,
                          height: 18,
                          width: 18,
                          borderRadius: 15,
                          backgroundColor: "#FA4248",
                          justifyContent: "center",
                          zIndex: 2000,
                          marginLeft: 12,
                        }}
                      >
                        <Text style={{ color: "#fff", alignSelf: "center" }}>
                          {currentCart.products.length}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      color: isFocused ? "red" : "black",
                      alignSelf: "center",
                      fontSize: 12,
                    }}
                  >
                    {label.trim()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}
const mapStateToProps = ({ currentCart }) => ({ currentCart });
const styles = StyleSheet.create({
  tabNavigationCss: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderBottomWidth: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: 55,
    justifyContent: "space-evenly",
    alignItems: "center",
    borderBottomColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 50,
  },
});
export default connect(mapStateToProps)(tabNavigationDesign);
