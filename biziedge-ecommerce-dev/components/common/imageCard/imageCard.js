import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "../icon";
import Button from "../button/button";
import { DimensionContext } from "../../dimensionContext";
import { useContext } from "react";

export default function ImagePickerCard({
  onSelection,
  style,
  multiple,
  data,
  imageStyle,
  uploadTextStyle,
  imageRemove,
}) {
  const { window } = useContext(DimensionContext);
  const [image, setImage] = useState(multiple ? [] : null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    setImage(data && data.length > 0 ? data : multiple ? [] : null);
  }, [data]);

  const checkAvailbeImage = (image, result) => {
    let x = [];
    if (image.length > 0) {
      result.forEach((data) => {
        const found = image.some((el) => el.uri === data.uri);
        if (!found) x.push({ ...data, featured: false });
      });
      return [...image, ...x];
    } else {
      return result.map((x) => ({ ...x, featured: false }));
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: multiple,
    });

    if (!result.cancelled) {
      setImage(
        multiple ? checkAvailbeImage(image, result.selected) : result.uri
      );
      onSelection(
        multiple ? checkAvailbeImage(image, result.selected) : result.uri
      );
    }
  };

  const removeImageFromArray = (index) => {
    image.splice(index, 1);
    onSelection([...image]);
    setImage([...image]);
  };

  const setFeaturedImage = (index) => {
    const images = image.map((x, i) => ({
      ...x,
      featured: index === i ? true : false,
    }));
    setImage(images);
    onSelection(images);
  };

  const removeImage = () => {
    setImage(null);
  };
  return (
    <View style={style}>
      {/* <Icon name="upload"  ></Icon> */}
      <View>
        {image && image.length > 0 ? (
          <></>
        ) : (
          <TouchableOpacity
            style={{
              padding: 10,
              paddingRight: 30,
              paddingLeft: 30,
              backgroundColor: "lightgray",
            }}
            onPress={pickImage}
          >
            <Text
              style={[
                { color: "black", textAlign: "center", fontSize: 13 },
                uploadTextStyle,
              ]}
            >
              Upload Images
            </Text>
          </TouchableOpacity>
          // <Button title="Upload" pressFunc={pickImage} style={styles.btn} />
        )}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {multiple
          ? image?.map((item, index) => {
              return (
                <View>
                  <View
                    style={{
                      flexDirection: "column",
                      margin: 5,
                    }}
                  >
                    <Image
                      source={{
                        uri: item.uri,
                      }}
                      key={item}
                      style={[
                        {
                          width: 80,
                          height: 80,
                        },
                      ]}
                    />
                    {/* <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => {
                        setFeaturedImage(index);
                      }}
                    >
                      <View>
                        <Icon
                          fill={item.featured ? "yellow" : "white"}
                          name="star"
                          style={{ paddingRight: 17 }}
                        ></Icon>
                      </View>
                    </TouchableOpacity>
                  </View> */}
                    <TouchableOpacity
                      onPress={() => {
                        removeImageFromArray(index);
                      }}
                      style={{
                        position: "absolute",
                        right: -10,
                        top: -5,
                      }}
                    >
                      <Icon
                        name="remove"
                        fill="red"
                        style={{
                          width: 20,
                          height: 20,
                        }}
                      ></Icon>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          : image && (
              <Image
                source={{ uri: image }}
                style={[imageStyle ? imageStyle : { width: 140, height: 80 }]}
              />
            )}
      </View>
      <View>
        {image && image.length > 0 && multiple ? (
          <TouchableOpacity onPress={pickImage}>
            <Icon name="plus" fill="red" style={{ width: 25, height: 25 }}>
              <Text> </Text>
            </Icon>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>

      <View>
        {image && !multiple ? (
          <View
            style={[
              {
                marginTop: 10,
                maxHeight: 40,
                justifyContent: "center",
              },
              styles.buttonStyle,
            ]}
          >
            <TouchableOpacity
              style={{
                padding: 10,
                paddingRight: 30,
                paddingLeft: 30,
                backgroundColor: "#FAFAF0",
              }}
              onPress={imageRemove ? imageRemove : removeImage}
            >
              <Text
                style={[{ color: "black", textAlign: "center", fontSize: 14 }]}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
        {/* <Button title="Remove" pressFunc={removeImage} style={styles.btn} /> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonStyle: {
    alignSelf: "center",
    flex: 1,
    backgroundColor: "white",
    width: 120,
    maxHeight: 25,
    minHeight: "10%",
    marginBottom: 5,
    borderRadius: 10,
  },
  checkBox: {
    width: 18,
    minHeight: 20,
    maxHeight: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
