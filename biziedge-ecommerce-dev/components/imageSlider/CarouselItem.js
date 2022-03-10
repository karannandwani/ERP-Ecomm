import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");
import config from "../../config/config";

const CarouselItem = ({ item, navigation, type, imageStyle, cardStyle }) => {
  return (
    <View style={[styles.cardView, cardStyle]}>
      <TouchableOpacity
        disabled={type}
        onPress={() => navigation.navigate("homeScreen", item.redirectData)}
      >
        <Image
          style={[styles.image, imageStyle]}
          source={{
            uri:
              item.image ||
              config.baseUrl +
                (type ? item.url : `/api/slide/image?id=${item._id}`),
          }}
        />
      </TouchableOpacity>
      {/* <View style={styles.textView}>
                <Text style={styles.itemTitle}> {item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
            </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    width: width - 20,
    height: height / 3,
    maxHeight: 200,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },

  textView: {
    position: "absolute",
    bottom: 10,
    margin: 10,
    left: 5,
  },
  image: {
    width: width - 20,
    height: height / 3,
    maxHeight: 200,
    borderRadius: 10,
  },
  itemTitle: {
    color: "red",
    fontSize: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0.8, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 3,
    marginBottom: 5,
    fontWeight: "bold",
    elevation: 5,
  },
  itemDescription: {
    color: "red",
    fontSize: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0.8, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default CarouselItem;
