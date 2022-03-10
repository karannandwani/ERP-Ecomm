import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import AddModal from "../../components/addModal/addModal";
import SearchBar from "../../components/common/serchBar/searchBar";
import * as DocumentPicker from "expo-document-picker";
import {
  addProduct,
  uploadMultipleProduct,
  downloadTemplate,
  fetchProducts,
} from "../../redux/actions/propduct.action";
import ProductList from "../../components/common/productList";
import { addError } from "../../redux/actions/toast.action";
import * as WebBrowser from "expo-web-browser";
import config from "../../config/config";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";
import * as FileSystem from "expo-file-system";

const Product = ({
  selectedBusiness,
  products,
  uploadMultipleProduct,
  downloadTemplate,
  multipleProduct,
  navigation,
  fetchProducts,
}) => {
  const [popupVisibility, setPopupVisibility] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [selected, setSelected] = useState({});
  const [uploadedFile, setUploadedFile] = useState([]);
  const [isProductListModal, setProductListModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [phrase, setPhrase] = useState("");
  const { window } = useContext(DimensionContext);
  useEffect(() => {
    setFilterdata(phrase);
  }, [products]);

  useEffect(() => {
    return () => {
      setPhrase("");
      setSelected({});
    };
  }, []);

  const setFilterdata = (text) => {
    setFilteredProducts([
      ...products.filter((x) =>
        x.name.toLowerCase().startsWith(text.toLowerCase())
      ),
    ]);
  };
  const searchProductByPhrase = (text) => {
    setPhrase(text);
    setFilterdata(text);
    fetchProducts({
      business: selectedBusiness.business._id,
    });
  };
  const handelPopupCallback = (childData) => {
    setSelected(childData);
    navigation.navigate("add-products", { product: childData._id });
  };

  const download = async () => {
    if (Platform.OS != "web") {
      await WebBrowser.openBrowserAsync(
        `${config.baseUrl}/api/product/download/template`
      );
    } else {
      downloadTemplate();
    }
  };

  const addMultipleProduct = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "application/*",
        base64: true,
      })
        .then(async (response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
        });

      if (result.type == "success") {
        const type = result.name.split(".")[1];
        if (type == "xlsx") {
          const uri =
            Platform.OS == "web"
              ? result.uri.split(",")[1]
              : await FileSystem.readAsStringAsync(result.uri, {
                  encoding: "base64",
                });
          const selectedFile = {
            business: selectedBusiness.business._id,
            file: uri,
          };
          uploadMultipleProduct(selectedFile);
          setUploadedFile(multipleProduct);
          setProductListModal(true);
        } else {
          alert("Please upload the document of type .xlsx");
          addError("Please upload the document of type .xlsx");
        }
      } else {
        addError("File error", 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToAddProduct = () => {
    navigation.navigate("add-products", { product: null });
  };

  return (
    <View style={[Styles.container]}>
      <View
        style={{
          flexDirection: window.width >= 500 ? "row" : "column",
          justifyContent: window.width >= 500 ? "flex-end" : "center",
        }}
      >
        <View>
          <Button
            style={{ borderRadius: 5 }}
            title={"Add Product"}
            pressFunc={() => {
              setSelected({});
              navigateToAddProduct();
            }}
          ></Button>
        </View>
        <View
          style={{
            marginLeft: window.width >= 500 ? 10 : 0,
            marginRight: window.width >= 500 ? 10 : 0,
            marginTop: window.width >= 500 ? 0 : 10,
            marginBottom: window.width >= 500 ? 0 : 10,
          }}
        >
          <Button
            style={{ borderRadius: 5 }}
            title={"Add Multiple Product"}
            pressFunc={() => {
              addMultipleProduct();
              setSelected({});
            }}
          ></Button>
        </View>
        <View>
          <Button
            style={{ borderRadius: 5 }}
            title={"Download"}
            pressFunc={() => {
              download();
              setSelected({});
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
          renderData={filteredProducts}
          isImage={true}
          onSelection={handelPopupCallback}
          onChangeText={searchProductByPhrase}
          hideScrollbar={false}
          selected={selected}
        ></SearchBar>
      </View>
      <View style={{ flex: 1 }}>
        <AddModal
          showModal={isProductListModal}
          onSelection={(data) => setProductListModal(data)}
          modalViewStyle={
            {
              // maxHeight: "50%",
              // padding: Platform.OS == "web" ? 40 : 0,
              // minWidth: "20%",
              // maxWidth: "30",
              // justifyContent: "start",
              // alignItems: "start",
            }
          }
          add={
            <ProductList
              products={multipleProduct}
              onClose={(e) => {
                setProductListModal(e);
              }}
            ></ProductList>
          }
        ></AddModal>
      </View>
    </View>
  );
};
const mapStateToProps = ({ selectedBusiness, products, multipleProduct }) => ({
  selectedBusiness,
  products,
  multipleProduct,
});
export default connect(mapStateToProps, {
  addProduct,
  uploadMultipleProduct,
  downloadTemplate,
  fetchProducts,
})(Product);

const styles = StyleSheet.create({
  heading: {
    flex: 1,
  },
});
