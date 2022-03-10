import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import PopUp from "../../components/popUp/popUp";
import ImagePicker from "../../components/common/imageCard/imageCard";
import AutoCompleteModal from "../../components/common/autocompleteModal/auto-complete-modal";

const CreateSlide = ({
  slide,
  onChange,
  resetField,
  manufacturerList,
  brandNames,
  categoryList,
  fetchBrands,
  fetchProductCategories,
  fetchManufacturer,
  selectedBusiness,
  addError,
}) => {
  useEffect(() => {
    if (slide) {
      setSlideForm({
        type: slide.type,
        image: slide.image,
        name: slide.name,
      });
      setRedirectData({
        type: {
          name: slide.redirectData.type,
        },
        id: slide.category || slide.brand || slide.manufacturer,
      });
    }
  }, [slide]);
  const [slideForm, setSlideForm] = useState({
    type: "URL",
    image: "",
    name: "",
  });

  const [redirectData, setRedirectData] = useState({
    type: {
      name: "",
    },
    id: null,
  });
  const setData = (data) => {
    setSlideForm({ ...slideForm, ...data });
  };

  const searchBrand = (text) => {
    fetchBrands({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 10,
      name: text,
    });
  };

  const searchCategory = (text) => {
    fetchProductCategories({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 150,
      name: text,
    });
  };

  const searchManufacturer = (text) => {
    fetchManufacturer({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 10,
      name: text,
    });
  };

  const autocompleteSelection = (data) => {
    setRedirectData({ ...redirectData, id: data });
    if (redirectData.type === "category") {
      searchCategory("");
    }
    if (redirectData.type === "manufacturer") {
      searchManufacturer("");
    }
    if (redirectData.type === "brand") {
      searchBrand("");
    }
  };

  const submitSlide = () => {
    if (
      slideForm.image &&
      slideForm.name &&
      slideForm.type &&
      redirectData.type.name &&
      redirectData.type.name != "" &&
      redirectData.id._id
    ) {
      onChange({
        _id: slide?._id,
        business: selectedBusiness._id,
        aspectRatio: { width: 4, height: 3 },
        image: slideForm.image,
        type: slideForm.type,
        redirectData: {
          type: redirectData.type.name,
          id: redirectData.id._id,
        },
        name: slideForm.name,
      });
    } else {
      addError("Please fill all the details", 3000);
    }
  };

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {(slide?._id ? "Update " : "Add ") + "Slide"}
        </Text>
      </View>
      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          onChangeText={(e) => setData({ name: e })}
          label="Name"
          placeholder="Name"
          value={slideForm.name}
        ></InputboxWithBorder>
      </View>
      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <CheckBox
            isLabel={true}
            label={"URL"}
            value={slideForm.type === "URL"}
            setValue={(data) => setData({ type: "URL" })}
          ></CheckBox>
          <CheckBox
            label={"FILE"}
            isLabel={true}
            value={slideForm.type === "FILE"}
            setValue={(data) => setData({ type: "FILE" })}
          ></CheckBox>
        </View>
      </View>

      <View style={{ padding: 10 }}>
        {slideForm.type === "URL" ? (
          <InputboxWithBorder
            style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
            onChangeText={(e) => setData({ image: e })}
            label="URL"
            placeholder="URL"
            value={slideForm.image}
          ></InputboxWithBorder>
        ) : slideForm.type === "FILE" ? (
          <ImagePicker
            onSelection={(e) => setData({ image: e })}
            style={styles.imageHolder}
            multiple={false}
            data={slideForm.image}
          ></ImagePicker>
        ) : (
          <></>
        )}
      </View>

      <View style={{ padding: 10 }}>
        <PopUp
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          placeholder={"Select"}
          renderData={[
            { name: "Category" },
            { name: "Manufacturer" },
            { name: "Brand" },
          ]}
          onSelection={(e) => setRedirectData({ type: e })}
          selectionValue={redirectData.type}
          label={"Redirect to Home Screen With"}
          containerStyle={{ marginBottom: 10 }}
        ></PopUp>
      </View>

      <View
        style={{
          width: window.width >= 500 ? "42%" : "100%",
          marginTop: window.width >= 500 ? 0 : 10,
          minHeight: 50,
        }}
      >
        <AutoCompleteModal
          name={redirectData.type.name}
          label={redirectData.type.name}
          textInputStyle={{ marginBottom: 5 }}
          onSelection={(e) => autocompleteSelection(e)}
          value={redirectData.id}
          displayField={"name"}
          data={
            redirectData.id
              ? { data: redirectData.id, displayField: "name" }
              : ""
          }
          searchApi={
            redirectData.type.name === "Category"
              ? searchCategory
              : redirectData.type.name === "Manufacturer"
              ? searchManufacturer
              : redirectData.type.name === "Brand"
              ? searchBrand
              : null
          }
          renderData={
            redirectData.type.name === "Category"
              ? categoryList
              : redirectData.type.name === "Manufacturer"
              ? manufacturerList
              : redirectData.type.name === "Brand"
              ? brandNames
              : []
          }
          isSubmitButtom={true}
        ></AutoCompleteModal>
      </View>
      <View style={[{ padding: 10 }]}>
        <Button pressFunc={() => submitSlide()} title={"Submit"}></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    maxHeight: 200,
    minHeight: 40,
    maxWidth: "100%",
    backgroundColor: "lightgray",
    borderWidth: 3,
    borderColor: "#DFE0E3",
    padding: 5,
  },
});

export default CreateSlide;
