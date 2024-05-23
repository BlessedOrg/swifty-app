import {
  FormErrorMessage,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { LineChart, Ticket, Timer } from "lucide-react";
import { FormField, FormInput } from "../FormFields";
import {Controller} from "react-hook-form";

const tabs = [
  { id: "lotteryV1settings", title: "Lottery 1" },
  { id: "lotteryV2settings", title: "Lottery 2" },
  { id: "auctionV1settings", title: "Auction 1" },
  { id: "auctionV2settings", title: "Auction 2" },
];

export const PhasesSettings = ({ register, errors, control }) => {
  return (
    <Tabs w={"50%"}>
      <TabList overflow={"hidden"} border={"none"}>
        {tabs.map((tab, idx) => {
          const isInvalid = !!errors?.[tab.id];
          const errorProps = isInvalid
            ? {
                color: "#E53E3E",
              }
            : {};
          return (
            <Tab
              key={tab.id}
              _selected={{
                fontWeight: "500",
                color: !isInvalid && "#0D151CA3",
                bg: "#ECEDEF",
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
              {tab.id !== "auctionV1settings" && (
                <FormField
                  label={"Phase duration time (minutes)"}
                  bg={"#E5E6E8"}
                  isInvalid={!!errors?.[tab.id]?.phaseDuration}
                  errorMessage={
                      <FormErrorMessage>{`${errors?.[tab.id]?.phaseDuration
                          ?.message}`}</FormErrorMessage>
                  }
                >
                  <FormInput
                    icon={Timer}
                    type={"number"}
                    placeholder={"Phase duration time e.g., 5, 10, 15"}
                    id={`${tab.id}.phaseDuration`}
                    register={register}
                  />
                </FormField>
              )}

              {tab.id === "auctionV1settings" && (
                <FormField
                  label={"Price increase after each phase (%)"}
                  isInvalid={!!errors?.[tab.id]?.priceIncrease}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.[tab.id]?.priceIncrease
                      ?.message}`}</FormErrorMessage>
                  }
                >
                  <FormInput
                    type={"number"}
                    icon={LineChart}
                    id={`${tab.id}.priceIncrease`}
                    placeholder={
                      "Price increase after each phase e.g., 5%, 10%"
                    }
                    register={register}
                  />
                </FormField>
              )}
              {tab.id === "lotteryV2settings" && (
                <FormField
                  label={"Tolerance (1-99%)"}
                  isInvalid={!!errors?.[tab.id]?.rollTolerance}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.[tab.id]?.rollTolerance
                      ?.message}`}</FormErrorMessage>
                  }
                >
                  <Controller
                    render={({ field }) => (
                      <FormInput
                        type={"number"}
                        icon={LineChart}
                        id={`${tab.id}.rollTolerance`}
                        placeholder={"Tolerance in range 1-99%"}
                        onChange={(e) => {
                          const v = +e.target.value;
                          field.onChange(v);
                        }}
                        value={field.value}
                      />
                    )}
                    name={`${tab.id}.rollTolerance`}
                    control={control}
                  />
                </FormField>
              )}
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};
