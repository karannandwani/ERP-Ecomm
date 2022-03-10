import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { connect } from "react-redux";
import CheckBox from "../../components/common/checkBox/checkbox";
const AssignBeatComponent = ({ assignedBeats, user }) => {
  const [checkBoxValue, setCheckBoxValue] = useState([
    {
      beat: "605ae46dbc9d7396bbb18082",
      day: 0,
    },
  ]);

  var array = assignedBeats.map((el) => ({
    ...el,
    checkBox: [0, 1, 2, 3, 4, 5, 6],
  }));

  const handleItemCallback = (data) => {
    setCheckBoxValue([...checkBoxValue, data]);
  };

  const isChecked = (beat, day) => {
    return checkBoxValue.find((x) => x.beat === beat && x.day === day);
  };
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          maxWidth: 300,
        }}
      >
        <View>
          <Image
            style={{ height: 80, width: 80, borderRadius: 40 }}
            source={require("../../assets/avatar.png")}
          ></Image>
        </View>
        <View style={{ flex: 1, justifyContent: "center", marginBottom: 30 }}>
          <Text>{user.name}</Text>
          <Text>{user.phone}</Text>
        </View>
      </View>
      <View style={{ flex: 5 }}>
        <View
          style={{
            minHeight: 40,
            maxHeight: 40,
            backgroundColor: "#D2D2D2",
            justifyContent: "center",
            paddingLeft: 10,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ flex: 1 }}>Beat Name</Text>
          <Text style={{ flex: 1 }}>Monday</Text>
          <Text style={{ flex: 1 }}>Tuesday</Text>
          <Text style={{ flex: 1 }}>Wednesday</Text>
          <Text style={{ flex: 1 }}>Thursday</Text>
          <Text style={{ flex: 1 }}>Friday</Text>
          <Text style={{ flex: 1 }}>Saturday</Text>
          <Text style={{ flex: 1 }}>Sunday</Text>
        </View>
        <View style={{ flex: 1 }}>
          {array.map((item) => {
            return (
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <Text style={{ flex: 1 }}>{item.name}</Text>
                {item.checkBox.map((x) => {
                  return (
                    <CheckBox
                      setValue={() =>
                        handleItemCallback({ beat: item._id, day: x })
                      }
                      value={isChecked(item._id, x)}
                    ></CheckBox>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = ({ user, assignedBeats }) => ({ user, assignedBeats });
export default connect(mapStateToProps, {})(AssignBeatComponent);
