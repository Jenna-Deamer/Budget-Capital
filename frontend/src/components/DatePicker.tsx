import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";
import { Box } from "@mui/material";
import "../styles/DatePicker.css";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

interface DatePickerProps {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};

dayjs.extend(updateLocale);

// Update locale to use short month names
dayjs.updateLocale("en", {
  monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
});

function DatePicker({ selectedDate, setSelectedDate }: DatePickerProps) {
  // Set the min and max dates for the date picker
  const minDate = dayjs(new Date(2020, 0, 1));
  // Set the maximum date to December 31 of the current year
  const maxDate = dayjs(new Date(new Date().getFullYear(), 11, 31));

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      setSelectedDate(newValue.toDate()); // Pass the selected date as a Date object
    }
  };

  return (
    <Box className="date-picker-container">
      <MuiDatePicker
        label={"Change Date"}
        views={["month", "year"]}
        value={dayjs(selectedDate)} 
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
      />
    </Box>
  );
}

export default DatePicker;