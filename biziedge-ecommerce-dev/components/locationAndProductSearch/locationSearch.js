import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  image,
  Pressable,
} from "react-native";
import { Dimensions, Platform, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import Icon from "../../components/common/icon";
import {
  fetchBeatByLocation,
  selectBeat,
} from "../../redux/actions/beat.action";
import config from "../../config/config";
import * as Location from "expo-location";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";

const locationSearch = ({
  navigation: { goBack },
  areas,
  selectBeat,
  business,
}) => {
  const [listShow, viewList] = useState(false);
  const [location, setLocation] = useState(null);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () =>
    new Promise((resolve, reject) => {
      try {
        Location.requestForegroundPermissionsAsync().then((result) => {
          if (result) {
            setPermission(true);
            resolve(true);
          } else {
            alert("Permission to access location was denied");
            resolve(false);
          }
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });

  const fetchCurrentLocation = () => {
    viewList(false);
    if (permission) {
      Location.getCurrentPositionAsync().then((result) => {
        setLocation(result);
      });
    } else {
      checkPermission().then(
        (result) => {
          if (result) {
            // fetchCurrentLocation();
          } else {
            console.error(
              "Unable to fetch location as permission not granted!"
            );
          }
        },
        (error) => console.error(error)
      );
    }
  };

  useEffect(() => {
    if (location) {
      fetchBeatByLocation({
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        business: business?._id,
      });
      goBack();
    }
  }, [location]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: "space-between",
          backgroundColor: "#ffff",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          minHeight: "15%",
          marginBottom: 20,
        }}
      >
        <SaiWinLogo
          backIconStyle={{
            marginLeft: 15,
          }}
          containerStyle={{ flexDirection: "row" }}
          onPressIcon={() => goBack()}
          imageStyle={{ marginTop: 5 }}
          onPressLogo={() => goBack()}
        ></SaiWinLogo>
      </View>

      <View style={{ flex: 8 }}>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 14,
              fontWeight: "800",
              fontSize: 18,
            }}
          >
            Location
          </Text>
        </View>
        <View
          style={{
            height: 40,
            width: "95%",
            borderWidth: 1,
            marginLeft: 7,
            marginTop: 7,
            borderRadius: 5,
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Icon name="search"></Icon>
          </View>
          <View style={{ flex: 9 }}>
            <TextInput
              placeholder="Search city,area or neighbourhood"
              style={{ height: "100%" }}
              onFocus={() => viewList(true)}
            ></TextInput>
          </View>
        </View>
        {listShow ? (
          <View>
            <TouchableOpacity
              onPress={() => fetchCurrentLocation()}
              style={{
                flexDirection: "row",
                minHeight: 30,
                borderBottomColor: "grey",
                borderBottomWidth: 2,
              }}
            >
              <Image
                source={require("../../assets/current2.png")}
                style={{ height: 23, width: 23, marginLeft: 5, marginTop: 5 }}
              ></Image>
              {/* <TouchableOpacity > */}
              <Text style={{ color: "blue", marginLeft: 5, marginTop: 7 }}>
                Use current location
              </Text>
              {/* </TouchableOpacity> */}
            </TouchableOpacity>
            {areas.map((x, i) => (
              <TouchableOpacity
                style={{
                  borderBottomColor: "grey",
                  borderBottomWidth: 2,
                  minHeight: 30,
                  marginLeft: 5,
                }}
                key={x._id}
                onPress={() => {
                  viewList(false);
                  selectBeat(x);
                  goBack();
                }}
              >
                <Text
                  style={{
                    color: "blue",
                    marginLeft: 15,
                    marginLeft: 5,
                    marginTop: 7,
                  }}
                >
                  {x.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

const mapStateToProps = ({ areas, business }) => ({
  areas,
  business,
});
export default connect(mapStateToProps, { selectBeat })(locationSearch);
