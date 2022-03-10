import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native";
import SearchBar from "../../components/common/serchBar/searchBar";
import { connect } from "react-redux";
import AddModal from "../../components/addModal/addModal";
import Button from "../../components/common/buttom/button";
import StaticDataModal from "./static-data-modal";
import { addStaticData } from "../../redux/actions/static-data.action";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";

const StaticData = ({ addStaticData, staticDataList, selectedBusiness }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState({});
  const { window } = useContext(DimensionContext);

  const handleCallback = (childData) => {
    setModalVisible(childData);
    setSelected({});
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
        <Button
          title="Add Static Data"
          pressFunc={() => {
            setModalVisible(true);
          }}
        ></Button>
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
          placeholder="Search state"
          renderData={staticDataList}
          onSelection={handleItemCallback}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <TouchableOpacity onPress={() => handleItemCallback(item)}>
                  <View
                    style={{
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      Key: {item.key}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      Value: {item.value}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        ></SearchBar>
      </View>
      <View>
        <AddModal
          showModal={modalVisible}
          onSelection={handleCallback}
          modalViewStyle={{
            maxWidth:
              window.width > 960
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
            paddingBottom: window.width > 360 ? 20 : 10,
            paddingLeft: window.width > 360 ? 40 : 10,
            paddingRight: window.width > 360 ? 40 : 10,
            borderRadius: 6,
            backgroundColor: "#fefefe",
          }}
          add={
            <StaticDataModal
              data={selected}
              business={selectedBusiness.business}
              onChange={(business) => {
                addStaticData(business).then(() => setSelected(false));
                setModalVisible(false);
              }}
            ></StaticDataModal>
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
});

const mapStateToProps = ({ staticDataList, selectedBusiness }) => ({
  staticDataList,
  selectedBusiness,
});

export default connect(mapStateToProps, { addStaticData })(StaticData);
