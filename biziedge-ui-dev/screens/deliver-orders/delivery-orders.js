import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Linking,
} from "react-native";
import SearchBar from "../../components/common/serchBar/searchBar";
import { connect } from "react-redux";
import AddModal from "../../components/addModal/addModal";
import ReceiveOrderComponent from "../../components/orders/acceptOrderComponent";
import { Styles } from "../../globalStyle";
import {
  deliverOrder,
  dispatchOrders,
} from "../../redux/actions/delivery-order.action";
import Icon from "../../components/common/icon";
import Button from "../../components/common/buttom/button";
import { DimensionContext } from "../../components/dimensionContext";

const DeliveryOrders = ({ driversOrders, deliverOrder, dispatchOrders }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [password, setPassword] = useState(null);
  const { window } = useContext(DimensionContext);

  const handleCallback = (childData) => {
    setModalVisible(childData);
    setSelected({});
  };
  const handleAction = (childData) => {
    setSelected(childData);
    setModalVisible(true);
  };

  const renderCallBack = () => {
    return (
      <View
        style={{
          flexDirection: "column",
          padding: 20,
        }}
      >
        <ReceiveOrderComponent
          onChangeText={(e) => setPassword(e)}
          pressFunc={() => {
            setModalVisible(false);
            deliverOrder({
              orderId: selected.id,
              password: password,
              type: "Delivery",
              _id: selected._id,
            });
          }}
        ></ReceiveOrderComponent>
      </View>
    );
  };
  const onChangeText = () => {};

  return (
    <View style={[Styles.container]}>
      {driversOrders.find((x) => x.status.name != "Dispatched") ? (
        <View
          style={{
            flexDirection: "row-reverse",
          }}
        >
          <View>
            <Button
              title={"Mark all as Dispatched"}
              pressFunc={() => {
                dispatchOrders({
                  orders: driversOrders
                    .filter((x) => x.name != "Dispatched")
                    .map((item) => ({ _id: item._id, id: item.id })),
                });
              }}
            ></Button>
          </View>
        </View>
      ) : (
        <></>
      )}
      <View
        style={{
          width:
            window.width >= 1040
              ? window.width / 3
              : window.width >= 960 && window.width < 1040
              ? window.width / 3
              : window.width >= 641 && window.width < 960
              ? window.width / 2.5
              : window.width >= 500 && window.width < 641
              ? window.width / 2
              : window.width >= 400 && window.width < 500
              ? window.width / 1.5
              : window.width - 20,
          paddingTop: 20,
        }}
      >
        <View>
          <TouchableOpacity style={[styles.searchBarStyle]}>
            <View style={{ alignSelf: "center" }}>
              <Icon
                name="search"
                style={{ height: 20, width: 20, marginTop: 5 }}
              ></Icon>
            </View>
            <TextInput
              style={{ flex: 1, paddingLeft: 10 }}
              placeholder="Search"
              onChangeText={() => onChangeText()}
            ></TextInput>
          </TouchableOpacity>

          <View>
            <FlatList
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5, maxHeight: window.height / 1.5 }}
              keyExtractor={(item, index) => index.toString()}
              data={driversOrders}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.listStyle,
                    {
                      backgroundColor:
                        selected?._id === item._id ? "gray" : "#fff",
                    },
                  ]}
                >
                  <View style={{ flexWrap: "wrap", padding: 10 }}>
                    <Text style={[Styles.h2]}>ORDER #{item.orderNo}</Text>
                    <Text>Customer:</Text>
                    <Text>{item.address.name}</Text>
                    <Text>{item.address.email}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`tel:${item.address.phone}`)
                      }
                    >
                      <Text>{item.address.phone}</Text>
                    </TouchableOpacity>
                    {item.address.alternativePhone ? (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            `tel:${item.address.alternativePhone}`
                          )
                        }
                      >
                        <Text>{item.address.alternativePhone}</Text>
                      </TouchableOpacity>
                    ) : (
                      <></>
                    )}
                    <Text style={{ fontSize: 14 }}>
                      {item.address.street1} {", " + item.address.street2}
                    </Text>
                    <Text style={{ fontSize: 14 }}>
                      {item.address.city} {", " + item.address.pincode}
                    </Text>
                    <Text style={{ fontSize: 14 }}>
                      {item.address.state} {", " + item.address.country}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity style={{ marginTop: 10 }}>
                      <Button
                        pressFunc={() => handleAction(item)}
                        title="Deliver"
                        style={{ paddingRight: 10 }}
                      ></Button>
                    </TouchableOpacity>
                    {item.status.name != "Dispatched" ? (
                      <TouchableOpacity style={{ marginTop: 10 }}>
                        <Button
                          pressFunc={() => {
                            dispatchOrders({
                              orders: [{ _id: item._id, id: item.id }],
                            });
                          }}
                          title="Dispactch"
                          style={{ paddingRight: 10 }}
                        ></Button>
                      </TouchableOpacity>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
      <View>
        <AddModal
          showModal={modalVisible}
          onSelection={handleCallback}
          modalViewStyle={{
            minWidth: 299,
            minHeight: 299,
            flexDirection: "column",
            paddingTop: 20,
            paddingBottom: window.width > 360 ? 20 : 10,
            paddingLeft: window.width > 360 ? 40 : 10,
            paddingRight: window.width > 360 ? 40 : 10,
            borderRadius: 6,
            backgroundColor: "#fefefe",
          }}
          add={renderCallBack()}
        ></AddModal>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarStyle: {
    flexDirection: "row",
    maxHeight: 70,
    minHeight: 50,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  listStyle: {
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const mapStateToProps = ({ driversOrders }) => ({
  driversOrders,
});

export default connect(mapStateToProps, { deliverOrder, dispatchOrders })(
  DeliveryOrders
);
