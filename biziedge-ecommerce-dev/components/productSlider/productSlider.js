import React, { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { DimensionContext } from "../../components/dimensionContext";
import config from "../../config/config";

const productSlider = ({ item, onPress }) => {
  const { window } = useContext(DimensionContext);
  return (
    <ScrollView
      pagingEnabled={true}
      showsHorizontalScrollIndicator={true}
      horizontal={true}
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      {item.map((e, i) => (
        <View
          key={e?._id}
          style={
            (styles.container,
            {
              flex: 1,
              margin: 10,
              padding: 10,
              borderRadius: 5,
              overflow: "hidden",
              borderColor: "#999",
              borderWidth: 0.5,
              backgroundColor: "#FFF",
              elevation: 4,
            })
          }
        >
          <TouchableOpacity
            onPress={() => onPress(e.category)}
            style={styles.card}
          >
            <Image
              source={{
                uri: config.baseUrl + `/api/product/image/view?id=${e._id}`,
              }}
              style={styles.cardImage}
            />
            <View>
              <Text style={styles.textLeft}>{e?.name.capitalize()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    minHeight: 200,
    minWidth: 200,
    maxHeight: 200,
    maxWidth: 200,
  },
  cardImage: {
    borderRadius: 5,
    height: 180,
    minHeight: 180,
    width: "100%",
  },
  textLeft: {
    alignSelf: "center",
    marginTop: 5,
  },
  textRight: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export default connect(null, {})(productSlider);
{
  /*<View
          key={e._id}
          style={{
            borderRadius: 20,
            marginLeft: 10,
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 15,
            elevation: 5,
            alignSelf: "center",
            zIndex: 1,
          }}
        >
           <TouchableOpacity
            style = {{flex: 1, flexDirection: "row"}}
              onPress={onPress}
            >
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Image
               source={
                e.image.length > 0
                  ? {
                      uri: `data:image/jpeg;base64,${
                        (e?.image.find((x) => x.default) || e?.image[0]).image
                      }`,
                    }
                  : require("../../assets/products.png")
              }
                resizeMode = "contain"
                style = {{
                    width: 130,
                    height: 100,
                }}
                />
            </View>
            <View style={{
                flex: 1.5,
                justifyContent: "center",
            }}>
                <Text>{e.name}</Text>
            </View>
            </TouchableOpacity>
   
        </View>*/
}
