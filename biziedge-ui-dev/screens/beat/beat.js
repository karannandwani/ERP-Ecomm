import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import SearchBar from "../../components/common/serchBar/searchBar";
import { connect } from "react-redux";
import AddModal from "../../components/addModal/addModal";
import Button from "../../components/common/buttom/button";
import { fetchBeat } from "../../redux/actions/beat.action";
import { addBeatAction } from "../../redux/actions/beat.action";
import AddEditBeat from "./add-edit-beat";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
const Beat = ({ beats, fetchBeat, addBeatAction, selectedBusiness }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [filteredBeats, setFilteredBeats] = useState([]);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  const [resetField, setResetField] = useState(false);

  useEffect(() => {
    setFilterdata(phrase);
  }, [beats]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);

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
  const handleCallback = (childData) => {
    setResetField(!resetField);

    setModalVisible(childData);
  };
  const handleItemCallback = (childData) => {
    setSelected(childData);
    setModalVisible(true);
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
            title={"Add Beat"}
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
          placeholder="Search Beat"
          renderData={filteredBeats}
          onSelection={handleItemCallback}
          onChangeText={searchBeatByPhrase}
        ></SearchBar>
      </View>
      <AddModal
        showModal={modalVisible}
        onSelection={handleCallback}
        modalViewStyle={{
          maxWidth:
            window.width > 960
              ? window.width / 3
              : window.width > 641 && window.width < 960
              ? window.width / 2
              : window.width < 641 && window.width > 500
              ? window.width / 1.5
              : window.width < 500 && window.width > 360
              ? window.width / 1.2
              : window.width - 60,
          minWidth:
            window.width > 960
              ? window.width / 3
              : window.width > 641 && window.width < 960
              ? window.width / 2
              : window.width < 641 && window.width > 500
              ? window.width / 1.5
              : window.width < 500 && window.width > 360
              ? window.width / 1.2
              : window.width - 60,
          flexDirection: "column",
          paddingTop: 20,
          paddingBottom: window.width > 360 ? 20 : 10,
          paddingLeft: window.width > 360 ? 40 : 10,
          paddingRight: window.width > 360 ? 40 : 10,
          borderRadius: 6,
          backgroundColor: "#fefefe",
        }}
        add={
          <AddEditBeat
            resetField={resetField}
            BeatInfo={selected}
            onChange={(beat) => {
              addBeatAction(beat).then(() => setSelected(false));
              setResetField(!resetField);
              setModalVisible(false);
            }}
          ></AddEditBeat>
        }
      ></AddModal>
    </View>
  );
};
const styles = StyleSheet.create({});
const mapStateToProps = ({ beats, selectedBusiness }) => ({
  beats,
  selectedBusiness,
});

export default connect(mapStateToProps, { fetchBeat, addBeatAction })(Beat);
