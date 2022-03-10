import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TextInput,
} from "react-native";
import { connect } from "react-redux";
import uuid from "react-native-uuid";
import CartItemComponent from "../../../components/orders/cartItemComponent";
import Button from "../../../components/common/buttom/button";
import { Camera } from "expo-camera";
import Icon from "../../../components/common/icon";

const { width } = Dimensions.get("window");

const ScanProduct = ({ navigation, inventory }) => {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [scanStyleStatus, setScanStyleStatus] = useState(styles.scanNormal);

  const findScannedProdInInventory = (data) => {
    for (let index = 0; index < inventory.length; index++) {
      const prod = inventory[index];
      let prodFromLot = prod.products.find((lot) => lot.barcodeNo == data);
      if (prodFromLot) {
        setScanStyleStatus(styles.scanSuccess);
        let temProd = scannedProducts;
        let existingProdIndex = temProd.findIndex(
          (p) => p.lotId === prodFromLot.lotId
        );
        if (existingProdIndex > -1) {
          temProd[existingProdIndex].quantity += 1;
        } else {
          temProd.push({ ...prod.product, ...prodFromLot, quantity: 1 });
        }
        setScannedProducts([...temProd]);
        resetScanner();
        break;
      } else {
        setScanStyleStatus(styles.scanError);
        resetScanner();
      }
    }
  };

  const resetScanner = () =>
    setTimeout(() => setScanStyleStatus(styles.scanNormal), 2000);

  const handleBarCodeScanned = (obj) => {
    findScannedProdInInventory(obj.data);
  };

  const onItemQtyChange = (newQty, lotId) => {
    let tempProd = scannedProducts;
    tempProd[tempProd.findIndex((p) => p.lotId == lotId)].quantity = newQty;
    setScannedProducts([...tempProd]);
  };

  const onRemoveFromCart = (lotId) => {
    let tempProd = scannedProducts;
    tempProd.splice(tempProd[tempProd.findIndex((p) => p.lotId == lotId)], 1);
    setScannedProducts([...tempProd]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.scannerContainer, scanStyleStatus]}>
        <CustomBarcodeScanner
          basicStyle={styles.scannerStyle}
          onBarCodeScan={handleBarCodeScanned}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          borderColor: "#A9A9A9",
          borderWidth: 2,
          alignItems: "center",
          paddingLeft: 2,
        }}
      >
        <Icon name="search" width={20} height={20}></Icon>
        <TextInput
          placeholder="Search Product"
          autoFocus={true}
          style={{ height: 40 }}
          returnKeyType={"search"}
          returnKeyLabel={"search"}
          onSubmitEditing={(e) => alert(e.nativeEvent.text)}
        ></TextInput>
      </View>

      <View
        style={{
          flex: 6,
          marginTop: 20,
          marginLeft: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {scannedProducts.length > 0 ? (
          <View>
            <Text style={{ fontSize: 20, marginBottom: 8 }}>
              List of scanned products:
            </Text>
            {scannedProducts.map((p) => (
              <CartItemComponent
                id={p.lotId}
                name={p.name}
                price={p.mrp}
                quantity={p.quantity}
                img={p.image && p.image.length > 0 ? p.image[0] : null}
                key={uuid.v4()}
                onQtyChange={onItemQtyChange}
                onRemoveFromCart={onRemoveFromCart}
              />
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 20, fontStyle: "italic", color: "#A9A9A9" }}>
            Add products by scanning or typing in the search bar...
          </Text>
        )}
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {scannedProducts.length > 0 ? (
          <View
            style={{
              flex: 1,
              marginRight: 10,
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.products}>
              TOTAL{" - "}
              {scannedProducts
                .map((p) => p.mrp * p.quantity)
                .reduce((a, b) => a + b, 0)}
            </Text>
          </View>
        ) : (
          <></>
        )}

        {scannedProducts.length > 0 ? (
          <Button
            style={{ minHeight: 40, minWidth: 200, width: "90%" }}
            title="Proceed to Payment"
            pressFunc={() => {
              navigation.navigate("payment", {
                items: scannedProducts,
                totalAmount: scannedProducts
                  .map((p) => p.mrp * p.quantity)
                  .reduce((a, b) => a + b, 0),
              });
            }}
          ></Button>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

const CustomBarcodeScanner = ({ basicStyle, onBarCodeScan }) => {
  useEffect(() => {
    Camera.getPermissionsAsync().then((p) => {
      if (!p?.granted) Camera.requestPermissionsAsync().then((x) => {});
    });
  }, []);

  return (
    <Camera
      style={basicStyle}
      onBarCodeScanned={(e) => onBarCodeScan(e)}
    ></Camera>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: width * 0.09,
    marginTop: "10%",
    textAlign: "center",
    width: "70%",
    color: "white",
  },
  cancel: {
    fontSize: width * 0.05,
    textAlign: "center",
    width: "70%",
    color: "white",
  },
  product: {
    color: "#000000",
    fontSize: 15,
    fontSize: 15,
  },
  scannerContainer: {
    flex: 3,
    alignItems: "center",
  },
  scannerStyle: {
    height: "100%",
    minHeight: 100,
    width: "100%",
    maxWidth: 800,
    borderColor: "#00FF00",
    borderWidth: 3,
  },
  scanNormal: {
    borderWidth: 0,
  },
  scanSuccess: {
    borderColor: "green",
    borderWidth: 4,
  },
  scanError: {
    borderColor: "red",
    borderWidth: 4,
  },
});

const mapStateToProps = ({ inventory }) => ({ inventory });
export default connect(mapStateToProps, null)(ScanProduct);
