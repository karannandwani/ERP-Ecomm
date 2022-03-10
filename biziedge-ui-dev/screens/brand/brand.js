import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import { addBrandAction } from "../../redux/actions/brand.action";
import { fetchBrands } from "../../redux/actions/brand.action";
import AddUpdateBrand from "./addUpdateBrandForm";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";

const AddBrand = ({
  addBrandAction,
  fetchBrands,
  selectedBusiness,
  brandNames,
  manufacturerList,
}) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  const [resetField, setResetField] = useState(false);

  useEffect(() => {
    setFilterdata(phrase);
  }, [brandNames]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);

  const setFilterdata = (text) => {
    setFilteredBrands([
      ...brandNames.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };
  const searchBrandByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchBrands({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 10,
    });
  };
  const handleCallback = (childData) => {
    setAddModalVisible(childData);
    setResetField(!resetField);
  };
  const handleItemCallback = (childData) => {
    setSelected(childData);
    setAddModalVisible(true);
  };
  // useEffect(() => {
  //   fetchBrands({
  //     business: selectedBusiness.business._id,
  //     pageNo: 0,
  //     pageSize: 10,
  //   });
  // }, [!brandNames, selectedBusiness]);

  const addBrand = () => {
    setSelected({
      business: selectedBusiness.business._id,
      active: true,
    });
    setAddModalVisible(!addModalVisible);
  };
  return (
    <View style={[Styles.container]}>
      <View
        style={{
          flexDirection: "row-reverse",
        }}
      >
        <View>
          <Button title={"Add Brand"} pressFunc={() => addBrand()}></Button>
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
          renderData={filteredBrands}
          onSelection={handleItemCallback}
          onChangeText={searchBrandByPhrase}
        ></SearchBar>
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
          <AddUpdateBrand
            resetField={resetField}
            supplier={selected}
            manufacturerList={manufacturerList}
            onChange={(supplier) => {
              addBrandAction(supplier).then(() => setSelected(false));
              setResetField(!resetField);

              setAddModalVisible(false);
            }}
          ></AddUpdateBrand>
        }
      ></AddModal>
    </View>
  );
};
const mapStateToProps = ({
  selectedBusiness,
  brandNames,
  manufacturerList,
}) => ({
  selectedBusiness,
  brandNames,
  manufacturerList,
});
export default connect(mapStateToProps, {
  addBrandAction,
  fetchBrands,
})(AddBrand);

const styles = StyleSheet.create({});
