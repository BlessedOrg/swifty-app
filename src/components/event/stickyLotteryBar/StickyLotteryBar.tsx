import { Box, Button, Flex, Grid, Text, useMediaQuery } from "@chakra-ui/react";
import Countdown, { zeroPad } from "react-countdown";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import { LotteryPhases } from "@/components/event/eventLottery/lotteryContent/LotteryPhases";
import { ArrowDown, ArrowLeft, ArrowUp } from "lucide-react";
import { useState } from "react";
import { countEndDateForWholeSale } from "@/utils/countEndDateForWholeSale";
import { RendererCard } from "@/components/event/stickyLotteryBar/RendererCard";
import Link from "next/link";
import Image from "next/image";

export const StickyLotteryBar = ({
  eventData,
  startDate,
  updateActivePhase,
  updatePhaseState,
  activePhase,
  phasesState,
  toggleWindowExpanded: toggleWindowState,
  isWindowExpanded,
  isEnrolled,
  setIsWindowExpanded: setExpandedWindow,
}) => {
  const endDate = countEndDateForWholeSale(eventData);
  const [showEndLotteryCountdown, setShowEndLotteryCountdown] = useState(false);

  const [isMobile] = useMediaQuery("(max-width: 1650px)");

  const [saleViewMobile] = useMediaQuery("(max-width: 1180px)");

  const phasesEnabled = [
    eventData.lotteryV1settings,
    eventData.lotteryV2settings,
    eventData.auctionV1settings,
    eventData.auctionV2settings,
  ];
  const allPhasesEnabled = phasesEnabled.filter((i) => i?.enabled).length !== 1;

  const singleTabEnabledData = phasesEnabled.find((i, idx) => i.enabled);

  const singleTabEnabledIdx = phasesEnabled.findIndex((i) => i.enabled);
  const setIsWindowExpanded = !allPhasesEnabled ? () => {} : setExpandedWindow;
  if (!allPhasesEnabled) {
    setExpandedWindow(true);
  }

  const toggleWindowExpanded = !allPhasesEnabled ? () => {} : toggleWindowState;
  return (
    <Flex
      pos={"fixed"}
      flexDirection={"column"}
      zIndex={7}
      w={"100%"}
      bottom={0}
      left={0}
      bg={"#D9D9D9"}
      borderTopLeftRadius={"40px"}
      borderTopRightRadius={"40px"}
      justifyContent={"center"}
      alignItems={"center"}
      pt={{ base: "0.5rem", iwMid: "1.5rem" }}
      pb={{ base: 0, iw: "1.5rem" }}
      transition={"all 350ms"}
      onClick={!isWindowExpanded ? () => setIsWindowExpanded(true) : () => {}}
      cursor={!isWindowExpanded ? "pointer" : "initial"}
      role="group"
      _hover={{
        ...(!isWindowExpanded && { bg: "#ebeaea" }),
      }}
    >
      <Flex
        flexDirection={isWindowExpanded ? "column-reverse" : "column"}
        pos={"relative"}
        w={"100%"}
        px={{ base: "0.5rem", iwMid: "1rem" }}
        alignItems={"center"}
      >
        <EventLottery
          activePhase={activePhase}
          phasesState={phasesState}
          updatePhaseState={updatePhaseState}
          updateActivePhase={updateActivePhase}
          startDate={startDate}
          eventData={eventData}
          isWindowExpanded={isWindowExpanded}
          {...{ allPhasesEnabled, singleTabEnabledData, singleTabEnabledIdx }}
        />

        <Grid
          display={{ base: isWindowExpanded ? "none" : "grid", iw: "grid" }}
          gap={{ base: 2, iwMid: 0 }}
          gridTemplateColumns={{ base: "auto 1fr", iwMid: "repeat(3, 1fr)" }}
          w={"100%"}
          px={6}
        >
          {allPhasesEnabled ? (
            <Flex
              as={"button"}
              onClick={toggleWindowExpanded}
              alignItems={"center"}
            >
              <Box
                _groupHover={{ transform: "scale(1.15)" }}
                transition={"transform 0.3s ease-out"}
              >
                {isWindowExpanded ? (
                  <ArrowDown
                    size={saleViewMobile ? 30 : isMobile ? 90 : 130}
                    strokeWidth={2}
                  />
                ) : (
                  <ArrowUp
                    size={saleViewMobile ? 30 : isMobile ? 90 : 130}
                    strokeWidth={2}
                  />
                )}
              </Box>
            </Flex>
          ) : (
            <Flex as={Link} href={"/"} alignItems={"center"}>
              <Box
                _groupHover={{ transform: "scale(1.15)" }}
                transition={"transform 0.3s ease-out"}
              >
                {isWindowExpanded ? (
                  <Flex gap={4}>
                    <ArrowLeft
                      size={saleViewMobile ? 30 : isMobile ? 70 : 90}
                      strokeWidth={2}
                    />
                    <Image
                      src={"/images/modularSummit.svg"}
                      width={200}
                      height={200}
                      alt=""
                      style={{ width: "150px", height: "auto" }}
                    />
                  </Flex>
                ) : (
                  <ArrowUp
                    size={saleViewMobile ? 30 : isMobile ? 90 : 130}
                    strokeWidth={2}
                  />
                )}
              </Box>
            </Flex>
          )}

          <Flex
            w={"100%"}
            alignItems={"center"}
            textAlign={"center"}
            alignSelf={"center"}
            flexDirection={"column"}
          >
            <Flex
              gap={2}
              alignItems={"center"}
              py={{ base: 4, iw: 2 }}
              lineHeight={"normal"}
              minW={{ base: "310px", iwLg: "375px" }}
            >
              <Text
                fontSize={{ base: "1rem", iwMid: "1.5rem" }}
                color={"#1D1D1B"}
                textTransform={"uppercase"}
                fontWeight={"bold"}
              >
                {showEndLotteryCountdown ? "sale ends in" : "sale starts in"}
              </Text>
              {!showEndLotteryCountdown && (
                <Countdown
                  date={new Date(startDate)}
                  renderer={rendererStart}
                  zeroPadTime={0}
                  onComplete={() => {
                    setShowEndLotteryCountdown(true);
                  }}
                />
              )}
              {showEndLotteryCountdown && (
                <Countdown
                  date={endDate}
                  renderer={rendererEnd}
                  zeroPadTime={0}
                />
              )}
            </Flex>
            {!isWindowExpanded &&
              isEnrolled &&
              !!eventData &&
              !saleViewMobile &&
              allPhasesEnabled && (
                <Flex bg={"#e0e0e0"} p={2} rounded={"7px"}>
                  <LotteryPhases
                    disabledPhases={false}
                    startDate={startDate}
                    setActivePhase={updateActivePhase}
                    setPhasesState={updatePhaseState}
                    activePhase={activePhase}
                    phasesState={phasesState}
                    eventData={eventData}
                  />
                </Flex>
              )}
            {!isEnrolled && !isWindowExpanded && (
              <Button
                display={{ base: "none", iwMid: "block" }}
                bg={"#06F881"}
                w={"100%"}
                mt={"0.5rem"}
                rounded={"24px"}
                maxWidth={"236px"}
                // onClick={
                //   isConnected
                //     ? toggleWindowExpanded
                //     : () =>
                //         connect(metamaskWallet())
                // } //TODO handle it
              >
                Enroll
              </Button>
            )}
          </Flex>
        </Grid>
      </Flex>
    </Flex>
  );
};

const rendererEnd = ({ hours, minutes, completed, days }) => {
  if (completed) {
    return (
      <Text fontWeight={"bold"} fontSize={"1.2rem"}>
        Finished!
      </Text>
    );
  } else {
    return <RendererCard {...{ hours, minutes, days }} />;
  }
};
const rendererStart = ({ hours, minutes, completed, days }) => {
  if (completed) {
    return (
      <Text fontWeight={"bold"} fontSize={"1.2rem"}>
        Already live !
      </Text>
    );
  } else {
    return <RendererCard {...{ hours, minutes, days }} />;
  }
};
