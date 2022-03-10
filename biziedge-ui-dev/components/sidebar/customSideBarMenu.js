import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";

import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { connect } from "react-redux";
import Icon from "../common/icon";
import { logout } from "../../redux/actions/login.action";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import PopUp from "../popUp/popUp";
import { setSelectedBusiness } from "../../redux/actions/selectedBusiness.action";
import { setSelectedFacility } from "../../redux/actions/selectedFacility.action";
import {
  changeSelectedBusiness,
  changeSelectedFacility,
} from "../../redux/actions/user.action";

const SideMenu = ({ menu, navigation, onPress, label, icon }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View
      key={menu ? `menu-${menu._id}` : `${label}`}
      style={{
        backgroundColor: "#3C3B54",
        // menu && focusedRoute === menu.url ? "#3C3B54" : "#43425D",
      }}
    >
      <TouchableOpacity
        onPress={
          onPress
            ? onPress
            : () => {
                if (menu.url && menu.url != "#") navigation.navigate(menu.url);
                setExpanded(!expanded);
              }
        }
      >
        <View
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginVertical: 15,
          }}
        >
          <View
            style={{
              flex: 1,
              maxWidth: 30,
              marginHorizontal: 10,
              justifyContent: "center",
            }}
          >
            {icon ? icon() : <Icon name="box3D" />}
          </View>
          <Text
            style={{
              flex: 1,
              color: "#fff",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            {menu ? menu.title : label}{" "}
          </Text>
        </View>
      </TouchableOpacity>
      {menu && menu.child && expanded ? (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            borderLeftColor: "#3C3B5400",
            borderLeftWidth: 30,
          }}
        >
          {menu.child
            .sort((a, b) => a.order - b.order)
            .map((child) => {
              return (
                <SideMenu
                  navigation={navigation}
                  menu={child}
                  key={child._id}
                ></SideMenu>
              );
            })}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

const CustomSidebarMenu = (props) => {
  const dimensions = useWindowDimensions();
  return (
    <View style={{
      backgroundColor: "#43425D",
      color: "#fff",
      height:
        Platform.OS === "android" || Platform.OS === "ios"
          ? "100%"
          : dimensions.height,
      minHeight:
        Platform.OS === "android" || Platform.OS === "ios"
          ? "100%"
          : dimensions.height,
      maxHeight:
        Platform.OS === "android" || Platform.OS === "ios"
          ? "100%"
          : dimensions.height,
     }}>
      <View style={styles.profile}>
        <Image
          style={{
            width: 80,
            height: 80,
          }}
          source={require("../../assets/logo.png")}
        ></Image>
        <Text style={styles.profileText}>{`Welcome ${props.user.name}`}</Text>
        <View style={{ height: 40 }}>
          <PopUp
            style={{ minHeight: 40, borderRadius: 5 }}
            selectedItemStyle={{ color: "#fff" }}
            placeholder="Select"
            onSelection={(x) => {
              props.setSelectedBusiness(x);
              props.changeSelectedBusiness({ business: x.business._id });
            }}
            renderData={props.user.businessRoleMap}
            displayField={(i) => i?.business?.name}
            selectionValue={
              props.selectedBusiness
                ? props.selectedBusiness
                : props.user.businessRoleMap[0]
            }
          ></PopUp>
        </View>
        {props.selectedBusiness.facilities &&
        props.selectedBusiness.facilities.length > 0 ? (
          <View style={{ marginTop: 2, height: 40 }}>
            <PopUp
              style={{ minHeight: 40, borderRadius: 5 }}
              selectedItemStyle={{ color: "#fff" }}
              onSelection={(x) => {
                props.setSelectedFacility(x);
                x._id ? props.changeSelectedFacility({ facility: x._id }) : "";
              }}
              renderData={
                props.selectedBusiness?.roles?.find(
                  (x) => x.name === "Business"
                )
                  ? [
                      ...props.selectedBusiness.facilities,
                      { name: "Work as Business", _id: null },
                    ]
                  : [...props.selectedBusiness.facilities]
              }
              displayField={(i) => i?.name}
              selectionValue={
                props.selectedFacility
                  ? props.selectedFacility
                  : { name: "Work as Business", _id: null }
              }
            ></PopUp>
          </View>
        ) : (
          <></>
        )}
      </View>
      <DrawerContentScrollView
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {(props.selectedBusiness
          ? props.selectedBusiness.menuItems
          : props.user.businessRoleMap[0].menuItems
        )
          ?.sort((a, b) => a.order - b.order)
          .map((menu, index) => {
            return (
              <SideMenu
                navigation={props.navigation}
                menu={menu}
                key={menu._id}
              ></SideMenu>
            );
          })}
        <SideMenu
          onPress={() => props.logout()}
          label="Logout"
          icon={() => <Icon name="box3D" />}
        ></SideMenu>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: "center",
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: "center",
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    margin: 20,
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
  },
});

const mapStateToProps = ({ user, selectedBusiness, selectedFacility }) => ({
  user,
  selectedBusiness,
  selectedFacility,
});

export default connect(mapStateToProps, {
  logout,
  setSelectedBusiness,
  setSelectedFacility,
  changeSelectedBusiness,
  changeSelectedFacility,
})(CustomSidebarMenu);
