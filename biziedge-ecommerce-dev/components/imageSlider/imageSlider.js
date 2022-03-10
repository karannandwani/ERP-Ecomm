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
import ImageSlider from "react-native-image-slider";
const imageSlider = () => {
  const images = [
    {
      image: "https://placeimg.com/640/640/nature",
      url: "https://www.youtube.com/",
    },
    {
      image: "https://placeimg.com/640/640/people",
      url: "https://www.youtube.com/",
    },
    {
      image: "https://placeimg.com/640/640/animals",
      url: "https://www.youtube.com/",
    },
    {
      image: "https://placeimg.com/640/640/beer",
      url: "https://www.youtube.com/",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ImageSlider
        autoPlayWithInterval={2000}
        loopBothSides
        images={images.map((e, i) => e.image)}
        customSlide={({ index, item, style, width }) => (
          <TouchableOpacity>
            <View key={index} style={[style, styles.customSlide]}>
              <Image source={{ uri: item }} style={styles.customImage} />
            </View>
          </TouchableOpacity>
        )}
        customButtons={(position, move) => (
          <View style={styles.buttons}>
            {images.map((image, index) => {
              return (
                <View key={image.image + " " + index}>
                  <TouchableHighlight
                    key={index}
                    underlayColor="#ccc"
                    onPress={() => move(index)}
                    style={styles.button}
                  >
                    <Text style={position === index && styles.buttonSelected}>
                      {index + 1}
                    </Text>
                  </TouchableHighlight>
                </View>
              );
            })}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  slider: { backgroundColor: "#000", height: 350 },
  content1: {
    width: "100%",
    height: 50,
    marginBottom: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  content2: {
    width: "100%",
    height: 100,
    marginTop: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: { color: "#fff" },
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    margin: 3,
    width: 15,
    height: 15,
    opacity: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSelected: {
    opacity: 1,
    color: "red",
  },
  customSlide: {
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  customImage: {
    width: "100%",
    height: "100%",
  },
});
export default imageSlider;
