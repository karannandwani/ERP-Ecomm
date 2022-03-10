import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import {
  fetchSchemeVariable,
  addSchemeVariable,
} from "../../redux/actions/scheme-variable-action";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import Button from "../../components/common/buttom/button";
import SchemeVariableModal from "./scheme-variable-modal";

const SchemeVariable = ({
  addSchemeVariable,
  fetchSchemeVariable,
  schemeVariables,
  selectedBusiness,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState({});

  const handleCallback = (childData) => {
    setModalVisible(childData);
    setSelected({});
  };
  const handleItemCallback = (childData) => {
    setSelected(childData);
    setModalVisible(true);
  };
  useEffect(() => {
    fetchSchemeVariable({ business: selectedBusiness.business._id });
  }, [!schemeVariables]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 15,
        }}
      >
        <Text style={styles.add_button}>Scheme Variable</Text>
        <Button
          style={{ maxWidth: "22%", marginRight: 20 }}
          title="Add Scheme Variable"
          pressFunc={() => {
            setModalVisible(true);
          }}
        ></Button>
      </View>
      <View style={{ margin: 25 }}>
        <SearchBar
          placeholder="Search Scheme Variable"
          renderData={schemeVariables}
          onSelection={handleItemCallback}
        ></SearchBar>
      </View>
      <View>
        <AddModal
          showModal={modalVisible}
          onSelection={handleCallback}
          modalViewStyle={{ maxHeight: "50%", padding: 40, minWidth: "40%" }}
          add={
            <SchemeVariableModal
              schemeVariable={selected}
              onChange={(variable) => {
                addSchemeVariable(variable).then(() => setSelected(false));
                setModalVisible(false);
              }}
              business={selectedBusiness._id}
            ></SchemeVariableModal>
          }
        ></AddModal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  add_button: {
    fontSize: 28,
    color: "#43425D",
    alignSelf: "center",
    marginLeft: 20,
  },
});

const mapStateToProps = ({ schemeVariables, selectedBusiness }) => ({
  schemeVariables,
  selectedBusiness,
});

export default connect(mapStateToProps, {
  fetchSchemeVariable,
  addSchemeVariable,
})(SchemeVariable);
