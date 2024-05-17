import { Box, Button, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import { LotteryPhases } from "@/components/event/eventLottery/lotteryContent/LotteryPhases";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useConnectWallet } from "@/hooks/useConnect";
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
  const { isConnected } = useConnectWallet();
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
      py={"1.5rem"}
      transition={"all 350ms"}
      onClick={saleViewMobile ? toggleWindowExpanded : undefined}
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
        alignItems={"center"}
      >
        {isWindowExpanded && (
          <Flex
            as={"button"}
            onClick={toggleWindowExpanded}
            pos={"absolute"}
            left={
              isMobile
                ? saleViewMobile
                  ? "2rem"
                  : "3.5rem"
                : "calc(calc(100% - 1200px) / 5)"
            }
            top={
              isMobile && !saleViewMobile
                ? "unset"
                : saleViewMobile
                  ? "2rem"
                  : "5.5rem"
            }
            bottom={isMobile ? (saleViewMobile ? "unset" : "-3rem") : "unset"}
            style={{
              transform: "translate(-50%, -50%)",
            }}
            transition={"transform 0.3s ease-in-out"}
          >
            <ArrowDown
              size={saleViewMobile ? 30 : isMobile ? 90 : 130}
              strokeWidth={2}
            />
          </Flex>
        )}
        {!isWindowExpanded && isEnrolled && !saleViewMobile && (
          <Flex
            as={"button"}
            onClick={toggleWindowExpanded}
            pos={"absolute"}
            left={isMobile ? "3.5rem" : "calc(calc(100% - 1200px) / 5)"}
            top={isMobile ? "unset" : "50%"}
            bottom={isMobile ? "-3rem" : "unset"}
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <Box
              _groupHover={{ transform: "scale(1.15)" }}
              transition={"transform 0.3s ease-out"}
            >
              <ArrowUp
                size={saleViewMobile ? 30 : isMobile ? 90 : 130}
                strokeWidth={2}
              />
            </Box>
          </Flex>
        )}

        {!saleViewMobile && (
          <EventLottery
            activePhase={activePhase}
            phasesState={phasesState}
            updatePhaseState={updatePhaseState}
            updateActivePhase={updateActivePhase}
            startDate={startDate}
            eventData={eventData}
            isWindowExpanded={isWindowExpanded}
          />
        )}

        <Flex
          w={"100%"}
          alignItems={"center"}
          textAlign={"center"}
          alignSelf={"center"}
          flexDirection={"column"}
        >
          <Flex gap={2} alignItems={"center"}>
            <Text
              fontSize={"1.5rem"}
              color={"#1D1D1B"}
              textTransform={"uppercase"}
              fontWeight={"bold"}
            >
              sale starts in
            </Text>
            <Countdown
              date={new Date(eventData?.startsAt || "")}
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
          {saleViewMobile && (
            <Flex
              transition={"150ms all"}
              overflow={"hidden"}
              h={isWindowExpanded ? "155px" : "60px"}
              mt={4}
              flexDirection={"column"}
              px={4}
              py={1}
              fontWeight={"bold"}
              bg={"rgba(255, 250, 205, 1)"}
              rounded={"4px"}
            >
              <Text textTransform={"uppercase"}>mobile version</Text>
              <Text fontSize={"1.2rem"}>Work in Progress!</Text>
              <Text fontWeight={"normal"} textAlign={"start"} mt={4}>
                During our recent hackathon, we focused on the desktop
                experience.
              </Text>
              <Text fontWeight={"normal"} textAlign={"start"}>
                Stay tuned—enjoy the desktop version!
              </Text>
            </Flex>
          )}
          {!isEnrolled && !isWindowExpanded && (
            <Button
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
            {days}:{hours}:{minutes}
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
