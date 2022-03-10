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
import { DimensionContext } from "../dimensionContext";
import config from "../../config/config";

const categoryWrap = ({ item, onPress }) => {
  const { window } = useContext(DimensionContext);
  return (
    // <ScrollView
    //   style={{
    //     marginVertical: 5,
    //     minHeight:
    //       Platform.OS === "android" || Platform.OS === "ios"
    //         ? window.height / 4
    //         : null,
    //     maxHeight:
    //       Platform.OS === "android" || Platform.OS === "ios"
    //         ? window.height / 4
    //         : null,
    //   }}
    //   nestedScrollEnabled={true}
    //   scrollEnabled={true}
    // >
    <View
      style={{
        width: "100%",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        flexDirection: "row",
        marginBottom: 10,
      }}
    >
      {item?.map((e, i) => (
        <View
          key={e._id}
          style={{
            width: 100,
            height: 130,
            height: "auto",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 5,
            marginTop: 10,
            marginRight: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => onPress(e._id)}
            style={{
              backgroundColor: "#82777717",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              width: 100,
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
              {e.image && e.image.mimType ? (
                <Image
                  source={{
                    uri:
                      config.baseUrl +
                      `/api/category/image?id=${e._id}&type=image`,
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
    // </ScrollView>
  );
};

export default connect(null, {})(categoryWrap);
