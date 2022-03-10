import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Platform, ScrollView } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import AddModal from "../../components/addModal/addModal";
import AddUpdateCategoryForm from "./categoryForm";
import { fetchProductCategories } from "../../redux/actions/category.action";
import { addProductCategory } from "../../redux/actions/category.action";
import Accordion from "../../components/accordion/accordion";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
const Category = ({
  selectedBusiness,
  categoryList,
  fetchProductCategories,
  addProductCategory,
}) => {
  const [categoryModalVisible, setcategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  const [resetField, setResetField] = useState(false);

  useEffect(() => {
    setFilterdata(phrase);
  }, [categoryList]);

  useEffect(() => {
    return () => {
      setPhrase("");
    };
  }, []);

  const setFilterdata = (text) => {
    setFilteredCategory([
      ...categoryList.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };
  const searchCategoryByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchProductCategories({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 150,
    });
  };
  // const handleCancel = (childData) => {
  //   setcategoryModalVisible(childData);
  // };
  const handleCategoryDataCallBack = (childData) => {
    setSelectedCategory(childData);
    setcategoryModalVisible(true);
  };

  const handleSubCategoryDataCallBack = (childData) => {
    setSelectedCategory({
      name: null,
      description: null,
      active: true,
      parentCategory: childData.parentCategory,
      business: selectedBusiness.business._id,
    });
    setcategoryModalVisible(true);
  };

  const toggleModal = () => {
    setResetField(!resetField);
    setcategoryModalVisible(!categoryModalVisible);
  };
  // useEffect(() => {
  //   fetchProductCategories({
  //     business: selectedBusiness.business._id,
  //     pageNo: 0,
  //     pageSize: 150,
  //   });
  // }, [selectedBusiness]);

  return (
    <View style={[Styles.container]}>
      <View>
        <View
          style={{
            flexDirection: "row-reverse",
          }}
        >
          <View>
            <Button
              title={"Add Category"}
              pressFunc={() => {
                setSelectedCategory({
                  business: selectedBusiness.business._id,
                  active: true,
                });
                setcategoryModalVisible(true);
              }}
            ></Button>
          </View>
        </View>
        <ScrollView
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
          <Accordion
            onChangeText={searchCategoryByPhrase}
            onPress={toggleModal}
            items={filteredCategory}
            onSelection={handleCategoryDataCallBack}
            onAdd={handleSubCategoryDataCallBack}
          ></Accordion>
        </ScrollView>
      </View>

      <AddModal
        showModal={categoryModalVisible}
        onSelection={toggleModal}
        modalViewStyle={{
          // maxHeight: window.height >= 667 ? 500 : window.height,
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
          // borderRadius: 6,
          // backgroundColor: "#fefefe",
        }}
        add={
          <AddUpdateCategoryForm
            category={selectedCategory}
            resetField={resetField}
            onChange={(category) => {
              addProductCategory(category).then(() =>
                setSelectedCategory(false)
              );
              setResetField(!resetField);
              setcategoryModalVisible(false);
            }}
          ></AddUpdateCategoryForm>
        }
      ></AddModal>
    </View>
  );
};
const mapStateToProps = ({ selectedBusiness, categoryList }) => ({
  selectedBusiness,
  categoryList,
});
export default connect(mapStateToProps, {
  addProductCategory,
  fetchProductCategories,
})(Category);

const styles = StyleSheet.create({});
