import Image from "next/image";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import {SaleViewWrapper} from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/SaleViewWrapper";

interface IProps {
    toggleFlipView: ()=> void;
    isLotteryActive: boolean;
    activePhase: any;
    cooldownTimeInSec: number;
    startDate?: any;
    onLotteryStart?: any
    isStartView?:boolean
    currentTabId: string
}
export const CooldownCard = ({
  toggleFlipView,
  isLotteryActive,
  activePhase,
  currentTabId
} : IProps) => {
  const contentPerPhase = {
    0: {
      title: "Lottery I",
      description:
        "Deposit now and secure your chance to get event tickets. We have four simple steps adding decentralized tech and on-chain randomness ensuring fair and fun distribution .",
    },
    1: {
      title: "Lottery II",
      description:
        "Maximize your chances of securing the best ticket deals for the event by generating additional lucky numbers. Each on-chain random number generation costs only 1 USDC",
    },
    2: {
      title: "Auction I",
      description:
        "Bid and reach the strike price. If there is higher demand than ticket randomess brings fair distribution.",
    },
    3: {
      title: "Auction II",
      description:
        "Bid to be within the league of chads who still need a ticket. If you are within the leaderboard at the end of the phase your get to mint the ticket. Place your bid wisely. ",
    },
  };

  const cooldownContent = contentPerPhase[activePhase?.idx || 0];
  return (
    <SaleViewWrapper withBorder={false} saleData={null} toggleFlipView={toggleFlipView} id={currentTabId}>
      <Flex
        flexDirection={"column"}
        gap={2}
        color="#000"
        w={"full"}
        px={"2rem"}
        py={"1.5rem"}
        border={"2px solid"}
        rounded={"12px"}
        borderColor={"#6157FF"}
        overflow={"hidden"}
        position={"relative"}
        bg={"#FFFACD"}
        maxW={"666px"}
      >
        <Flex justifyContent={"space-between"} alignItems={"center"} gap={4}>
          <Text fontWeight={"bold"} fontSize={"20px"}>
              {cooldownContent.description}
          </Text>
        </Flex>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Image
            src={"/images/cooldownSlider/smile_purple.svg"}
            alt={""}
            width={550}
            height={550}
            style={{
              width: "auto",
              height: "80%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
          <Flex
            flexDirection={"column"}
            gap={0}
            color={"#6157FF"}
            textTransform={"uppercase"}
            textAlign={"right"}
            fontWeight={"bold"}
            lineHeight={"normal"}
            alignSelf={"flex-end"}
          >
            <Text fontSize={"2rem"}>{isLotteryActive ? "Next phase" : "Start phase"}</Text>
            <Text fontSize={"3.5rem"}>{cooldownContent.title}</Text>
          </Flex>
        </Flex>
      </Flex>
      {/*<Flex flexDirection={"column"} gap={6} alignItems={"flex-end"}>*/}
      {/*  <FlipButton onClick={toggleFlipView} />*/}
      {/*  <Flex*/}
      {/*    flexDirection={"column"}*/}
      {/*    alignItems={"center"}*/}
      {/*    gap={2}*/}
      {/*    bg={"#06F881"}*/}
      {/*    color={"#000"}*/}
      {/*    fontWeight={"bold"}*/}
      {/*    p={4}*/}
      {/*    roundedTopLeft={"8px"}*/}
      {/*    roundedBottomLeft={"8px"}*/}
      {/*    style={{ transform: "translateX(1.5rem)" }}*/}
      {/*  >*/}
      {/*    <Text fontSize={"2rem"}>{!isLotteryActive ? "Starts in": "Cooldown"}</Text>*/}
      {/*    <Countdown*/}
      {/*      date={!isStartView ? new Date().getTime() + cooldownTimeInSec * 1000 : startDate}*/}
      {/*      renderer={renderer}*/}
      {/*      zeroPadTime={2}*/}
      {/*      onComplete={()=> isStartView && onLotteryStart()}*/}
      {/*    />*/}
      {/*  </Flex>*/}
      {/*</Flex>*/}
    </SaleViewWrapper>
  );
};
const renderer = ({ minutes, seconds, completed }) => {
    return (
      <Flex gap={0} alignItems={'center'} color={"#000"}>
        <Flex
          flexDirection={"column"}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          <Text fontSize={"2rem"} >
            {completed ? "00" : minutes} :
          </Text>
          <Text
            fontSize={"1rem"}
            fontWeight={"normal"}
            alignSelf={"center"}
          >
            M
          </Text>
        </Flex>
        <Flex
          flexDirection={"column"}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          <Text fontSize={"2rem"} >
            {completed ? "00" :seconds}
          </Text>
          <Text
            fontSize={"1rem"}
            fontWeight={"normal"}
            alignSelf={"center"}
          >
            S
          </Text>
        </Flex>
      </Flex>
    );
};
