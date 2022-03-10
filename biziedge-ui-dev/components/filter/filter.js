import React, { useEffect, useReducer, useState } from "react";
import moment from "moment";
import DatePicker from "../datePicker/datePicker";
import DropDownPicker from "react-native-dropdown-picker";
import CalendarPicker from "react-native-calendar-picker";

import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Button,
  StyleSheet
} from "react-native";
import AddModal from "../../components/addModal/addModal";
import Modal from "../common/modal/modal";

if (Platform.OS !== "web") {
  DropDownPicker.setListMode("MODAL");
}
const FilterComponent = ({
  filterConfig,
  onFilterChange,
  variables,
  zIndex,
  type,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [value, setValue] = useState("");
  const { width, height } = useWindowDimensions();
  const [datesSelected, setDatesSelected] = useState(new Date());
  const [selected, setSelected] = useState("");
  useEffect(() => {
    setDatesSelected(filterConfig.value ? filterConfig.value : new Date());
  }, [filterConfig]);
  const handleCallback = () => {
    setShowDatePicker(showDatePicker ? false : true);
  };
  const slot = [
    { value: "8-12" },
    { value: "12-5" },
    { value: "5-10" },
  ];

  const selectItem = (item) => {
    setSelected(item);
    onFilterChange({ value: item })
    console.log(item)
    setShowDatePicker(false)
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white", width: "100%" }}>
      <TouchableOpacity
        style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}
        onPress={() => {
          setShowDatePicker(showDatePicker ? false : true);
        }}
      >{type === "date" ? <Text>
        {filterConfig?.value || filterConfig?.defaultValue
          ? `${new Date(
            filterConfig?.value || filterConfig?.defaultValue
          ).toLocaleDateString()}`
          : ""}
      </Text> : <Text>
        {filterConfig?.value || filterConfig?.defaultValue
          ?
          filterConfig?.value || filterConfig?.defaultValue

          : ""}
      </Text>}

      </TouchableOpacity>
      {showDatePicker ? (
        <AddModal
          showModal={showDatePicker}
          onSelection={handleCallback}
          modalViewStyle={{
            padding: 20,
            maxHeight: 370,
            maxWidth: 370,
            minWidth: 300
          }}
          add={
            <View style={{ flexDirection: "column", flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onPress={() => {
                    onFilterChange({ value: datesSelected });
                    setShowDatePicker(false);
                  }}
                  title="Select"
                  style
                ></Button>
                <Button
                  onPress={() => {
                    setShowDatePicker(false);
                  }}
                  title="Cancel"
                  style
                ></Button>
              </View>
              <View>
                {type === "date" ? <CalendarPicker
                  allowRangeSelection={false}
                  minDate={new Date()}
                  maxDate={new Date("2050-1-1")}
                  todayBackgroundColor="#e6ffe6"
                  selectedDayColor="#0082D2"
                  selectedDayTextColor="#000000"
                  textStyle={{
                    color: "#000000",
                  }}
                  width={Math.min(width, 300)}
                  height={Math.min(height, 400)}
                  onDateChange={(date) => {
                    setDatesSelected(date);
                  }}
                  allowBackwardRangeSelect={false}
                  scaleFactor={365}
                  selectedStartDate={datesSelected}
                // selectedEndDate={datesSelected}
                /> : <TouchableOpacity>
                  {slot.map((header, i) => {
                    return (
                      <RenderItem
                        item={header.value}
                        key={i}
                        index={i}
                        selectItem={selectItem}
                      />
                    );
                  })}
                </TouchableOpacity>}
              </View>
            </View>
            // <View
            //   style={{
            //     maxHeight: 350,
            //     maxWidth: 500,
            //     minHeight: 350,
            //     minWidth: 500,
            //     backgroundColor: "#FFFFFF",
            //     alignSelf: "center",
            //     flex: 1,
            //     paddingBottom: 30,
            //     flexDirection: "column",
            //   }}
            // >
            //   <View
            //     style={{
            //       flex: 1,
            //       flexDirection: "row",
            //       justifyContent: "space-between",
            //       height: "20%",
            //     }}
            //     // style={{
            //     //   maxHeight: 50,
            //     //   flexDirection: "row",
            //     //   // justifyContent: "space-between",
            //     //   margin: 5,
            //     //   width:'100%'
            //     // }}
            //   >
            //     <View>
            //       <Button
            //         onPress={() => {
            //           onFilterChange({ value: datesSelected });
            //           setShowDatePicker(false);
            //         }}
            //         title="Select"
            //         style
            //       ></Button>
            //     </View>
            //     <View>
            //       <Button
            //         onPress={() => {
            //           setShowDatePicker(false);
            //         }}
            //         title="Cancel"
            //       ></Button>
            //     </View>
            //   </View>
            //   <View
            //     style={{
            //       height: "80%",
            //     }}
            //   >
            //     <CalendarPicker
            //       allowRangeSelection={false}
            //       minDate={new Date()}
            //       maxDate={new Date("2050-1-1")}
            //       todayBackgroundColor="#e6ffe6"
            //       selectedDayColor="#0082D2"
            //       selectedDayTextColor="#000000"
            //       textStyle={{
            //         color: "#000000",
            //       }}
            //       width={Math.min(width, 300)}
            //       height={Math.min(height, 400)}
            //       onDateChange={(date) => {
            //         setDatesSelected(date);
            //       }}
            //       allowBackwardRangeSelect={false}
            //       scaleFactor={365}
            //       selectedStartDate={datesSelected}
            //       // selectedEndDate={datesSelected}
            //     />
            //   </View>
            // </View>
          }
        ></AddModal>
      ) : (
        <></>
      )}
    </View>
  );
};
const RenderItem = ({
  item,
  index,
  selectItem,
}) => (
  <TouchableOpacity
    key={"menu" + index}
    style={{ flex: 1 }}
    onPress={() => {
      selectItem(item);
    }}
  >
    <Text style={[styles.item]}>
      {item}
    </Text>
  </TouchableOpacity>
);
export default FilterComponent;
const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 16,
    height: 44,
    borderBottomWidth: 1,
    borderColor: "#D3D3D3",
    minWidth: "95%",
    textAlign: "center",
  },
})
// <Modal
//   transparent={true}
//   animationType={"slide"}
//   visible={showDatePicker}
//   presentationStyle="overFullScreen"
//   onRequestClose={() => {}}
// >
//   <View
//     style={{
//       position: "absolute",
//       width: 3000,
//       height: 3000,
//       justifyContent: "flex-end",
//       backgroundColor: "rgba(0,0,0, 0.5)",
//     }}
//   >
//     <View
//       style={{
//         maxHeight: 350,
//         maxWidth: 500,
//         backgroundColor: "#FFFFFF",
//         alignSelf: "center",
//         flex: 1,
//         paddingBottom: 30,
//       }}
//     >
//       <View
//         style={{
//           maxHeight: 50,
//           flexDirection: "row",
//           flexWrap: "wrap",
//           justifyContent: "space-between",
//           margin: 5,
//         }}
//       >
//         <Button
//           onPress={() => {
//             onFilterChange({ value: datesSelected });
//             setShowDatePicker(false);
//           }}
//           title="Select"
//         ></Button>
//         <Button
//           onPress={() => {
//             setShowDatePicker(false);
//           }}
//           title="Cancel"
//         ></Button>
//       </View>
//       <CalendarPicker
//         allowRangeSelection={false}
//         minDate={new Date("2016-1-1")}
//         maxDate={new Date("2050-1-1")}
//         todayBackgroundColor="#e6ffe6"
//         selectedDayColor="#0082D2"
//         selectedDayTextColor="#000000"
//         textStyle={{
//           color: "#000000",
//         }}
//         width={Math.min(width, 300)}
//         height={Math.min(height, 400)}
//         onDateChange={(date) => {
//           console.log(date);
//           setDatesSelected(date);
//         }}
//         allowBackwardRangeSelect={false}
//         scaleFactor={365}
//         // selectedStartDate={datesSelected && datesSelected[0]}
//         // selectedEndDate={datesSelected && datesSelected[1]}
//       />
//     </View>
//   </View>
// </Modal>
