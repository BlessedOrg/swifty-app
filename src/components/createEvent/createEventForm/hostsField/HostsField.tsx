import { Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Trash } from "lucide-react";
import {
  FormField,
  FormInput,
} from "@/components/createEvent/createEventForm/FormFields";

export const HostsField = ({ control, isDisabled }) => {
  const [currentFieldName, setCurrentFieldName] = useState("");
  const { fields, append, remove } = useFieldArray({
    name: "hosts",
    control,
  });
  const onHostAddHandler = () => {
    append({ name: currentFieldName });
    setCurrentFieldName("");
  };
  const colorText = "#0D151CA3";

  return (
    <Flex flexDirection={"column"} gap={4}>
      <Text fontWeight={"bold"}>Hosts</Text>
      {fields.map((field: any, i) => (
        <HostCard key={field.id} {...field} index={i} remove={remove} />
      ))}
      <FormField>
        <FormInput
          placeholder={"Host name"}
          value={currentFieldName}
          onChange={(e) => setCurrentFieldName(e.target.value)}
          isDisabled={isDisabled}
        />
        <Button
          bg={colorText}
          color={"#fff"}
          onClick={onHostAddHandler}
          _hover={{}}
          isDisabled={isDisabled}
        >
          Add
        </Button>
      </FormField>
    </Flex>
  );
};

const HostCard = ({ name, index, remove }) => {
  return (
    <Flex alignItems={"center"} justifyContent={"space-between"} px={4}>
      <Flex alignItems="center" gap={4}>
        <Text color={"#000"}>{name}</Text>
      </Flex>
      <Flex as={"button"} color={"red"} onClick={() => remove(index)}>
        <Trash size={19} />
      </Flex>
    </Flex>
  );
};
