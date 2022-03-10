import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/button/button";
import Icon from "../../components/common/icon";
import { fetchAddress } from "../../redux/actions/address.action";
import { logout } from "../../redux/actions/login.action";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
const UserProfile = ({ user, logout, navigation, addresses, fetchAddress }) => {
  // let userAddress =
  //   addresses.length === 1
  //     ? addresses[0]
  //     : addresses.find((e) => (e.default = true));
  const [dimensions, setDimensions] = useState({ window, screen });
  const [width, setWidth] = useState(dimensions.window.width);
  const [height, setHeight] = useState(dimensions.window.height);
  const [userAddress, setUserAddress] = useState({});

  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
    setWidth(window.width);
    setHeight(window.height);
  };

  useEffect(() => {
    setUserAddress({
      ...(addresses.length === 1
        ? addresses[0]
        : addresses.find((e) => (e.default = true))),
    });
  }, [addresses]);
  useEffect(() => {
    fetchAddress();
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 2.7,
          backgroundColor: "#FA4248",
          borderBottomLeftRadius: 100,
          borderBottomRightRadius: 100,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flex: 1,
            marginTop:
              Platform.OS === "android" || Platform.OS === "ios" ? 60 : 10,
            marginLeft: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image
              source={require("../../assets/left2.png")}
              resizeMode="contain"
              resizeMethod="scale"
              style={{
                marginTop: 10,
                minHeight:
                  window.height > 700 ? window.height / 50 : window.height / 30,
                minWidth:
                  window.width > 450 ? window.width / 50 : window.width / 15,
                maxHeight:
                  window.height > 700 ? window.height / 50 : window.height / 50,
                maxWidth:
                  window.width > 450 ? window.width / 50 : window.width / 27,
              }}
            ></Image>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 25 * (window.height * 0.001),
              alignSelf: "center",
              marginTop: 15,
            }}
          >
            {user.name}
          </Text>
        </View>
        <SafeAreaView style={styles.imageView}>
          <Image
            style={{
              height: "90%",
              width: "90%",
              alignSelf: "center",
              marginTop: 5,
              borderRadius: 100,
            }}
            source={
              user.image
                ? { uri: `data:image/jpeg;base64,${user.image}` }
                : require("../../assets/avatar.png")
            }
          ></Image>
        </SafeAreaView>
      </View>
      <View style={{ flex: 5.4, marginTop: 50 }}>
        <View style={styles.upperContainerStyle}>
          <View
            style={{
              flex: 3,
              justifyContent: "center",
            }}
          >
            <Text style={styles.deatils}>Name</Text>
          </View>
          <View
            style={{
              flex: 7,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#585858",
                fontSize: 22 * (window.height * 0.001),
              }}
            >
              {user.name}
            </Text>
          </View>
        </View>
        <View style={styles.detailsStyle}>
          <View
            style={{
              flex: 3,
              justifyContent: "center",
            }}
          >
            <Text style={styles.deatils}>Email</Text>
          </View>
          <View
            style={{
              flex: 7,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#585858",
                fontSize: 22 * (window.height * 0.001),
              }}
            >
              {user.email}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.detailsStyle,
            { maxHeight: 100, minHeight: window.height / 8 },
          ]}
        >
          <View
            style={{
              flex: 3,
              justifyContent: "center",
            }}
          >
            <Text style={styles.deatils}>Address</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flex: 7,
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#585858",
                alignSelf: "center",
                fontSize: 21 * (window.height * 0.001),
              }}
            >
              {addresses.length === 0 ? (
                <Text
                  style={{
                    color: "red",
                  }}
                >
                  No address added yet. Please enter your address while shopping
                </Text>
              ) : (
                <Text>
                  {userAddress?.street1} {userAddress?.street2}{" "}
                  {userAddress?.city} {userAddress?.state}{" "}
                  {userAddress?.country} {userAddress?.pincode}
                </Text>
              )}
            </Text>
            <View
              style={{
                borderRadius: 2,
                borderColor: "grey",
                justifyContent: "center",
                width: 20,
              }}
            >
              {}
              {/* <TouchableOpacity>
                <Icon name="edit"></Icon>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        <View style={styles.detailsStyle}>
          <View
            style={{
              flex: 3,
              justifyContent: "center",
            }}
          >
            <Text style={styles.deatils}>Phone</Text>
          </View>
          <View
            style={{
              flex: 7,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#585858",
                fontSize: 22 * (window.height * 0.001),
              }}
            >
              {user.phone}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginTop: 20,
          justifyContent: "space-around",
        }}
      >
        <Button
          pressFunc={() => logout()}
          textStyle={{ color: "#fff" }}
          style={{
            maxHeight: window.height / 15,
            minHeight: window.height / 17,
            minWidth: window.width / 2.3,
            maxWidth: window.width / 2.3,
            backgroundColor: "#FA4248",
            borderColor: "#fff",
          }}
          title="Logout"
        ></Button>
        <Button
          pressFunc={() =>
            navigation.navigate("edit-profile", { userData: user })
          }
          textStyle={{ color: "#fff" }}
          style={{
            maxHeight: window.height / 15,
            minHeight: window.height / 17,
            minWidth: window.width / 2.3,
            maxWidth: window.width / 2.3,
            backgroundColor: "#FA4248",
            borderColor: "#fff",
          }}
          title="Edit Profile"
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsStyle: {
    flex: 1,
    borderWidth: 1,
    marginTop: 5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "rgb(168,168,168)",
    flexDirection: "row",
  },
  upperContainerStyle: {
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "rgb(168,168,168)",
    flexDirection: "row",
  },
  deatils: {
    alignSelf: "flex-start",
    marginLeft: 25,
    color: "#FA4248",
    fontSize: 22 * (window.height * 0.001),
  },
  imageView: {
    backgroundColor: "#fff",
    borderRadius: 100,
    height: "60%",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
    alignSelf: "center",
    top: 30,
    zIndex: 1,
  },
});
const mapStateToProps = ({ user, addresses }) => ({
  user,
  addresses,
});
export default connect(mapStateToProps, { logout, fetchAddress })(UserProfile);
