import { Button, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { useState } from "react";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import { LotteryPhases } from "@/components/event/eventLottery/lotteryContent/LotteryPhases";
import { ArrowDown, ArrowUp } from "lucide-react";
import { getCookie, setCookie } from "cookies-next";
import { useConnectWallet } from "@/hooks/useConnect";
import { useSetIsWalletModalOpen } from "@thirdweb-dev/react";

export const StickyLotteryBar = ({
  eventData,
  startDate,
  updateActivePhase,
  updatePhaseState,
  activePhase,
  phasesState,
}) => {
  const { isConnected } = useConnectWallet();
  const setIsModalWalletOpen = useSetIsWalletModalOpen();
  const [isMobile] = useMediaQuery("(max-width: 1650px)");

  const { id } = eventData;

  const isEnrolled = getCookie(`${id}-enroll`);
  const [isWindowExpanded, setIsWindowExpanded] = useState(false);

  const toggleWindowExpanded = () => {
    if (!isEnrolled) {
      setCookie(`${id}-enroll`, true);
    }
    setIsWindowExpanded((prev) => !prev);
  };

  return (
    <Flex
      pos={"fixed"}
      flexDirection={"column"}
      zIndex={1000}
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
            left={isMobile ? "3.5rem" : "calc(calc(100% - 1200px) / 5)"}
            top={isMobile ? "unset" : "5.5rem"}
            bottom={isMobile ? "-3rem" : "unset"}
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <ArrowDown size={isMobile ? 90 : 130} strokeWidth={2} />
          </Flex>
        )}
        {!isWindowExpanded && isEnrolled && (
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
            <ArrowUp size={isMobile ? 90 : 130} strokeWidth={2} />
          </Flex>
        )}

          <EventLottery
            activePhase={activePhase}
            phasesState={phasesState}
            updatePhaseState={updatePhaseState}
            updateActivePhase={updateActivePhase}
            startDate={startDate}
            eventData={eventData}
            isWindowExpanded={isWindowExpanded}
          />

        <Flex
          flexDirection={"column"}
          w={"100%"}
          alignItems={"center"}
          textAlign={"center"}
          maxW={"580px"}
          alignSelf={"center"}
        >
          <Text fontSize={"1.5rem"} color={"#858585"}>
            sale starts in
          </Text>
          <Countdown
            date={new Date(eventData?.startsAt || "")}
            renderer={renderer}
            zeroPadTime={0}
          />
          {!isWindowExpanded && isEnrolled && !!eventData && (
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
              variant={"red"}
              w={"100%"}
              mt={"0.5rem"}
              rounded={"24px"}
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
      <Text
        style={{ fontVariantNumeric: "tabular-nums" }}
        fontSize={"3rem"}
        color={"#000"}
        fontWeight={"bold"}
        letterSpacing={"-2px"}
      >
        {days} DAY {hours} HOUR {minutes} MIN
      </Text>
    );
  }
};
