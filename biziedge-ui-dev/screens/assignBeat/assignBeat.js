import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import SearchBar from "../../components/common/serchBar/searchBar";
import { connect } from "react-redux";
import AddModal from "../../components/addModal/addModal";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import { fetchAssignedBeat } from "../../redux/actions/assignBeats.action";
const AssignBeat = ({
  navigation,
  fetchAssignedBeat,
  selectedBusiness,
  assignedBeats,
}) => {
  const [selected, setSelected] = useState({});
  useEffect(() => {
    fetchAssignedBeat({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 15,
    });
  }, [!assignedBeats, selectedBusiness]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 15,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            color: "#43425D",
            alignSelf: "center",
            marginLeft: 20,
          }}
        >
          Assigned Beat List
        </Text>
        <Button
          style={{
            maxWidth: Platform.OS === "web" ? "22%" : "40%",
            minWidth: Platform.OS === "web" ? 250 : "40%",
            marginRight: 20,
            marginLeft: 20,
          }}
          title={Platform.OS === "web" ? "Assign Beat" : "Assign"}
          pressFunc={() => {
            // setModalVisible(true);
            navigation.navigate("assignBeatComponent");
          }}
        ></Button>
      </View>
      <View style={{ flex: 5, marginHorizontal: 30 }}>
        <SearchBar
          renderData={assignedBeats}
          onSelection={() => setSelected(childData)}
        ></SearchBar>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = ({ selectedBusiness, assignedBeats }) => ({
  selectedBusiness,
  assignedBeats,
});
export default connect(mapStateToProps, { fetchAssignedBeat })(AssignBeat);
