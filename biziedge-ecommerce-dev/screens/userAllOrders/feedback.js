import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import { Platform } from "react-native";
import Icon from "../../components/common/icon";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImagePicker from "../../components/common/imageCard/imageCard";
import FormComponent from "../../components/common/Form/FormComponent";
import { orderFeedback } from "../../redux/actions/order.action";

const feedback = ({ navigation, route, orders, orderFeedback }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(-1);
  const pickImage = () => {
    const options = {
      storageOptions: {
        path: "images",
        mediaType: "photo",
      },
      includeBase64: true,
      base64: true,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("error");
      } else {
        const source = response.assets[0].base64;
        // const source = {
        //   uri:
        //     `data:${response.assets[0].type};base64,` +
        //     response.assets[0].base64,
        // };
        setImage(source);
      }
    });
  };
  useEffect(() => {
    if (route?.params) {
      let tempOrder = orders.find((e) => e._id === route.params.itemId);
      setSelectedOrder({ ...tempOrder });
    }
  }, [orders, route]);

  let arr = new Array(5);
  const submit = () => {
    let obj = {
      orderId: selectedOrder._id,
      image:
        Platform.OS === "web"
          ? [{ imageData: image }]
          : image
          ? [{ imageData: "data:image/jpeg;base64," + image }]
          : [],
      comment: comment,
      rating: rating + 1,
    };
    orderFeedback(obj);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2 }}>
        <SaiWinLogo
          backIconStyle={{
            marginLeft: 10,
          }}
          containerStyle={{
            height: Platform.OS === "android" ? 150 : 100,
            flexDirection: "row",
            backgroundColor: "#fff",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
          onPressIcon={() => navigation.navigate("user-orders")}
          imageStyle={{ marginTop: 5 }}
          onPressLogo={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
        ></SaiWinLogo>
      </View>
      <View
        style={{
          flex: 8,
          backgroundColor: "#fff",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
      >
        <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
          <View style={{ justifyContent: "space-between" }}>
            <Text
              style={{
                marginTop: 15,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              ORDER #{selectedOrder?.orderNo}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 13 }}>
              {[...arr.keys()].map((x, i) => {
                return (
                  <TouchableOpacity onPress={() => setRating(i)}>
                    <Icon
                      fill={rating >= i ? "rgb(193, 56, 62)" : "grey"}
                      name="star"
                    ></Icon>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Add a written review
            </Text>
          </View>

          <TextInput
            placeholder="What did you like or dislike ? What did you use this product for?"
            style={{
              borderWidth: 3,
              borderColor: "#DFE0E3",
              minHeight: 100,
              justifyContent: "flex-start",
              textAlignVertical: "top",
            }}
            multiline={true}
            onChangeText={(e) => setComment(e)}
          ></TextInput>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Add Photos</Text>
            <Text style={{ color: "rgb(120, 121, 123)" }}>
              Shoppers find images more helpful than text alone
            </Text>
          </View>
          {Platform.OS === "web" ? (
            <ImagePicker
              onSelection={(e) => setImage(e)}
              style={styles.imageHolder}
              multiple={false}
              data={image}
            ></ImagePicker>
          ) : (
            <View>
              <TouchableOpacity
                style={{
                  width: "70%",
                  height: 100,
                  backgroundColor: "#B4B4B4",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
                onPress={() => pickImage()}
              >
                {image ? (
                  <Image
                    style={{ width: "100%", height: 100 }}
                    source={{
                      uri:
                        Platform.OS === "web"
                          ? image
                          : "data:image/jpeg;base64," + image,
                    }}
                  ></Image>
                ) : (
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Add Image
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={{
                  backgroundColor: "#B4B4B4",
                  minWidth: 150,
                  maxWidth: 150,
                  marginTop: 10,
                  alignSelf: "center",
                  borderRadius: 30,
                  height: 25,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  Remove image
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* <ImagePicker
            onSelection={(e) => setImage(e)}
            style={styles.imageHolder}
            multiple={false}
            data={image}
          ></ImagePicker> */}
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          submit();
          navigation.navigate("user-orders");
        }}
        style={{ flex: 1.3, justifyContent: "flex-end" }}
      >
        <View
          style={{
            height: Platform.OS === "android" ? 50 : 50,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: "#FA4248",
            alignContent: "flex-end",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "bold",
              color: "#fff",
              alignSelf: "center",
            }}
          >
            SUBMIT
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  imageHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    maxHeight: 100,
    minHeight: "50%",
    maxWidth: "100%",
    // backgroundColor: "lightgray",
    borderWidth: 3,
    borderColor: "#DFE0E3",
    padding: 5,
  },
  circle: {
    width: "60%",
    height: 100,
    borderRadius: 7,
    backgroundColor: "#B4B4B4",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
const mapStateToProps = ({ orders }) => ({
  orders,
});

export default connect(mapStateToProps, { orderFeedback })(feedback);
