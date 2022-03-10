import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import { addstockMismatch } from "../../redux/actions/stock-mismatch-reason.action";
import { fetchReasonNames } from "../../redux/actions/stock-mismatch-reason.action";
import { connect } from "react-redux";
import AddEditStockMismatchReason from "./stockMismatchForm";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
const StockMismatchReason = ({
  selectedBusiness,
  stockMismatchReason,
  selectedFacility,
  addstockMismatch,
  fetchReasonNames,
}) => {
  const [filteredReasons, setFilteredReasons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  const handleCallback = (childData) => {
    setModalVisible(childData);
  };
  const handleItemCallback = (childData) => {
    setSelected(childData);
    setModalVisible(true);
  };
  useEffect(() => {
    setFilterdata(phrase);
  }, [stockMismatchReason]);
  const setFilterdata = (text) => {
    setFilteredReasons([
      ...stockMismatchReason.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };
  const searchReasonsByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchReasonNames({
      business: selectedBusiness.business._id,
    });
  };
  useEffect(() => {
    fetchReasonNames({
      facility: selectedFacility?._id,
      pageNo: 0,
      pageSize: 15,
    });
  }, [selectedFacility]);

  return (
    <View style={[Styles.container]}>
      <View
        style={{
          flexDirection: "row-reverse",
        }}
      >
        <View>
          <Button
            title={"Add Reason"}
            pressFunc={() => {
              setSelected({
                facility: selectedFacility?._id,
                active: "true",
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
          selected={selected}
          renderData={filteredReasons}
          onSelection={handleItemCallback}
          onChangeText={searchReasonsByPhrase}
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
          <AddEditStockMismatchReason
            stockMismatch={selected}
            onChange={(stockMismatch) => {
              addstockMismatch(stockMismatch).then(() => setSelected(false));
              setModalVisible(false);
            }}
          ></AddEditStockMismatchReason>
        }
      ></AddModal>
    </View>
  );
};
const mapStateToProps = ({
  selectedFacility,
  stockMismatchReason,
  selectedBusiness,
}) => ({
  selectedFacility,
  stockMismatchReason,
  selectedBusiness,
});
export default connect(mapStateToProps, {
  addstockMismatch,
  fetchReasonNames,
})(StockMismatchReason);
