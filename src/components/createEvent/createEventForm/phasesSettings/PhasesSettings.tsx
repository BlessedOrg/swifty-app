import {
  FormErrorMessage,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Ticket, Timer } from "lucide-react";
import { FormField, FormInput } from "../FormFields";

const tabs = [
  { id: "lotteryV1settings", title: "Lottery 1" },
  { id: "lotteryV2settings", title: "Lottery 2" },
  { id: "auctionV1settings", title: "Auction 1" },
  { id: "auctionV2settings", title: "Auction 2" },
];
export const PhasesSettings = ({ register, errors }) => {
  return (
    <Tabs>
      <TabList overflow={"hidden"} border={"none"}>
        {tabs.map((tab, idx) => {
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
              mx={idx !== 0 ? "1px" : 0}
            >
              {tab.title}
            </Tab>
          );
        })}
      </TabList>

      <TabPanels p={0}>
        {tabs.map((tab) => {
          const isInvalidTicketsAmount = !!errors?.[tab.id]?.ticketsAmount;
          const errorTicketsAmount = errors?.[tab.id]?.ticketsAmount?.message;
          return (
            <TabPanel
              key={tab.id}
              px={2}
              display={"flex"}
              flexDirection={"column"}
              gap={4}
              bg={"#ECEDEF"}
            >
              <FormField
                isInvalid={isInvalidTicketsAmount}
                errorMessage={
                  isInvalidTicketsAmount && (
                    <FormErrorMessage>{`${errorTicketsAmount}`}</FormErrorMessage>
                  )
                }
                bg={"#E5E6E8"}
                label={"Tickets amount"}
              >
                <FormInput
                  icon={Ticket}
                  type={"number"}
                  id={`${tab.id}.ticketsAmount`}
                  placeholder={"Tickets amount"}
                  register={register}
                />
              </FormField>

              <FormField label={"Phase duration time (minutes)"} bg={"#E5E6E8"}>
                <FormInput
                  icon={Timer}
                  type={"number"}
                  placeholder={"Phase duration time e.g., 5, 10, 15"}
                  id={`${tab.id}.phaseDuration`}
                  register={register}
                />
              </FormField>
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};
