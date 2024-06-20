import { Flex, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/next-js";
import NextImage from "next/image";
import React from "react";
import { SaleViewWrapper } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/SaleViewWrapper";

interface IProps {
  toggleFlipView: () => void;
  isLotteryActive: boolean;
  activePhase: any;
  cooldownTimeInSec: number;
  startDate?: any;
  onLotteryStart?: any;
  isStartView?: boolean;
  currentTabId: string;
}

export const CooldownCard = ({
  toggleFlipView,
  isLotteryActive,
  activePhase,
  currentTabId,
}: IProps) => {
  const contentPerPhase = {
    0: {
      title: "Lottery I",
      description:
        "Deposit now and secure your chance to get event tickets. We have four simple steps adding decentralized tech and on-chain randomness ensuring fair and fun distribution .",
      image: "/images/cooldownSlider/cooldown0.svg",
    },
    1: {
      title: "Lottery II",
      description:
        "Maximize your chances of securing the best ticket deals for the event by generating additional lucky numbers. Each on-chain random number generation costs only 1 USDC",
      image: "/images/cooldownSlider/cooldown1.svg",
    },
    2: {
      title: "Auction I",
      description:
        "Bid and reach the strike price. If there is higher demand than ticket randomness brings fair distribution.",
      image: "/images/cooldownSlider/cooldown2.svg",
    },
    3: {
      title: "Auction II",
      description:
        "Bid to be within the league of chads who still need a ticket. If you are within the leaderboard at the end of the phase your get to mint the ticket. Place your bid wisely. ",
      image: "/images/cooldownSlider/cooldown3.svg",
    },
  };

  const cooldownContent = contentPerPhase[activePhase?.idx || 0];
  return (
    <SaleViewWrapper
      withBorder={false}
      saleData={null}
      toggleFlipView={toggleFlipView}
      id={currentTabId}
    >
      <Flex
        flexDirection={{ base: "column-reverse", iwMid: "column" }}
        gap={2}
        color="#000"
        w={"100%"}
        px={{ base: "0.5rem", iwMid: "2rem" }}
        py={{ base: "0.5rem", iwMid: "1.5rem" }}
        border={"2px solid"}
        rounded={"12px"}
        borderColor={"#6157FF"}
        overflow={"hidden"}
        position={"relative"}
        bg={"rgba(135, 206, 235, 1)"}
        maxW={"666px"}
        h={{ base: "auto", iwMid: "452px" }}
        justifyContent={"space-between"}
      >
        <Flex justifyContent={"space-between"} alignItems={"center"} gap={4}>
          <Text
            fontWeight={"bold"}
            fontSize={{ base: "0.85rem", iwMid: "20px" }}
          >
            {cooldownContent.description}
          </Text>
        </Flex>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          flexDirection={{ base: "column-reverse", iwMid: "row" }}
          gap={2}
        >
          <Image
            as={NextImage}
            src={cooldownContent.image}
            alt={""}
            width={550}
            height={550}
            maxH={{ base: "100px", iwMid: "80%" }}
            w={"auto"}
            h={"80%"}
            style={{
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />

          <Flex
            flexDirection={"column"}
            gap={0}
            textTransform={"uppercase"}
            textAlign={"right"}
            fontWeight={"bold"}
            lineHeight={"normal"}
            alignSelf={"flex-end"}
          >
            <Text
              fontSize={{
                base: "0.8rem",
                iwMid: "1rem",
              }}
            >
              {isLotteryActive ? "Next phase" : "Start phase"}
            </Text>
            <Text fontSize={{ base: "1.2rem", iwMid: "3.5rem" }}>
              {cooldownContent.title}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </SaleViewWrapper>
  );
};
