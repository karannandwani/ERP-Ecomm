import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import {
  addPriceListGroup,
  fetchPricelistGroupNames,
} from "../../redux/actions/priceListGroup.action";
import AddEditPricelist from "../priceListGroup/pricelistForm";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
const PriceListGroup = ({
  selectedBusiness,
  pricelistGroups,
  fetchPricelistGroupNames,
  addPriceListGroup,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [filteredPricelistGroup, setFilteredPricelistGroup] = useState([]);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  const [resetField, setResetField] = useState(false);

  useEffect(() => {
    setFilterdata(phrase);
  }, [pricelistGroups]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);

  const setFilterdata = (text) => {
    setFilteredPricelistGroup([
      ...pricelistGroups.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };
  const searchPricelistGroupByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchPricelistGroupNames({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 15,
    });
  };
  const handleCallback = (childData) => {
    setModalVisible(childData);
  };
  const handleItemCallback = (childData) => {
    setSelected(childData);
    setModalVisible(true);
  };
  // useEffect(() => {
  //   fetchPricelistGroupNames({
  //     business: selectedBusiness.business._id,
  //     pageNo: 0,
  //     pageSize: 15,
  //   });
  // }, [selectedBusiness]);

  return (
    <View style={[Styles.container]}>
      <View
        style={{
          flexDirection: "row-reverse",
        }}
      >
        <View>
          <Button
            title={"Add PriceList Group"}
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
          renderData={filteredPricelistGroup}
          onSelection={handleItemCallback}
          onChangeText={searchPricelistGroupByPhrase}
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
              : window.width < 500 && window.width >= 360
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
          <AddEditPricelist
            pricelistGroup={selected}
            onChange={(pricelistGroup) => {
              addPriceListGroup(pricelistGroup).then(() => setSelected(false));
              setModalVisible(false);
            }}
          ></AddEditPricelist>
        }
      ></AddModal>
    </View>
  );
};
const mapStateToProps = ({ selectedBusiness, pricelistGroups }) => ({
  selectedBusiness,
  pricelistGroups,
});
export default connect(mapStateToProps, {
  addPriceListGroup,
  fetchPricelistGroupNames,
})(PriceListGroup);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
