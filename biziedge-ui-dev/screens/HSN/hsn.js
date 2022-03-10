import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import AddModal from "../../components/addModal/addModal";
import { addHSN } from "../../redux/actions/hsn.action";
import { fetchHSN } from "../../redux/actions/hsn.action";
import HsnForm from "./hsnForm";
import AddExtraTaxToHsn from "./addExtraTaxToHsn";
import { addExtraTax } from "../../redux/actions/hsn.action";
import Icon from "../../components/common/icon";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import ExtraTaxForm from "./addExtraTaxForm";

const hsnNumber = ({
  selectedBusiness,
  HSN,
  fetchHSN,
  addHSN,
  addExtraTax,
}) => {
  const [isHsnModalVisible, setIsHsnModalVisible] = useState(false);
  const [selectedHsn, setSelectedHsn] = useState(null);
  const [selectedTax, setSelectedTax] = useState({});
  const [isTaxList, setIsTaxList] = useState(false);
  const [isTaxModal, setIsTaxModal] = useState(false);
  const [filteredHsn, setFilteredHsn] = useState([]);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  const [activeIndex, setActiveIndex] = useState(null);
  const [resetField, setResetField] = useState(false);
  useEffect(() => {
    setFilterdata(phrase);
    if (selectedHsn) {
      setSelectedHsn({ ...HSN.find((x) => x._id === selectedHsn._id) });
    }
  }, [HSN]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);

  const setFilterdata = (text) => {
    setFilteredHsn([
      ...HSN.filter((x) => x.hsn.toLowerCase().startsWith(text.toLowerCase())),
    ]);
  };
  const searchHsnByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchHSN({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 2000,
    });
  };
  const cancelModalCallBack = (childData) => {
    setIsHsnModalVisible(childData);
    setResetField(!resetField);
  };
  const handleTaxCallBack = (data) => {
    setSelectedTax(data);
    setIsTaxModal(true);
  };

  const cancelModalTaxCallBack = (data) => {
    setSelectedTax(data);
    setIsTaxModal(false);
  };

  const onSubmit = (data) => {
    addExtraTax({
      ...data,
      business: selectedBusiness.business._id,
      hsn: selectedHsn._id,
    }).then(() => setIsTaxModal(false));
  };

  const onChangeTextExtraTax = (phrase) => {
    setSelectedHsn({
      ...selectedHsn,
      filteredTax: selectedHsn.tax.filter((x) =>
        x.name.toLowerCase().startsWith(phrase.toLowerCase())
      ),
    });
  };

  const hsnSubmitCallBack = (hsnNum) => {
    // if (hsnNum._id) {
    addHSN(hsnNum).then(() => {
      setSelectedHsn(hsnNum);
      setResetField(!resetField);
    });
    setIsHsnModalVisible(false);
    // } else {
    //   addHSN({ ...hsnNum, business: selectedBusiness.business._id }).then(
    //     () => {
    //       setSelectedHsn(hsnNum);
    //       setResetField(!resetField);
    //     }
    //   );
    //   setIsHsnModalVisible(false);
    // }
  };

  const extraHsnCallBack = () => {
    setIsTaxModal(false);
    setSelectedHsn(null);
    setActiveIndex(null);
  };
  // useEffect(() => {
  //   fetchHSN({
  //     business: selectedBusiness.business._id,
  //     pageNo: 0,
  //     pageSize: 2000,
  //   });
  // }, [selectedBusiness]);
  return (
    <View style={[Styles.container]}>
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            flexDirection: "row-reverse",
          }}
        >
          <View style={{ marginRight: 5 }}>
            <Button
              title={"Add HSN"}
              pressFunc={() => {
                setSelectedHsn(null);
                setIsTaxModal(false);
                setActiveIndex(null);
                setIsHsnModalVisible(true);
              }}
            ></Button>
          </View>
        </View>
        <View>
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
            {HSN ? (
              <SearchBar
                onChangeText={searchHsnByPhrase}
                renderData={filteredHsn}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={[
                        styles.listStyle,
                        {
                          marginBottom: 5,
                          backgroundColor:
                            index === activeIndex ? "gray" : "#fff",
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => {
                          setSelectedHsn(item);
                          setIsHsnModalVisible(true);
                          setActiveIndex(index);
                          setIsTaxList(false);
                        }}
                      >
                        <View>
                          <Text style={{ paddingTop: 10, paddingLeft: 10 }}>
                            {item.hsn}
                          </Text>
                          {item.percentage ? (
                            <Text style={{ paddingTop: 10 }}>
                              {item.percentage}
                            </Text>
                          ) : (
                            <></>
                          )}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedHsn(item);
                          setIsTaxList(true);
                          setActiveIndex(index);
                        }}
                      >
                        {item.hsn || item.name ? (
                          <Icon
                            name="rightArrow"
                            style={{ marginTop: 10 }}
                          ></Icon>
                        ) : (
                          ""
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                }}
              ></SearchBar>
            ) : (
              <></>
            )}
          </View>
          {/* <View
              style={{
                maxWidth:
                  window.width >= 1040
                    ? (window.width - 350) / 2
                    : window.width >= 400 && window.width <= 1040
                    ? (window.width - 30) / 2
                    : window.width - 30,
                minWidth:
                  window.width >= 1040
                    ? (window.width - 350) / 2
                    : window.width >= 400 && window.width <= 1040
                    ? (window.width - 30) / 2
                    : window.width - 30,
                marginLeft: 10,
                maxHeight: "50%",
              }}
            >
              {selectedHsn && isTaxList ? (
                <SearchBar
                  renderData={selectedHsn.tax}
                  onSelection={handleTaxCallBack}
                ></SearchBar>
              ) : (
                <></>
              )}
            </View> */}
        </View>
      </View>

      <AddModal
        showModal={isHsnModalVisible}
        onSelection={cancelModalCallBack}
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
          <HsnForm
            resetField={resetField}
            hsnNum={
              selectedHsn
                ? { ...selectedHsn }
                : { business: selectedBusiness.business._id }
            }
            onChange={(hsnNum) => {
              hsnSubmitCallBack(hsnNum);
            }}
          ></HsnForm>
        }
      ></AddModal>

      <AddModal
        showModal={selectedHsn != null && isTaxList}
        onSelection={extraHsnCallBack}
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
          borderRadius: 6,
          backgroundColor: "#fefefe",
          padding: 10,
        }}
        add={
          <View>
            {selectedHsn && isTaxList ? (
              <View style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
                <SearchBar
                  onChangeText={onChangeTextExtraTax}
                  renderData={selectedHsn.filteredTax || selectedHsn.tax}
                  onSelection={handleTaxCallBack}
                ></SearchBar>
                <View style={{ marginTop: 3 }}>
                  <Button
                    title="Add Extra Tax"
                    pressFunc={() => {
                      setIsTaxModal(true);
                    }}
                  ></Button>
                </View>
              </View>
            ) : (
              <></>
            )}
            <AddModal
              showModal={isTaxModal}
              onSelection={cancelModalTaxCallBack}
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
                zIndex: 9,
              }}
              add={
                <View style={{ flex: 1 }}>
                  <ExtraTaxForm
                    tax={selectedTax}
                    onChange={(tax) => {
                      onSubmit(tax);
                    }}
                  ></ExtraTaxForm>
                </View>
              }
            ></AddModal>
          </View>
        }
      ></AddModal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listStyle: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
const mapStateToProps = ({ selectedBusiness, HSN }) => ({
  selectedBusiness,
  HSN,
});
export default connect(mapStateToProps, {
  addHSN,
  fetchHSN,
  addExtraTax,
})(hsnNumber);
