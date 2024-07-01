import { FormErrorMessage, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Tab, TabList, TabPanel, TabPanels, Tabs, FormLabel, Switch } from "@chakra-ui/react";
import { LineChart, Ticket, Timer, Dices } from "lucide-react";
import { FormField, FormInput } from "../FormFields";
import { Controller, useFormContext } from "react-hook-form";

const tabs = [
  { id: "lotteryV1settings", title: "Lottery 1" },
  { id: "lotteryV2settings", title: "Lottery 2" },
  { id: "auctionV1settings", title: "Auction 1" },
  { id: "auctionV2settings", title: "Auction 2" },
];

const labelStyles = {
  mt: '2',
  ml: '-2.5',
  fontSize: 'sm',
}

export const PhasesSettings = ({ register, errors, control }) => {
  const { watch } = useFormContext();

  const lotteryV1TicketsAmount = Number(watch("lotteryV1settings")?.ticketsAmount) || 0;
  const lotteryV2TicketsAmount = Number(watch("lotteryV2settings")?.ticketsAmount) || 0;
  const auctionV1TicketsAmount = Number(watch("auctionV1settings")?.ticketsAmount) || 0;
  const auctionV2TicketsAmount = Number(watch("auctionV2settings")?.ticketsAmount) || 0;
  const totalTicketsAmount = lotteryV1TicketsAmount + lotteryV2TicketsAmount + auctionV1TicketsAmount + auctionV2TicketsAmount;

  return (
    <Tabs w={"50%"}>
      <TabList overflow={"hidden"} border={"none"}>
        {tabs.map((tab, idx) => {
          const isInvalid = !!errors?.[tab.id];
          const errorProps = isInvalid
            ? { color: "#E53E3E" }
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
              _hover={{
                bg: "#0d151c14"
              }}
              transition={"background 150ms ease-out"}
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
                bg={"#E5E6E8"}
                label={"Tickets amount"}
                isInvalid={isInvalidTicketsAmount}
                errorMessage={isInvalidTicketsAmount && (<FormErrorMessage>{`${errorTicketsAmount}`}</FormErrorMessage>)}
              >
                <FormInput
                  icon={Ticket}
                  type={"number"}
                  id={`${tab.id}.ticketsAmount`}
                  placeholder={"Tickets amount"}
                  register={register}
                />
              </FormField>
              <FormLabel>
                Tickets in total: {totalTicketsAmount}
              </FormLabel>
              <FormField
                label={"Phase duration time (minutes)"}
                bg={"#E5E6E8"}
                isInvalid={!!errors?.[tab.id]?.phaseDuration}
                errorMessage={<FormErrorMessage>{`${errors?.[tab.id]?.phaseDuration?.message}`}</FormErrorMessage>}
              >
                <FormInput
                  icon={Timer}
                  type={"number"}
                  placeholder={"Phase duration time e.g., 5, 10, 15"}
                  id={`${tab.id}.phaseDuration`}
                  register={register}
                />
              </FormField>

              {tab.id === "auctionV1settings" && (
                <FormField
                  label={"Price increase/decrease after each round"}
                  bg={"#E5E6E8"}
                  isInvalid={!!errors?.[tab.id]?.priceIncrease}
                  errorMessage={<FormErrorMessage>{`${errors?.[tab.id]?.priceIncrease?.message}`}</FormErrorMessage>}>
                  <FormInput
                    type={"number"}
                    icon={LineChart}
                    id={`${tab.id}.priceIncrease`}
                    placeholder={"Price increase after each phase e.g., 5%, 10%"}
                    register={register}
                  />
                </FormField>
              )}
              {tab.id === "lotteryV2settings" && (
                <>
                  <FormField
                    label={"Roll price"}
                    bg={"#E5E6E8"}
                    isInvalid={!!errors?.[tab.id]?.rollPrice}
                    errorMessage={<FormErrorMessage>{`${errors?.[tab.id]?.rollPrice?.message}`}</FormErrorMessage>}>
                    <FormInput
                      type={"number"}
                      icon={Dices}
                      id={`${tab.id}.rollPrice`}
                      placeholder={"Price user will pay to roll the dice (can be free if set to 0)"}
                      register={register}
                    />
                  </FormField>
                  <FormField
                    label={"Tolerance"}
                    isInvalid={!!errors?.[tab.id]?.rollTolerance}
                    errorMessage={<FormErrorMessage>{`${errors?.[tab.id]?.rollTolerance?.message}`}</FormErrorMessage>}
                  >
                    <Controller
                      defaultValue={50}
                      render={({ field }) => (
                        <Slider min={1} max={99} defaultValue={50} aria-label='slider-ex-6' onChange={(v) => field.onChange(v)} mt={6}>
                          <SliderMark value={1} {...labelStyles}>
                            1%
                          </SliderMark>
                          <SliderMark value={50} {...labelStyles}>
                            50%
                          </SliderMark>
                          <SliderMark value={99} {...labelStyles}>
                            99%
                          </SliderMark>
                          <SliderMark
                            value={field.value}
                            textAlign="center"
                            color="black"
                            mt="-10"
                            ml="-5"
                            w="12"
                            bg={"var(--neonGreen)"}
                          >
                            {field.value}%
                          </SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack bg={"var(--neonGreen)"} />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      )}
                      name={`${tab.id}.rollTolerance`}
                      control={control}
                    />
                  </FormField>
                </>
              )}
              <FormField label="Enabled">
                <Switch
                  id={`${tab.id}.enabled`}
                  {...register(`${tab.id}.enabled`)}
                />
              </FormField>
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};
