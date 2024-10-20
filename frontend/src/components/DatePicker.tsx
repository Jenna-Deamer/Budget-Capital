import React from "react";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";

function DatePicker() {
  return (
    <>
      <MuiDatePicker
        label={"Change Date"}
        views={["month", "year"]}
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "#316380",
            color: "#FFF",
            width: "200px",
            marginRight: "24px",
          },
          "& .MuiInputBase-input": {
            color: "#FFF",
          },
          "& .MuiInputLabel-root": {
            color: "#FFF",
            "&.Mui-focused": {
              color: "#FFF",
            },
          },
          "& .MuiFormHelperText-root": {
            color: "#FFF",
          },
          "& .MuiSvgIcon-root": {
            color: "#FFF",
          },
        }}
      />
    </>
  );
}

export default DatePicker;
