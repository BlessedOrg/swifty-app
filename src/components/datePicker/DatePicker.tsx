import { Input } from "@chakra-ui/react";
import DatePickerReact from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/Datepicker.css";
import { Controller } from "react-hook-form";

interface Props {
  name: string;
  control: any;
  isDisabled?: boolean;
}

export const DatePicker = ({ name, control, isDisabled = false }: Props) => {
  return (
    <Controller
      render={({ field }) => (
        <DatePickerReact
          disabled={isDisabled}
          startDate={new Date()}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          timeCaption="Time"
          dateFormat="dd.MM.yyyy, HH:mm"
          maxDate={null}
          minDate={new Date().setHours(new Date().getHours() + 1, 0)}
          fixedHeight
          popperPlacement="top"
          customInput={<Input isDisabled bg={"#E5E6E8"} />}
          onChange={(date) => {
            return field.onChange(date);
          }}
          selected={field.value}
        />
      )}
      name={name}
      control={control}
    />
  );
};
