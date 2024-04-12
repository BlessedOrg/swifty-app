import { Divider, Flex, FormLabel } from "@chakra-ui/react";
import { DatePicker } from "@/components/datePicker/DatePicker";
import { TimezoneSelect } from "@/components/timezoneSelect/TimezoneSelect";

export const DatePickerField = ({ wrapperBg, control }) => {
  return (
    <Flex gap={2}>
      <Flex
        flexDirection={"column"}
        bg={wrapperBg}
        p={2}
        rounded={"7px"}
        pos={"relative"}
      >
        <Divider
          orientation="vertical"
          borderColor="rgba(13,21,28, 0.4)"
          borderStyle="dashed"
          pos={"absolute"}
          h={"30px"}
          left={"13px"}
          top={"50%"}
          style={{
            transform: "translate(-50%, -50%)",
          }}
        />
        <Flex alignItems={"center"} gap={2}>
          <Flex
            w={"10px"}
            h={"10px"}
            minW={"10px"}
            minH={"10px"}
            bg={"#C1C2C6"}
            rounded={"100%"}
            zIndex={1}
          ></Flex>
          <FormLabel htmlFor="startsAt" w={"152px"} m={0}>
            Start
          </FormLabel>{" "}
          <Flex py={"1px"} w={"200px"}>
            <DatePicker name={"startsAt"} control={control} />
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={2}>
          <Flex
            w={"10px"}
            h={"10px"}
            minW={"10px"}
            minH={"10px"}
            bg={wrapperBg}
            rounded={"100%"}
            border={"1px solid"}
            borderColor={"#C1C2C6"}
          ></Flex>
          <FormLabel htmlFor="finishAt" w={"152px"} m={0}>
            End
          </FormLabel>{" "}
          <Flex py={"1px"} w={"200px"}>
            <DatePicker name={"finishAt"} control={control} />
          </Flex>
        </Flex>
      </Flex>
      <Flex w={"150px"}>
        <TimezoneSelect onChange={(e) => console.log(e)} />
      </Flex>
    </Flex>
  );
};
