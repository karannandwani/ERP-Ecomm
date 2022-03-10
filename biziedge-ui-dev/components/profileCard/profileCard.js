import React, { useEffect, useState, useContext } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import Icon from "../common/icon";
import { DimensionContext } from "../../components/dimensionContext";
import Avatar from "../common/avatar";

const profileCard = ({
  style,
  onEditPress,
  onRemovePress,
  onRightArrowPress,
  userObj,
  roles,
  styling,
}) => {
  const { window } = useContext(DimensionContext);
  return (
    <View style={[styles.container, styling]}>
      <ScrollView nestedScrollEnabled={true} style={{ flexGrow: 1 }}>
        {/* <View style={{ flex: 2 }}>
          <Image
            style={{
              height: 80,
              width: 70,
              borderRadius: 35,
              // flex: 1,
              alignSelf: "center",
            }}
            source={{
              uri: userObj.image
                ? `data:image/jpeg;base64,${userObj.image}`
                : require("../../assets/avatar.png"),
            }}
          ></Image>
        </View>
        <View style={{ flex: 4 }}>
          <Text style={styles.name}>{userObj.name}</Text>
          {userObj.address ? (
            <Text style={styles.details}>{userObj.address}</Text>
          ) : (
            <></>
          )}
          {userObj.phone ? (
            <Text style={styles.details}>Mobile : {userObj.phone}</Text>
          ) : (
            <></>
          )}
          <Text style={styles.details}>Email : {userObj.email}</Text>
          <Text style={styles.details}>
            Roles : {roles.map((x) => x.name).join()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => onEditPress(userObj)}
            >
              <Icon name="edit"></Icon>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={onRemovePress}
            style={{ marginLeft: 20, width: 20, flex: 1 }}
          >
            <Icon name="cross"></Icon>
          </TouchableOpacity>
        </View> */}

        <View style={{ flexDirection: "row" }}>
          <Avatar
            style={{
              height: 80,
              width: 70,
              borderRadius: 35,
              alignSelf: "center",
            }}
            source={
              userObj.image
                ? {
                    uri: userObj?.image
                      ? `data:image/jpeg;base64,${userObj.image}`
                      : "",
                  }
                : null
            }
          />
          {/* <Image
            style={{
              height: 80,
              width: 70,
              borderRadius: 35,
              alignSelf: "center",
            }}
         
            source={{
              uri: userObj.image
                ? `data:image/jpeg;base64,${userObj.image}`
                : require("../../assets/avatar.png"),
            }}
          ></Image> */}

          <View
            style={{
              marginLeft: 10,
              width: window.width > 540 ? 400 : 190,
              flexWrap: "wrap",
            }}
          >
            <Text style={styles.name}>{userObj.name}</Text>
            {userObj.address ? (
              <Text style={styles.details}>{userObj.address}</Text>
            ) : (
              <></>
            )}
            {userObj.phone ? (
              <Text style={styles.details}>Mobile : {userObj.phone}</Text>
            ) : (
              <></>
            )}
            <Text style={styles.details}>Email : {userObj.email}</Text>
            <Text style={styles.details}>
              Roles : {roles?.map((x) => x.name).join()}
            </Text>
          </View>

          <View style={{ flex: 1.3 }}>
            <View
              style={{ flexDirection: "row", flex: 1, alignSelf: "flex-end" }}
            >
              <TouchableOpacity
                // style={{ flex: 1 }}
                onPress={() => onEditPress(userObj)}
              >
                <Icon name="edit"></Icon>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onRemovePress}
                // style={{ marginLeft: 20,  flex: 1, alignSelf: "flex-end", }}
              >
                <Icon name="cross"></Icon>
              </TouchableOpacity>
            </View>
            <View style={{ alignSelf: "flex-end" }}>
              <TouchableOpacity
                onPress={onRightArrowPress}
                style={{ width: 20 }}
              >
                <Icon name="rightArrow"></Icon>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    // justifyContent: "space-between",
    maxWidth: 570,
    maxHeight: 115,
    minHeight: 130,
    padding: 15,
    // margin: 10,
  },
  name: {
    // fontSize: 18,
    fontWeight: "bold",
    color: "#4D4F5C",
    // flex: 1,
  },
  details: {
    // fontSize: 15,
    color: "#AFAEBF",
    // marginTop: 10,
    // flex: 1,
  },
});
export default profileCard;
