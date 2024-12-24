import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = ({onDateChange}) => {
  const [dates, setDates] = useState([null, null]);

  const handleDateChange = (dates) => {
    setDates(dates);
    onDateChange(dates);
  };
  const customInputStyle = {
    outline: 'none',  
    border: 'none',  
    boxShadow: 'none' 
  };

  return (
    <div className="">
      <DatePicker
        selected={dates[0]}
        onChange={handleDateChange}
        startDate={dates[0]} 
        endDate={dates[1]}
        selectsRange
        minDate={new Date(1940, 0, 1)}
        maxDate={new Date()}
        dateFormat="yyyy-MM-dd"
        className="bg-white p-4 rounded-lg shadow-md"
        placeholderText="Select a date range"
        customInput={<input style={customInputStyle} />}
        />

      {dates[0] && dates[1] && (
        <div className="mt-4">
          <strong>Selected Date Range:</strong> {dates[0].toDateString()} - {dates[1].toDateString()}
        </div>
      )}
    </div>
  );
};

export default DateSelector;
