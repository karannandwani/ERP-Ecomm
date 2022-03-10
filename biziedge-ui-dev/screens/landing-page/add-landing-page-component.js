import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Button from "../../components/common/buttom/button";
import CheckBox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import PopUp from "../../components/popUp/popUp";
import AutoCompleteModal from "../../components/common/autocompleteModal/auto-complete-modal";

const LandingPageComponent = ({
  component,
  onChange,
  addError,
  slides,
  selectedBusiness,
}) => {
  const [filterSlides, setFilterSlides] = useState(slides);
  const [componentForm, setComponentForm] = useState({
    type: {
      name: "",
    },
    order: "",
    slideImages: [],
    active: true,
    viewType: null,
  });
  const [dataQuery, setDataQuery] = useState({
    type: "",
    query: "",
    limit: "",
  });

  const submitForm = () => {
    if (!Number.isNaN(componentForm.order) && componentForm.type.name != "") {
      let obj = {
        type: componentForm.type.name,
        order: componentForm.order,
        business: selectedBusiness._id,
        _id: component?._id,
        active: componentForm.active,
        viewType: componentForm.viewType?.name,
      };
      if (
        ["Category", "Product"].includes(componentForm.type.name) &&
        dataQuery.type.name != "" &&
        dataQuery.type.query != ""
      ) {
        obj.dataQuery = {
          type:
            componentForm.type.name === "Product"
              ? "Product"
              : dataQuery.type.name,
          query: dataQuery.query,
          limit: dataQuery.limit,
        };
      } else if (
        componentForm.type.name === "Image" &&
        componentForm.slideImages.length == 1
      ) {
        obj.slideImages = componentForm.slideImages.map((x) => x._id);
      } else if (
        componentForm.type.name === "Carousel" &&
        componentForm.slideImages.length > 0
      ) {
        obj.slideImages = componentForm.slideImages.map((x) => x._id);
      } else {
        addError("Please Fill all the details!", 3000);
        return;
      }
      console.log(component);
      onChange(obj);
    } else {
      addError("Please Fill all the details!", 3000);
    }
  };

  const fetchSlides = (text) => {
    setFilterSlides(
      slides.filter((x) =>
        x.name.toLowerCase().startsWith((text || "").toLowerCase())
      )
    );
  };

  useEffect(() => {
    if (component) {
      setComponentForm({
        type: {
          name: component.type,
        },
        order: component.order,
        active: component.active,
        slideImages: component.slideImages,
        viewType: { name: component.viewType },
      });
      if (component.dataQuery) {
        setDataQuery({
          type: { name: component.dataQuery.type },
          query: JSON.stringify(component.dataQuery.query),
          limit: component.dataQuery.limit,
        });
      }
    }
  }, [component]);

  const setData = (data) => {
    setComponentForm({ ...componentForm, ...data });
  };

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          {(component?._id ? "Update " : "Add ") + "Landing Page Component"}
        </Text>
      </View>

      <View style={{ padding: 10, height: 70 }}>
        <PopUp
          style={{ borderWidth: 1, borderColor: "#E8E9EC", minHeight: 40 }}
          placeholder={"Select Component Type"}
          renderData={[
            { name: "Category" },
            { name: "Product" },
            { name: "Carousel" },
            { name: "Image" },
          ]}
          onSelection={(e) => setData({ type: e })}
          selectionValue={componentForm.type}
          label={"Type"}
          containerStyle={{ marginBottom: 10 }}
        ></PopUp>
      </View>

      <View style={{ padding: 10 }}>
        <InputboxWithBorder
          style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
          onChangeText={(e) => setData({ order: e })}
          label="Order"
          placeholder="Order"
          value={`${componentForm.order}`}
        ></InputboxWithBorder>
      </View>

      {componentForm.type.name === "Category" ? (
        <View style={{ padding: 10, height: 70 }}>
          <PopUp
            style={{ borderWidth: 1, borderColor: "#E8E9EC", minHeight: 40 }}
            placeholder={"Select Component Type"}
            renderData={[{ name: "Category" }, { name: "Manufacturer" }]}
            onSelection={(e) => setDataQuery({ ...dataQuery, type: e })}
            selectionValue={dataQuery.type}
            label={"Type"}
            containerStyle={{ marginBottom: 10 }}
          ></PopUp>
        </View>
      ) : (
        <></>
      )}
      {componentForm.type.name === "Category" ? (
        <View style={{ padding: 10, height: 70 }}>
          <PopUp
            style={{ borderWidth: 1, borderColor: "#E8E9EC", minHeight: 40 }}
            placeholder={"Select View Type"}
            renderData={[{ name: "Scroll" }, { name: "Wrap" }]}
            onSelection={(e) =>
              setComponentForm({ ...componentForm, viewType: e })
            }
            selectionValue={componentForm.viewType}
            label={"Type"}
            containerStyle={{ marginBottom: 10 }}
          ></PopUp>
        </View>
      ) : (
        <></>
      )}

      {["Product", "Category"].includes(componentForm.type.name) ? (
        <View style={{ padding: 10 }}>
          <InputboxWithBorder
            style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
            onChangeText={(e) => setDataQuery({ ...dataQuery, query: e })}
            label="Query"
            placeholder="Query"
            value={dataQuery.query}
            multiline={true}
            style={{ minHeight: 100 }}
          ></InputboxWithBorder>
        </View>
      ) : (
        <></>
      )}
      {["Product", "Category"].includes(componentForm.type.name) ? (
        <View style={{ padding: 10 }}>
          <InputboxWithBorder
            style={{ borderWidth: 1, borderColor: "#E8E9EC" }}
            onChangeText={(e) => setDataQuery({ ...dataQuery, limit: e })}
            label="Limit"
            placeholder="Limit"
            value={dataQuery.limit}
            multiline={true}
          ></InputboxWithBorder>
        </View>
      ) : (
        <></>
      )}

      {componentForm.type.name === "Image" ? (
        <AutoCompleteModal
          name="Slide"
          label="Slide"
          textInputStyle={{ marginBottom: 5 }}
          onSelection={(e) => setData({ slideImages: [e] })}
          value={componentForm.slideImages[0]}
          displayField={"name"}
          renderData={filterSlides}
          data={
            componentForm.slideImages.length > 0
              ? { data: componentForm.slideImages[0], displayField: "name" }
              : ""
          }
          searchApi={fetchSlides}
          isSubmitButtom={true}
        ></AutoCompleteModal>
      ) : (
        <></>
      )}

      {componentForm.type.name === "Carousel" ? (
        <View
          style={{
            width: window.width >= 500 ? "42%" : "100%",
            marginTop: window.width >= 500 ? 0 : 10,
            minHeight: 50,
          }}
        >
          <AutoCompleteModal
            name={"Slide"}
            label={"Slide"}
            textInputStyle={{ marginBottom: 5 }}
            onSelection={(e) => setData({ slideImages: e })}
            displayField={"name"}
            searchApi={fetchSlides}
            renderData={filterSlides}
            isSubmitButtom={true}
            multiSelect={true}
          ></AutoCompleteModal>
        </View>
      ) : (
        <></>
      )}

      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <CheckBox
            isLabel={true}
            value={componentForm.active}
            setValue={(data) => setData({ active: data })}
          ></CheckBox>
        </View>
      </View>
      <View style={[{ padding: 10 }]}>
        <Button pressFunc={() => submitForm()} title={"Submit"}></Button>
      </View>
    </View>
  );
};

export default LandingPageComponent;
