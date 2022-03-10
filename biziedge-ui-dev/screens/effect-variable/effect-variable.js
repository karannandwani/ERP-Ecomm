import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { connect } from "react-redux";
import {
  fetchEffectVariable,
  addEffectVariable,
} from "../../redux/actions/effect-variable-action";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import Button from "../../components/common/buttom/button";
import EffectVariableModal from "./effect-variable-modal";

const EffectVariable = ({
  addEffectVariable,
  fetchEffectVariable,
  effectVariables,
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
    fetchEffectVariable({ business: selectedBusiness.business._id });
  }, [!effectVariables]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 15,
        }}
      >
        <Text style={styles.add_button}>Effect Variable</Text>
        <Button
          style={{ maxWidth: "22%", marginRight: 20 }}
          title="Add Effect Variable"
          pressFunc={() => {
            setModalVisible(true);
          }}
        ></Button>
      </View>
      <View style={{ margin: 25 }}>
        <SearchBar
          placeholder="Search Effect Variable"
          renderData={effectVariables}
          onSelection={handleItemCallback}
        ></SearchBar>
      </View>
      <View>
        <AddModal
          showModal={modalVisible}
          onSelection={handleCallback}
          modalViewStyle={{
            maxHeight: "50%",
            padding: Platform.OS == "web" ? 40 : 0,
            minWidth: "40%",
          }}
          add={
            <EffectVariableModal
              effectVariable={selected}
              onChange={(variable) => {
                addEffectVariable(variable).then(() => setSelected(false));
                setModalVisible(false);
              }}
              business={selectedBusiness._id}
            ></EffectVariableModal>
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

const mapStateToProps = ({ effectVariables, selectedBusiness }) => ({
  effectVariables,
  selectedBusiness,
});

export default connect(mapStateToProps, {
  fetchEffectVariable,
  addEffectVariable,
})(EffectVariable);
