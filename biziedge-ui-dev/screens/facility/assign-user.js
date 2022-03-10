import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import Avatar from "../../components/common/avatar";
import Checkbox from "../../components/common/checkBox/checkbox";
import Icon from "../../components/common/icon";
import AddModal from "../../components/addModal/addModal";
import { DimensionContext } from "../../components/dimensionContext";

const Item = ({ item, viewConfirmationModal, action }) => (
  <View
    style={{
      flexDirection: "row",
      minHeight: 55,
      borderRadius: 2,
      borderBottomWidth: 3,
      borderColor: "#DFE0E3",
      flex: 1,
    }}
  >
    <View>
      {action === "remove" ? (
        <Avatar
          source={
            item?.user?.image
              ? {
                  uri: item?.user?.image
                    ? `data:image/jpeg;base64,${item?.user?.image}`
                    : "",
                }
              : null
          }
        />
      ) : (
        <Avatar
          source={
            item?.image
              ? {
                  uri: item?.image
                    ? `data:image/jpeg;base64,${item?.image}`
                    : "",
                }
              : null
          }
        />
      )}
    </View>

    {/* {item?.name}
                    </Text>
                    <Text style={{ padding: 2 }}>{item?.email}</Text> */}
    <View style={{ flexDirection: "column", flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {action === "remove" ? (
          <Text
            style={{
              color: "#808080",
              paddingTop: item?.user?.email ? 2 : 7,
            }}
          >
            {item?.user?.name}
          </Text>
        ) : (
          <Text
            style={{
              color: "#808080",
              paddingTop: item?.user?.email ? 2 : 7,
            }}
          >
            {item?.name}
          </Text>
        )}
        <TouchableOpacity
          onPress={() =>
            viewConfirmationModal({
              user: item._id,
              action: action,
            })
          }
        >
          <Icon
            name={action === "remove" ? "delete" : "plus"}
            fill="#808080"
            style={{
              marginTop: action === "remove" ? 0 : 5,
              marginRight: action === "remove" ? 0 : 5,
            }}
          ></Icon>
        </TouchableOpacity>
      </View>

      {action === "remove" ? (
        <Text style={{ padding: 2 }} numberOfLines={1} ellipsizeMode="middle">
          {item?.user?.email}{" "}
        </Text>
      ) : (
        <Text style={{ padding: 2 }} numberOfLines={1} ellipsizeMode="middle">
          {item?.email}
        </Text>
      )}
    </View>
  </View>
);

const AssignUser = ({
  facility,
  users,
  facilityUserMap,
  onSubmitAssignedUser,
  selectedBusinessId,
  onRemoveUser,
}) => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [remainingUsers, setRemainingUsers] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [confirmationModal, viewConfirmationModal] = useState(null);
  const [show, setModal] = useState(false);
  const { window } = useContext(DimensionContext);

  useEffect(() => {
    setAssignedUsers([
      ...facilityUserMap.filter((x) => x.facility === facility._id),
    ]);
  }, [!facility, users]);

  useEffect(() => {
    setRemainingUsers([
      ...users.filter(
        (x) => !assignedUsers.map((x) => x.user._id).includes(x._id)
      ),
    ]);
  }, [assignedUsers]);

  const handleCheckboxCallback = (item, value) => {
    setSelectedData({
      business: selectedBusinessId,
      facility: facility._id,
      user: item._id,
    });
    // setRemainingUsers([
    //   ...remainingUsers.map((x) =>
    //     x._id === item._id
    //       ? { ...x, selected: value }
    //       : { ...x, selected: false }
    //   ),
    // ]);
  };

  const ConfirmationBox = ({ data, action }) => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, flex: 1, marginTop: 30 }}>
          Are you sure you want to {action === "assign" ? "assign" : "remove"}{" "}
          this user {action === "assign" ? "to" : "from"} selected facility.
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignSelf: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              confirm(action, data);
              closeModal();
            }}
          >
            <Text
              style={{
                fontSize: 20,
                marginRight: 20,
                color: "#65ACCB",
                marginTop: 20,
              }}
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVehicleModalVisible(false)}>
            <Text
              style={{
                fontSize: 20,
                color: "#65ACCB",
                marginTop: 20,
              }}
            >
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const confirm = (action, data) => {
    viewConfirmationModal(null);
    if (action === "assign") {
      onSubmitAssignedUser({
        business: selectedBusinessId,
        facility: facility._id,
        user: data,
      });
    } else {
      onRemoveUser({ mapId: data });
    }
  };
  const handleCallback = () => {
    // viewConfirmationModal(false);
    viewConfirmationModal(null);
  };
  let inputContainerWidth;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          height: "100%",
        }}
      >
        <View
          style={{
            width: "50%",
            minheight: "100%",
            borderRightWidth: 1,
            borderColor: "gray",
          }}
        >
          <View>
            <View
              style={{
                height: 40,
                backgroundColor: "#E9EBEE",
                alignContent: "center",
                justifyContent: "center",
              }}
              onLayout={(event) => {
                inputContainerWidth = event.nativeEvent.layout.height;
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                Assigned User
              </Text>
            </View>
            <View>
              {assignedUsers && assignedUsers.length > 0 ? (
                assignedUsers.map((item, index) => (
                  <Item
                    key={index.toString()}
                    item={item}
                    viewConfirmationModal={viewConfirmationModal}
                    action={"remove"}
                  ></Item>
                ))
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>

        <View
          style={{
            width: "50%",
            minheight: "100%",
            borderRightWidth: 1,
            borderColor: "gray",
          }}
        >
          <View>
            <View
              style={{
                height: 40,
                backgroundColor: "#E9EBEE",
                alignContent: "center",
                justifyContent: "center",
              }}
              onLayout={(event) => {
                inputContainerWidth = event.nativeEvent.layout.height;
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                Assigned New User
              </Text>
            </View>
            <View>
              {remainingUsers && remainingUsers.length > 0 ? (
                remainingUsers.map((item, index) => (
                  <Item
                    key={index.toString()}
                    item={item}
                    viewConfirmationModal={viewConfirmationModal}
                    action={"assign"}
                  ></Item>
                ))
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      </View>
      {/* <View
        style={{
          flex: 1,
          borderColor: "#DFE0E3",
          borderWidth: 1,
          minHeight: "100%",
        }}
      >
        <View
          style={{
            color: "#fff",
            backgroundColor: "#DCDCDC",
            alignContent: "center",
            justifyContent: "center",
            minHeight: 50,
          }}
        >
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Assigned User
          </Text>
        </View>
        <View style={{ marginTop: 10, maxHeight: "90%" }}>
          {assignedUsers && assignedUsers.length > 0 ? (
            <FlatList
              keyExtractor={(assignedUser) => assignedUser._id}
              data={assignedUsers}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    minHeight: 55,
                    borderRadius: 2,
                    borderBottomWidth: 3,
                    borderColor: "#DFE0E3",
                  }}
                >
                  <Avatar
                    style={{
                      height: 50,
                      maxWidth: 50,
                      borderRadius: 35,
                      // flex: 1,
                      alignSelf: "center",
                    }}
                    source={
                      item?.user?.image
                        ? {
                            uri: item?.user?.image
                              ? `data:image/jpeg;base64,${item?.user?.image}`
                              : "",
                          }
                        : null
                    }
                  />
                  <View style={{ flex: 2 }}>
                    <Text
                      style={{
                        color: "#808080",
                        padding: 2,
                        paddingTop: item.user.email ? 2 : 7,
                      }}
                    >
                      {item?.user?.name}
                    </Text>
                    <Text style={{ padding: 2 }}>{item?.user?.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() =>
                      viewConfirmationModal({
                        user: item._id,
                        action: "remove",
                      })
                    }
                  >
                    <Icon
                      name="delete"
                      fill="#808080"
                    ></Icon>
                  </TouchableOpacity>
                </View>
              )}
            ></FlatList>
          ) : (
            <></>
          )}
        </View>
      </View>

      <View
        style={{
          flex: 1,
          borderColor: "#DFE0E3",
          borderWidth: 1,
          minHeight: "100%",
        }}
      >
        <View
          style={{
            color: "#fff",
            backgroundColor: "#DCDCDC",
            alignContent: "center",
            justifyContent: "center",
            minHeight: 50,
          }}
        >
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Select New User
          </Text>
        </View>
        <View style={{ marginTop: 10, maxHeight: "90%" }}>
          {remainingUsers && remainingUsers.length > 0 ? (
            <FlatList
              keyExtractor={(remainingUser) => remainingUser._id}
              data={remainingUsers}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    borderRadius: 2,
                    borderBottomWidth: 3,
                    borderColor: "#DFE0E3",
                    maxHeight: 55,
                  }}
                >
                  <Avatar
                    style={{
                      height: 40,
                      maxWidth: 40,
                      borderRadius: 35,
                      alignSelf: "center",
                    }}
                    source={
                      item?.image
                        ? {
                            uri: item?.image
                              ? `data:image/jpeg;base64,${item?.image}`
                              : "",
                          }
                        : null
                    }
                  />
                  <View style={{ flex: 2 }}>
                    <Text
                      style={{
                        color: "#808080",
                        padding: 2,
                        paddingTop: item.email ? 2 : 7,
                      }}
                    >
                      {item?.name}
                    </Text>
                    <Text style={{ padding: 2 }}>{item?.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ flex: 0.5, justifyContent: "center" }}
                    onPress={() =>
                      viewConfirmationModal({
                        user: item._id,
                        action: "assign",
                      })
                    }
                  >
                    <Icon
                      name="plus"
                      fill="#808080"
                      // style={{ width: 35, height: 35 }}
                    ></Icon>
                  </TouchableOpacity>
                </View>
              )}
            ></FlatList>
          ) : (
            <></>
          )}
        </View>
      </View>
   
    */}

      <AddModal
        showModal={confirmationModal != null}
        onSelection={handleCallback}
        modalViewStyle={{
          padding: 5,
          height: "100%",
        }}
        add={
          confirmationModal ? (
            <View
              style={{
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
                borderRadius: 6,
                backgroundColor: "#fefefe",
                height: 200,
                padding: 20,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 25,
                  flex: 1,
                }}
              >
                <Text>
                  Are you sure you want to {confirmationModal.action} this user{" "}
                  {confirmationModal.action === "assign" ? "to" : "from"}{" "}
                  selected facility?
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 85,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    confirm(confirmationModal.action, confirmationModal.user)
                  }
                >
                  <Text
                    style={{
                      color: "#65ACCB",
                      marginRight: 20,
                      fontSize: 18,
                    }}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => viewConfirmationModal(null)}>
                  <Text style={{ color: "#65ACCB", fontSize: 18 }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <></>
          )
        }
      ></AddModal>
    </View>
  );
};

export default AssignUser;
