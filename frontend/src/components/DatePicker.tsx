import React, { useState } from "react";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";
import { Box } from "@mui/material";
import "../styles/DatePicker.css";
import dayjs from "dayjs";

function DatePicker() {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  // Set the min and max dates for the date picker
  const minDate = dayjs(new Date(2020, 0, 1));
  // Set the maximum date to December 31 of the current year
  const maxDate = dayjs(new Date(new Date().getFullYear(), 11, 31));

  return (
    <Box className="date-picker-container">
      <MuiDatePicker
        label={"Change Date"}
        views={["month", "year"]}
        value={selectedDate}
        onChange={(newValue) => setSelectedDate(newValue)}
        minDate={minDate}
        maxDate={maxDate}
      />
    </Box>
  );
}

export default DatePicker;
