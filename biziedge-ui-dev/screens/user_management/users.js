import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import { addUser } from "../../redux/actions/user.action";
import AddEditUser from "./add-edit-user";
import AddModal from "../../components/addModal/addModal";
import ProfileCard from "../../components/profileCard/profileCard";
import { DimensionContext } from "../../components/dimensionContext";

const Users = ({
  users,
  selectedBusiness,
  roles,
  addUser,
  selectedFacility,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [filteredUser, setFilteredUsers] = useState([]);
  const { window } = useContext(DimensionContext);

  const handleCallback = (childData) => {
    setModalVisible(childData);
  };

  const onEdit = (user) => {
    setSelected({
      ...user,
      businessRoleMap: user.businessRoleMap.find(
        (x) => x.business._id === selectedBusiness.business._id
      ),
    });
    setModalVisible(true);
  };

  const searchUserByPhrase = (phrase) => {
    let tempUsers = users;
    if (selectedFacility) {
      tempUsers = users.filter((x) => x.facilityId === selectedFacility._id);
    }
    setFilteredUsers([
      ...tempUsers.filter(
        (x) =>
          x.name.toLowerCase().startsWith(phrase.toLowerCase()) ||
          x.email.toLowerCase().startsWith(phrase.toLowerCase())
      ),
    ]);
  };

  useEffect(() => {
    if (selectedFacility) {
      setFilteredUsers([
        ...users.filter((x) => x.facilityId === selectedFacility._id),
      ]);
    } else {
      setFilteredUsers([...users.map((x) => x)]);
    }
  }, [selectedFacility, selectedBusiness, users]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 20,
          marginRight: 20,
        }}
      >
        <Button
          style={{ maxWidth: "22%", minWidth: 100 }}
          title={Platform.OS == "web" ? "Add User" : "Add"}
          pressFunc={() => {
            setSelected({
              businessId: selectedBusiness.business._id,
              facilityId: selectedFacility ? selectedFacility._id : null,
              active: true,
              // roles
            });
            setModalVisible(true);
          }}
        ></Button>
      </View>

      <View style={{ maxHeight: "90%" }}>
        <ScrollView nestedScrollEnabled={true} style={{ flexGrow: 1 }}>
          <View style={styles.cardContainer}>
            {filteredUser.map((user) => {
              return (
                <ProfileCard
                  key={user._id}
                  styling={styles.card}
                  onEditPress={onEdit}
                  userObj={user}
                  roles={
                    user.businessRoleMap.find(
                      (x) => x.business._id === selectedBusiness.business._id
                    )?.roles
                  }
                ></ProfileCard>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <AddModal
        showModal={modalVisible}
        onSelection={handleCallback}
        modalViewStyle={{
          maxWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 360
              ? window.width / 1.2
              : window.width - 60,
          minWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 360
              ? window.width / 1.2
              : window.width - 60,
          flexDirection: "column",
          paddingTop: 20,
          paddingBottom: window.width >= 360 ? 20 : 10,
          paddingLeft: window.width >= 360 ? 40 : 10,
          paddingRight: window.width >= 360 ? 40 : 10,
          borderRadius: 6,
          backgroundColor: "#fefefe",
        }}
        add={
          <AddEditUser
            userInfo={selected}
            roles={roles}
            business={selectedBusiness.business._id}
            onChange={(userInfo) => {
              addUser(userInfo).then((res) => {
                if (res.type == "ADD_USER_SUCCESS") {
                  setSelected(false);
                  setModalVisible(false);
                }
              });
            }}
          ></AddEditUser>
        }
      ></AddModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexWrap: "wrap",
  },
  cardContainer: {
    // flex:1,
    flexDirection: "row",
    flexWrap: "wrap",
    // maxHeight:'90%'
  },
  cardHolder: {
    flexDirection: Platform.OS == "web" ? "row" : "column",
    justifyContent: "flex-start",
    marginTop: 10,
    flexWrap: Platform.OS == "web" ? "wrap" : "nowrap",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    flexWrap: "wrap",
    minWidth: Platform.OS == "web" ? "48%" : "85%",
    margin: 10,
    maxHeight: 115,
    // // flex: 1,
  },
  ButtonStyle: {
    maxWidth: 100,
    // marginLeft: 10,
  },
});

const mapStateToProps = ({
  selectedBusiness,
  users,
  roles,
  selectedFacility,
}) => ({
  users,
  selectedBusiness,
  roles,
  selectedFacility,
});

export default connect(mapStateToProps, { addUser })(Users);
