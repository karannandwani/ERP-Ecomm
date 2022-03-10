import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const CartItemComponent = ({
  id,
  img,
  name,
  price,
  quantity,
  onQtyChange,
  onRemoveFromCart,
}) => {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <Image
          style={styles.itemImage}
          source={
            img
              ? { uri: `data:${img.mimType};base64,${img.image}` }
              : require("../../assets/img.jpeg")
          }
          defaultSource={require("../../assets/img.jpeg")}
        />
      </View>

      <View style={styles.itemDetails}>
        <View
          style={{
            flexDirection: "row",
            alignContent: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <View style={{ flex: 8.5 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{name}</Text>
            <Text style={{ color: "grey", fontStyle: "italic" }}>
              Subtitle here
            </Text>
          </View>
          <View style={{ flex: 1.5, alignItems: "center" }}>
            <Text style={{ color: "red" }}>{price}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "grey",
              alignItems: "center",
              borderRadius: 25,
            }}
          >
            <TouchableOpacity onPress={() => onQtyChange(quantity - 1, id)}>
              <Text style={{ fontSize: 30, paddingLeft: 9 }}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={{ paddingHorizontal: 18, textAlign: "center" }}
              textContentType={"telephoneNumber"}
              value={quantity.toString()}
              onChangeText={(newQty) =>
                onQtyChange(Number.parseInt(newQty), id)
              }
            />
            <TouchableOpacity onPress={() => onQtyChange(quantity + 1, id)}>
              <Text style={{ fontSize: 25, paddingRight: 9 }}>+</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={() => onRemoveFromCart(id)}>
              <Image
                style={{ height: 40, width: 40 }}
                source={require("../../assets/delete.webp")}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 120,
    minHeight: 100,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  imageBox: {
    flex: 3,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 7,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  box3: {
    flex: 4,
    alignItems: "flex-end",
    padding: 4,
  },
  itemImage: {
    minHeight: 100,
    minWidth: 100,
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: 10,
  },
});

export default CartItemComponent;
