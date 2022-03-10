import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
import config from "../../config/config";

const categorySlider = ({ item, onPress }) => {
  return (
    <ScrollView
      // pagingEnabled={true}
      showsHorizontalScrollIndicator={true}
      horizontal={true}
      style={{
        padding: 10,
      }}
    >
      {item?.map((e, i) => (
        <View
          key={e._id}
          style={{
            width: 75,
            height: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => onPress(e._id)}
            style={{
              backgroundColor: "#82777717",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
              width: 50,
              height: 50,
            }}
          >
            {e.icon && e.icon.mimType ? (
              <Image
                source={{
                  uri:
                    config.baseUrl +
                    `/api/category/image?id=${e._id}&type=icon`,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 30,
                  alignSelf: "center",
                }}
              ></Image>
            ) : (
              <Text style={{ fontSize: 25 }}>
                {e.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            style={{
              alignSelf: "center",
            }}
          >
            {e.name.length < 10
              ? `${e.name.capitalize()}`
              : `${e.name.substring(0, 3).capitalize()}...`}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default connect(null, {})(categorySlider);
