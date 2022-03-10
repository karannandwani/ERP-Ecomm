import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import AddEditCoupon from "./addEditCoupon";
import { addCoupon } from "../../redux/actions/coupon.action";
import { fetchCouponName } from "../../redux/actions/coupon.action";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
const Coupon = ({ selectedBusiness, addCoupon, fetchCouponName, coupon }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const { window } = useContext(DimensionContext);
  const [filteredCoupon, setFilteredCoupon] = useState([]);
  const [phrase, setPhrase] = useState("");
  useEffect(() => {
    setFilterdata(phrase);
    if (selected) {
      setSelected({ ...coupon.find((x) => x._id === selected._id) });
    }
  }, [coupon]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);
  const setFilterdata = (text) => {
    setFilteredCoupon([
      ...coupon.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };
  const searchCoupon = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchCouponName({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 2000,
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
  //   fetchCouponName({
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
            title={"Add Coupon"}
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
          onChangeText={searchCoupon}
          renderData={filteredCoupon}
          onSelection={handleItemCallback}
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
          <AddEditCoupon
            coupon={selected}
            onChange={(coupon) => {
              addCoupon(coupon).then(() => setSelected(false));
              setModalVisible(false);
            }}
          ></AddEditCoupon>
        }
      ></AddModal>
    </View>
  );
};
const mapStateToProps = ({ selectedBusiness, coupon }) => ({
  selectedBusiness,
  coupon,
});
export default connect(mapStateToProps, {
  addCoupon,
  fetchCouponName,
})(Coupon);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
