import React, { useEffect, useState, useContext } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { connect } from "react-redux";
import PopUp from "../../components/popUp/popUp";
import Checkbox from "../../components/common/checkBox/checkbox";
import {
  fetchMenuItem,
  fetchRoleMenu,
  addRoleMenu,
  deleteRoleMenu,
} from "../../redux/actions/policies.action";
import { fetchRoles } from "../../redux/actions/role.action";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import uuid from "react-native-uuid";

const PolicyMatrix = ({
  roleMenuItem,
  menuItem,
  onCheckClick,
  removeRoleDataMenuData,
  selectedRole,
}) => {
  return (
    <ScrollView
      scrollEnabled={true}
      style={{
        flex: 1,
      }}
    >
      {menuItem.map((menu, rIndex) => {
        return (
          <View
            style={{
              flex: 1,
            }}
            key={`${uuid.v1()}`}
          >
            <View
              key={`id-${menu._id}`}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                borderColor: "gray",
                justifyContent: "center",
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: rIndex === 0 ? 1 : 0,
                borderBottomWidth: 1,
                backgroundColor: "#fff",
              }}
            >
              <View
                style={{
                  width: 100,
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "gray",
                  padding: 5,
                }}
              >
                <Checkbox
                  value={
                    roleMenuItem.findIndex((pm) => pm.menu._id === menu._id) >
                    -1
                  }
                  setValue={() => {
                    let roleMenuExists = roleMenuItem.findIndex(
                      (pm) => pm.menu._id === menu._id
                    );
                    if (roleMenuExists > -1) {
                      removeRoleDataMenuData(roleMenuItem[roleMenuExists]);
                    } else {
                      onCheckClick({ _id: menu._id });
                    }
                  }}
                ></Checkbox>
              </View>
              <View
                style={{
                  flexGrow: 1,
                  padding: 5,
                }}
              >
                <Text>{menu.title}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const AssignMenuItem = ({
  fetchRoleMenu,
  fetchMenuItem,
  deleteRoleMenu,
  menuItem,
  fetchRoles,
  roles,
  selectedBusiness,
  roleMenuItem,
  addRoleMenu,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [menuAsSelectedRole, setmenuAsSelectedRole] = useState([]);
  const { window } = useContext(DimensionContext);
  useEffect(() => {
    fetchRoles();
  }, [!roles]);

  useEffect(() => {
    fetchMenuItem();
  }, [!menuItem]);

  useEffect(() => {
    fetchRoleMenu(selectedBusiness.business._id);
  }, [selectedBusiness]);

  const submitRoleMenu = (data) => {
    addRoleMenu({
      businessId: selectedBusiness.business._id,
      menu: data._id,
      roleId: selectedRole._id,
    });
  };
  const deleteRoleMenuHandler = (data) => {
    deleteRoleMenu(data._id);
  };

  useEffect(() => {
    onSelectionChange(roles[0]);
  }, [roles]);

  const onSelectionChange = (data) => {
    setSelectedRole(data);
    setmenuAsSelectedRole(roleMenuItem[data._id]);
    setModalVisible(false);
  };

  useEffect(() => {
    if (selectedRole) {
      setmenuAsSelectedRole(roleMenuItem[selectedRole._id]);
    }
  }, [roleMenuItem]);

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          <View style={[{ maxwidth: 200, minWidth: 200, minheight: 40 }]}>
            <PopUp
              style={{ minHeight: 40 }}
              renderData={roles}
              onSelection={(data) => {
                onSelectionChange(data);
              }}
              containerStyle={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              placeholder={"Select Role"}
              selectionValue={roles && roles[0] ? roles[0] : []}
              containerStyle={{
                backgroundColor: "#fff",
                minHeight: 40,
              }}
              visible={modalVisible}
            ></PopUp>
          </View>
        </Text>
      </View>
      <View
        style={{
          padding: 20,
          maxHeight: window.height - 200,
          minHeight: window.height - 200,
        }}
      >
        <PolicyMatrix
          removeRoleDataMenuData={deleteRoleMenuHandler}
          selectedRole={selectedRole}
          roleMenuItem={menuAsSelectedRole ? menuAsSelectedRole : []}
          menuItem={menuItem}
          onCheckClick={submitRoleMenu}
        ></PolicyMatrix>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

const mapStateToProps = ({
  menuItem,
  roles,
  selectedBusiness,
  roleMenuItem,
}) => ({ menuItem, roles, selectedBusiness, roleMenuItem });

export default connect(mapStateToProps, {
  fetchRoles,
  fetchMenuItem,
  fetchRoleMenu,
  addRoleMenu,
  deleteRoleMenu,
})(AssignMenuItem);
