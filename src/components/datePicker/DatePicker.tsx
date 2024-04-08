import { Input } from "@chakra-ui/react";
import DatePickerReact from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/Datepicker.css";
import { Controller } from "react-hook-form";
interface Props {
  isClearable?: boolean;
  onChange?: (date: Date) => any;
  selectedDate?: Date | undefined;
  showPopperArrow?: boolean;
  name: string;
  control: any;
}

export const DatePicker = ({ name, control }: Props) => {
  return (
    <Controller
      render={({ field }) => (
        <DatePickerReact
          startDate={new Date()}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          timeCaption="Time"
          dateFormat="dd.MM.yyyy, HH:mm"
          // maxTime={new Date().setHours(23, 0)}
          maxDate={null}
          minDate={new Date().setHours(new Date().getHours() + 1, 0)}
          fixedHeight
          popperPlacement="top"
          customInput={
            <Input border={"2px solid"} borderColor={"#aaa"} isDisabled />
          }
          onChange={(date) => field.onChange(date)}
          selected={field.value}
        />
      )}
      name={name}
      control={control}
    />
  );
};
