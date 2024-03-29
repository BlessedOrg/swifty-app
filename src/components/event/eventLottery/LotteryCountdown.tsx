"use client";
import { Flex, Text } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { useEffect, useState } from "react";

export const LotteryCountdown = ({ startDate, onLotteryStart }) => {
  const [isDOM, setIsDom] = useState(false);

  useEffect(() => {
    setIsDom(true);
  }, []);
  return (
    <Flex
      w={"100%"}
      h={"100%"}
      bg={
        "linear-gradient(163deg, rgba(153,119,212,1) 0%, rgba(99,55,174,1) 100%)"
      }
      rounded={"8px"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
    >
      <Text fontSize={"1.5rem"}>sale starts in</Text>
      {isDOM && (
        <Countdown
          date={startDate}
          renderer={renderer}
          onComplete={onLotteryStart}
        >
          <Completionist />
        </Countdown>
      )}
    </Flex>
  );
};
const Completionist = () => <span>You are good to go!</span>;
const renderer = ({ hours, minutes, seconds, completed, days }) => {
  if (completed) {
    return <Completionist />;
  } else {
    return (
      <Text
        style={{ fontVariantNumeric: "tabular-nums" }}
        fontSize={"3rem"}
        color={"#E7E7E7"}
      >
        {days} DAY {hours} HOUR {minutes} MIN {seconds} SEC
      </Text>
    );
  }
};
