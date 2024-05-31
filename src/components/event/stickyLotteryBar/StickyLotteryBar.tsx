import { Box, Button, Flex, Grid, Text, useMediaQuery } from "@chakra-ui/react";
import Countdown, { zeroPad } from "react-countdown";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import { LotteryPhases } from "@/components/event/eventLottery/lotteryContent/LotteryPhases";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useSetIsWalletModalOpen } from "@thirdweb-dev/react";

export const StickyLotteryBar = ({
  eventData,
  startDate,
  updateActivePhase,
  updatePhaseState,
  activePhase,
  phasesState,
  toggleWindowExpanded,
  isWindowExpanded,
  isEnrolled,
  setIsWindowExpanded,
}) => {
  const { isLoggedIn: isConnected } = useUser();
  const setIsModalWalletOpen = useSetIsWalletModalOpen();
  const [isMobile] = useMediaQuery("(max-width: 1650px)");

  const [saleViewMobile] = useMediaQuery("(max-width: 1180px)");

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
        flexDirection={"column"}
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
        />

        <Grid
          display={{ base: isWindowExpanded ? "none" : "grid", iw: "grid" }}
          gap={{ base: 2, iwMid: 0 }}
          gridTemplateColumns={{ base: "auto 1fr", iwMid: "repeat(3, 1fr)" }}
          w={"100%"}
          px={6}
        >
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
                sale starts in
              </Text>
              <Countdown
                date={new Date(startDate)}
                renderer={renderer}
                zeroPadTime={0}
              />
            </Flex>
            {!isWindowExpanded &&
              isEnrolled &&
              !!eventData &&
              !saleViewMobile && (
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
                onClick={
                  isConnected
                    ? toggleWindowExpanded
                    : () => setIsModalWalletOpen(true)
                }
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

const renderer = ({ hours, minutes, completed, days }) => {
  if (completed) {
    return (
      <Text fontWeight={"bold"} fontSize={"1.2rem"}>
        Already live !
      </Text>
    );
  } else {
    return (
      <Flex
        flexDirection={"column"}
        bg={"#fff"}
        rounded={"4px"}
        py={1}
        px={4}
        mb={3}
      >
        <Flex
          style={{ fontVariantNumeric: "tabular-nums" }}
          fontSize={{ base: "1rem", xl: "2rem" }}
          color={"#000"}
          fontWeight={"bold"}
          letterSpacing={{ base: "normal", xl: "-2px" }}
          lineHeight={{ base: "1rem", xl: "2rem" }}
        >
          <Text>
            {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}
          </Text>
        </Flex>
        <Flex
          justifyContent={"space-around"}
          fontSize={{ base: "0.9rem", xl: "1rem" }}
        >
          <Text>D</Text>
          <Text>H</Text>
          <Text>M</Text>
        </Flex>
      </Flex>
    );
  }
};
