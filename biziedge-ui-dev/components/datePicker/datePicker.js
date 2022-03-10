import React, { useState } from "react";
import DatePicker from "react-date-picker";
import "./datepicker.css";
const DatePickerL = (props) => {
  const [date, setDate] = useState(new Date());
  const onDateChange = (e) => {
    props.onChange(e);
    setDate(e);
  };
  return (
    <DatePicker
      onChange={onDateChange}
      value={props.value}
      mode={props.mode}
      clearIcon={null}
      format="dd-MM-y"
      className="none"
    ></DatePicker>
  );
};
export default DatePickerL;
