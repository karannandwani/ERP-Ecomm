import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import { fetchManufacturer } from "../../redux/actions/manufacturer.action";
import ManufacturerForm from "./manufacturerForm";
import { Styles } from "../../globalStyle";
import { addManufacturer } from "../../redux/actions/manufacturer.action";
import { DimensionContext } from "../../components/dimensionContext";

const Manufacturer = ({
  selectedBusiness,
  manufacturerList,
  fetchManufacturer,
  addManufacturer,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState({});
  const { window } = useContext(DimensionContext);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [phrase, setPhrase] = useState("");
  const [resetField, setResetField] = useState(false);

  useEffect(() => {
    setFilterdata(phrase);
  }, [manufacturerList]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);

  const setFilterdata = (text) => {
    setFilteredManufacturers([
      ...manufacturerList.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };

  const handleCallback = (childData) => {
    setResetField(!resetField);
    setModalVisible(childData);
  };

  const handleItemCallback = (childData) => {
    setSelected(childData);
    setModalVisible(true);
  };

  // useEffect(() => {
  //   fetchManufacturer({
  //     business: selectedBusiness.business._id,
  //     pageNo: 0,
  //     pageSize: 15,
  //   });
  // }, [!manufacturerList, selectedBusiness]);

  const searchManufacturerByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchManufacturer({
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
              title={"Add Manufacturer"}
              pressFunc={() => {
                setSelected({});
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
            // isImage={true}
            renderData={filteredManufacturers}
            selected={selected}
            onSelection={handleItemCallback}
            onChangeText={searchManufacturerByPhrase}
          ></SearchBar>
        </View>
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
          <ManufacturerForm
            manufacturer={selected}
            onChange={(manufacturer) => {
              addManufacturer({
                ...manufacturer,
                business: selectedBusiness.business._id,
              });
              setModalVisible(false);
              setResetField(!resetField);
            }}
            windowData={window.width}
            height={window.height}
            resetField={resetField}
          ></ManufacturerForm>
        }
      ></AddModal>
    </View>
  );
};
const styles = StyleSheet.create({});
const mapStateToProps = ({ selectedBusiness, manufacturerList }) => ({
  selectedBusiness,
  manufacturerList,
});
export default connect(mapStateToProps, { fetchManufacturer, addManufacturer })(
  Manufacturer
);
