import React, { useEffect, useState } from "react";
import { useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
import { DimensionContext } from "../../components/dimensionContext";

const categoryWrap = ({ item, onPress }) => {
  const { window } = useContext(DimensionContext);
  return (
    <ScrollView
      style={{
        marginVertical: 5,
        minHeight:
          Platform.OS === "android" || Platform.OS === "ios"
            ? window.height / 4
            : null,
        maxHeight:
          Platform.OS === "android" || Platform.OS === "ios"
            ? window.height / 4
            : null,
      }}
      nestedScrollEnabled={true}
      scrollEnabled={true}
    >
      <View
        style={{
          width: "100%",
          justifyContent: "space-around",
          flexWrap: "wrap",
          flexDirection: "row",
          padding: 5,
        }}
      >
        {item?.map((e, i) => (
          <View
            key={e._id}
            style={{
              width: 80,
              height: 80,
              height: "auto",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => onPress(e._id)}
              style={{
                backgroundColor: "#82777717",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                width: Platform.OS === "web" ? 100 : window.width / 3,
                height: 130,
              }}
            >
              <View
                style={{
                  width: 95,
                  height: 95,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {e.image && e.image.image ? (
                  <Image
                    source={{
                      uri: `data:${e.image.mimType};base64,${e.image.image}`,
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 7,
                    }}
                  ></Image>
                ) : (
                  <Text style={{ fontSize: 80, textAlignVertical: "center" }}>
                    {e.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: 30,
                  maxWidth: 100,
                  paddingHorizontal: 5,
                  justifyContent: "center",
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                  }}
                >
                  {e.name.capitalize()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default connect(null, {})(categoryWrap);
