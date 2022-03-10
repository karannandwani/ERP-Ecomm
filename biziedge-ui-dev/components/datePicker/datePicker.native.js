import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, TouchableOpacity, View } from "react-native";

const DatePickerL = (props) => {
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  }
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const onDateChange = (e, d) => {
    const currentDate = d || date;
    setShowDatePicker(false);
    setDate(currentDate);
    props.onChange(currentDate);
  };
  return (
    <View>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text>{formatDate(props.value)}</Text>
      </TouchableOpacity>
      {showDatePicker ? (
        <DateTimePicker
          onChange={onDateChange}
          value={props.value}
          dateFormat="dayofweek day month"
        ></DateTimePicker>
      ) : (
        <></>
      )}
    </View>
  );
};
export default DatePickerL;
