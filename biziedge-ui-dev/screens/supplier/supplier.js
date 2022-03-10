import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import {
  addSupplier,
  fetchSupplier,
} from "../../redux/actions/supplier.action";
import PopUp from "../../components/popUp/popUp";
import AddEditSupplier from "../../components/supplier/addEditSupplier";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
const Supplier = ({
  supplierList,
  selectedBusiness,
  fetchSupplier,
  addSupplier,
  facility,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shortName, setShortName] = useState("");
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState(false);
  const [filteredSupplier, setFilteredSupplier] = useState([]);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  useEffect(() => {
    setFilterdata(phrase);
  }, [supplierList]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);

  const setFilterdata = (text) => {
    setFilteredSupplier([
      ...supplierList.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };
  const searchProductByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchSupplier({
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

  const AddSupplier = () => {
    addSupplier(addObj), setModalVisible(false);
  };
  let addObj = {
    name: name,
    email: email,
    shortName: shortName,
    phone: phone,
    business: selectedBusiness.business._id,
    active: "true",
  };
  // useEffect(() => {
  //   fetchSupplier({
  //     business: selectedBusiness.business._id,
  //     pageNo: 0,
  //     pageSize: 15,
  //   });
  // }, [!supplierList, selectedBusiness]);
  return (
    <View style={[Styles.container]}>
      <View
        style={{
          flexDirection: "row-reverse",
        }}
      >
        <View>
          <Button
            title={`Add Supplier`}
            pressFunc={() => {
              setSelected({
                business: selectedBusiness.business._id,
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
          renderData={filteredSupplier}
          onSelection={handleItemCallback}
          iconCondition={"!item['facility']"}
          actionIconName="truck"
          onChangeText={searchProductByPhrase}
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
          <AddEditSupplier
            supplier={selected}
            facilityList={facility.filter(
              (x) => !x.suppliers?.map((y) => y._id).includes(selected._id)
            )}
            onChange={(supplier) => {
              addSupplier(supplier);
              setModalVisible(false);
            }}
          ></AddEditSupplier>
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
const mapStateToProps = ({ selectedBusiness, supplierList, facility }) => ({
  selectedBusiness,
  supplierList,
  facility,
});
export default connect(mapStateToProps, { fetchSupplier, addSupplier })(
  Supplier
);
