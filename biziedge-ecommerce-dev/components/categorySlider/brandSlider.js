import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  image,
  Pressable,
  TouchableHighlight,
} from "react-native";
import { Dimensions, Platform, SafeAreaView } from "react-native";
import { connect } from "react-redux";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
const brandSlider = ({ item, onPress }) => {
  const [dimensions, setDimensions] = useState({ window, screen });
  const [width, setWidth] = useState(dimensions.window.width);
  const [height, setHeight] = useState(dimensions.window.height);
  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
    setWidth(window.width);
    setHeight(window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <ScrollView
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      style={{
        flex: 1,
        maxHeight: window.height * 0.18,
        minHeight: window.height * 0.18,
        maxWidth: window.width,
      }}
    >
      {item?.map((e, i) => (
        <View
          key={e._id}
          style={{
            maxHeight: window.height * 0.15,
            minHeight: window.height * 0.15,
            minWidth: window.width / 4,
            maxWidth: window.width / 4,
            borderRadius: 50,
            marginLeft: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 15,
            elevation: 5,
            alignSelf: "center",
            zIndex: 1,
          }}
        >
          <TouchableOpacity onPress={onPress}>
            <Image
              style={{
                borderRadius: 50,
                maxHeight: window.height * 0.15,
                minHeight: window.height * 0.15,
                minWidth: window.width / 4,
                maxWidth: window.width / 4,
                // height: 300,
                // width: 250,
              }}
              source={
                e.image?.length > 0
                  ? {
                      uri: `data:image/jpeg;base64,${
                        (e?.image.find((x) => x.default) || e?.image[0]).image
                      }`,
                    }
                  : require("../../assets/perfume.jpeg")
              }
            ></Image>
            <Text
              style={{ alignSelf: "center", fontWeight: "300", fontSize: 12 }}
            >
              {e.name}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default connect(null, {})(brandSlider);
