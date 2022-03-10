import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import AddModal from "../../components/addModal/addModal";
import AddRoleForm from "./addRoleForm";
import SearchBar from "../../components/common/serchBar/searchBar";
import { addRoleAction, fetchRoles } from "../../redux/actions/role.action";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";

const Addrole = ({ roles, selectedBusiness, addRoleAction, fetchRoles }) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const { window } = useContext(DimensionContext);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [phrase, setPhrase] = useState("");

  useEffect(() => {
    fetchRoles({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 15,
    });
  }, [!roles, selectedBusiness]);

  useEffect(() => {
    setFilterdata(phrase);
  }, [roles]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);

  const handleCallback = (childData) => {
    setAddModalVisible(childData);
  };
  const handleItemCallback = (childData) => {
    setSelected(childData);
    setAddModalVisible(true);
  };
  const addRole = () => {
    setSelected([]);
    setAddModalVisible(!addModalVisible);
  };
  const setFilterdata = (text) => {
    setFilteredRoles([
      ...roles.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };
  const searchRoleByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchRoles({
      business: selectedBusiness.business._id,
    });
  };

  return (
    <View style={[Styles.container]}>
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            flexDirection: "row-reverse",
          }}
        >
          <View>
            <Button
              style={{ borderRadius: 5 }}
              title={"Add Role"}
              pressFunc={() => {
                addRole();
              }}
            ></Button>
          </View>
        </View>
        <View
          style={{
            width:
              window.width >= 1040
                ? window.width / 4
                : window.width >= 960 && window.width < 1040
                ? window.width / 3
                : window.width >= 641 && window.width < 960
                ? window.width / 2
                : window.width - 20,
            paddingTop: 20,
          }}
        >
          <SearchBar
            renderData={filteredRoles}
            onSelection={handleItemCallback}
            onChangeText={searchRoleByPhrase}
          ></SearchBar>
        </View>
      </View>

      <AddModal
        showModal={addModalVisible}
        onSelection={handleCallback}
        modalViewStyle={{
          maxWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20,
          minWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 450
              ? window.width / 1.2
              : window.width - 20,
          flexDirection: "column",
          paddingTop: 20,
          paddingBottom: window.width >= 360 ? 20 : 10,
          paddingLeft: window.width >= 360 ? 40 : 10,
          paddingRight: window.width >= 360 ? 40 : 10,
          borderRadius: 6,
          backgroundColor: "#fefefe",
        }}
        add={
          <AddRoleForm
            role={selected}
            onChange={(role) => {
              if (role.name !== "") {
                addRoleAction({
                  ...role,
                  businessId: selectedBusiness.business._id,
                });
                setAddModalVisible(false);
              }
            }}
          ></AddRoleForm>
        }
      ></AddModal>
    </View>

    // <View style={styles.heading}>
    //   <View
    //     style={{
    //       flexDirection: "row",
    //       justifyContent: "space-between",
    //       flex: 1,
    //       alignItems: "center",
    //     }}
    //   >
    //     <Text style={{ fontSize: 22, marginTop: 15, marginLeft: 30 }}>
    //       Add role
    //     </Text>

    //     <Button
    //       style={{
    //         maxWidth: Platform.OS === "web" ? "22%" : "40%",
    //         minWidth: Platform.OS === "web" ? 150 : "40%",
    //         marginRight: 20,
    //         marginLeft: 20,
    //       }}
    //       title={Platform.OS == "web" ? "Add Role" : "Add"}
    //       pressFunc={() => addRole()}
    //     ></Button>
    //   </View>
    //   <View style={{ marginLeft: 25, flex: 5 }}>
    //     <SearchBar
    //       renderData={roles}
    //       onSelection={handleItemCallback}
    //     ></SearchBar>
    //   </View>

    //   <AddModal
    //     showModal={addModalVisible}
    //     onSelection={handleCallback}
    //     modalViewStyle={{
    //       maxHeight: "40%",
    //       padding: Platform.OS == "web" ? 40 : 0,
    //       minWidth: "40%",
    //       minHeight: 250,
    //     }}
    //     add={
    //       <AddRoleForm
    //         role={selected}
    //         onChange={(role) => {
    //           addRoleAction({
    //             ...role,
    //             businessId: selectedBusiness.business._id,
    //           });
    //           setAddModalVisible(false);
    //         }}
    //       ></AddRoleForm>
    //     }
    //   ></AddModal>
    // </View>
  );
};
const mapStateToProps = ({ roles, selectedBusiness }) => ({
  roles,
  selectedBusiness,
});
export default connect(mapStateToProps, { addRoleAction, fetchRoles })(
  Addrole,
  fetchRoles
);

const styles = StyleSheet.create({
  heading: {
    flex: 1,
  },
});
