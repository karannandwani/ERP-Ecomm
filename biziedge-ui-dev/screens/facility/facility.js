import React, { useEffect, useState, useContext } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import AddModal from "../../components/addModal/addModal";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import {
  assignUserToFacility,
  removeUserFromFacility,
} from "../../redux/actions/facility-user-map.action";
import {
  addFacility,
  fetchFacility,
} from "../../redux/actions/facility.action";
import AddEditFacility from "./addEditFacility";
import AssignUser from "./assign-user";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import { fetchBeat } from "../../redux/actions/beat.action";

const Facility = ({
  selectedBusiness,
  fetchFacility,
  addFacility,
  facility,
  country,
  states,
  supplierList,
  users,
  assignUserToFacility,
  removeUserFromFacility,
  facilityUserMap,
  beats,
  fetchBeat,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [selected, setSelected] = useState({});
  const [facilities, setFilteredFacilities] = useState([]);
  const [text, setText] = useState("");
  const [filteredBeats, setFilteredBeats] = useState([]);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  const handleCallback = (childData) => {
    setModalVisible(childData);
    setSelected({});
  };
  const handleUserCallback = (childData) => {
    setUserModal(childData);
  };
  const handleItemCallback = (childData) => {
    setSelected(childData);
    setModalVisible(true);
  };

  const searchWithPhrase = (phrase) => {
    setFilteredFacilities([
      ...facility.filter((x) =>
        x.name.toLowerCase().startsWith(phrase.toLowerCase())
      ),
    ]);
    fetchFacility({ business: selectedBusiness.business._id });
    setText(phrase);
  };

  useEffect(() => {
    setFilteredFacilities([
      ...facility.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  }, [facility]);

  useEffect(() => {
    setFilterdata(phrase);
  }, [beats]);

  useEffect(() => {
    return () => {
      setText("");
    };
  }, []);

  const openUserAssignModal = (item) => {
    setSelected(item);
    setUserModal(true);
  };

  const onSubmitAssignedUser = (data) => {
    assignUserToFacility(data);
    setUserModal(false);
  };

  const onSubmitRemoveUser = (data) => {
    removeUserFromFacility(data);
    setUserModal(false);
  };

  const setFilterdata = (text) => {
    setFilteredBeats([
      ...beats.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };
  const searchBeatByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchBeat({
      business: selectedBusiness.business._id,
    });
  };
  return (
    <View style={[Styles.container]}>
      <View
        style={{
          flexDirection: "row-reverse",
        }}
      >
        <View>
          <Button
            title={"Add Facility"}
            pressFunc={() => {
              setSelected({
                business: selectedBusiness.business._id,
                active: true,
              });
              setModalVisible(true);
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
          renderData={facilities}
          onSelection={handleItemCallback}
          iconCondition={"item['name']"}
          actionIconName={"user"}
          actionIconPress={openUserAssignModal}
          onChangeText={(text) => searchWithPhrase(text)}
        ></SearchBar>
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
          <AddEditFacility
            states={states}
            countries={country}
            suppliers={supplierList.filter(
              (x) => !x.facility || x.facility?._id !== selected._id
            )}
            facility={selected}
            beats={filteredBeats}
            onChange={(data) => {
              addFacility(data);
              setModalVisible(false);
            }}
            searchBeatByPhrase={searchBeatByPhrase}
          ></AddEditFacility>
        }
      ></AddModal>
      <AddModal
        showModal={userModal}
        onSelection={handleUserCallback}
        modalViewStyle={{
          maxWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 360
              ? window.width - 20
              : window.width - 10,
          minWidth:
            window.width >= 960
              ? window.width / 3
              : window.width >= 641 && window.width <= 960
              ? window.width / 2
              : window.width <= 641 && window.width >= 500
              ? window.width / 1.5
              : window.width <= 500 && window.width >= 360
              ? window.width - 20
              : window.width - 10,
          flexDirection: "column",
          borderRadius: 6,
          backgroundColor: "#fefefe",
          // paddingLeft: 5,
        }}
        add={
          userModal ? (
            <AssignUser
              users={users}
              facility={selected}
              facilityUserMap={facilityUserMap}
              onChange={(data) => {
                assignUser(data);
              }}
              onSubmitAssignedUser={onSubmitAssignedUser}
              onRemoveUser={onSubmitRemoveUser}
              selectedBusinessId={selectedBusiness.business._id}
            ></AssignUser>
          ) : (
            <></>
          )
        }
      ></AddModal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = ({
  selectedBusiness,
  facility,
  country,
  states,
  supplierList,
  users,
  facilityUserMap,
  beats,
}) => ({
  selectedBusiness,
  facility,
  country,
  states,
  supplierList,
  users,
  facilityUserMap,
  beats,
});
export default connect(mapStateToProps, {
  fetchFacility,
  addFacility,
  assignUserToFacility,
  removeUserFromFacility,
  fetchBeat,
})(Facility);
