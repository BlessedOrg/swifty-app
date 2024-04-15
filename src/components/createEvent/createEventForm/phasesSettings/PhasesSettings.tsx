import {
  FormErrorMessage,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ArrowDown01, AudioLines } from "lucide-react";
import { FormField } from "../CreateEventForm";

const tabs = [
  { id: "lotteryV1settings", title: "Lottery 1" },
  { id: "lotteryV2settings", title: "Lottery 2" },
  { id: "auctionV1settings", title: "Auction 1" },
  { id: "auctionV2settings", title: "Auction 2" },
];
export const PhasesSettings = ({ register, errors }) => {
  return (
    <Tabs>
      <TabList rounded={"5px"} overflow={"hidden"}>
        {tabs.map((tab) => {
          const isInvalid = !!errors?.[tab.id];
          const errorProps = isInvalid
            ? {
                bg: "red",
                color: "#fff",
              }
            : {};
          return (
            <Tab
              key={tab.id}
              _selected={{
                fontWeight: "500",
                color: !isInvalid && "#0D151CA3",
                bg: !isInvalid ? "#ECEDEF" : "#c11d1d",
              }}
              {...errorProps}
              mx={"1px"}
            >
              {tab.title}
            </Tab>
          );
        })}
      </TabList>

      <TabPanels pt={4}>
        {tabs.map((tab) => {
          const isInvalidTicketsAmount = !!errors?.[tab.id]?.ticketsAmount;
          const errorTicketsAmount = errors?.[tab.id]?.ticketsAmount?.message;
          return (
            <TabPanel
              key={tab.id}
              p={0}
              display={"flex"}
              flexDirection={"column"}
              gap={4}
            >
              <FormField
                isInvalid={isInvalidTicketsAmount}
                errorMessage={
                  isInvalidTicketsAmount && (
                    <FormErrorMessage>{`${errorTicketsAmount}`}</FormErrorMessage>
                  )
                }
                label={"Tickets amount"}
              >
                <ArrowDown01 size={20} />
                <Input
                  type={"number"}
                  p={0}
                  border={"none"}
                  bg={"transparent"}
                  fontWeight={500}
                  color={"#0D151CA3"}
                  overflow={"hidden"}
                  maxH={"450px"}
                  _focusVisible={{}}
                  placeholder={"Tickets amount"}
                  id={`${tab.id}.ticketsAmount`}
                  {...register(`${tab.id}.ticketsAmount`)}
                  px={2}
                />
              </FormField>

              <FormField label={"Phase duration time (minutes)"}>
                <AudioLines />
                <Input
                  type={"number"}
                  p={0}
                  border={"none"}
                  bg={"transparent"}
                  fontWeight={500}
                  color={"#0D151CA3"}
                  overflow={"hidden"}
                  maxH={"450px"}
                  _focusVisible={{}}
                  placeholder={"Phase duration time e.g., 5, 10, 15"}
                  id={`${tab.id}.phaseDuration`}
                  {...register(`${tab.id}.phaseDuration`)}
                  px={2}
                />
              </FormField>
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};