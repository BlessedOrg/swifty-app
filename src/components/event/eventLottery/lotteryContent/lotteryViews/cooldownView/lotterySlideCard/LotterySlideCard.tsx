import { AmaSlideAction } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/slidesActionViews/AmaSlideAction";
import React, { ReactNode, useState } from "react";
import FlippableCard from "@/components/flipCard/FlippableCard";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { SlideButton } from "./SlideButton";
import { VideoActionView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/slidesActionViews/VideoActionView";
import { SponsorshipActionView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/slidesActionViews/SponsorshipActionView";
import { QuizActionView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/slidesActionViews/QuizActionView";
import { SinActionView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/slidesActionViews/SinActionView";

const actionViewPerId = {
  ama: ({ toggleView }) => <AmaSlideAction toggleView={toggleView} />,
  video: ({ toggleView, sliderData }) => (
    <VideoActionView toggleView={toggleView} sliderData={sliderData} />
  ),
  sponsorship: ({ toggleView, sliderData }) => (
    <SponsorshipActionView toggleView={toggleView} sliderData={sliderData} />
  ),
  quizzes: ({ toggleView, sliderData }) => (
    <QuizActionView toggleView={toggleView} sliderData={sliderData} />
  ),
  digitalConfession: ({ toggleView }) => (
    <SinActionView toggleView={toggleView} />
  ),
};
export const LotterySlideCard = ({
  description,
  heading,
  buttonLabel,
  image,
  customButton,
  bgImage,
  id,
  sliderData,
}: {
  description: string;
  heading: string;
  buttonLabel?: any;
  image: string;
  customButton?: any;
  bgImage?: string;
  id: string;
  sliderData?: any;
}) => {
  const [showFront, setShowFront] = useState(true);

  const ActionCard = actionViewPerId?.[id] || <></>;
  const toggleView = () => setShowFront((prev) => !prev);

  const CustomButton = customButton && customButton({ toggleView });

  return (
    <FlippableCard
      flexDirection={"column"}
      gap={4}
      overflow="hidden"
      color="#000"
      rounded={"12px"}
      w={"100%"}
      h={"100%"}
      border={"2px solid"}
      pos={"relative"}
      p={0}
      front={
        <Flex
          flexDirection={"column"}
          gap={4}
          color="#000"
          w={"full"}
          h={"100%"}
          pos={"relative"}
          px={"2rem"}
          py={"1.5rem"}
        >
          {!!bgImage && (
            <Image
              src={bgImage}
              width={500}
              height={500}
              alt={""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -1,
              }}
            />
          )}
          <Flex justifyContent={"space-between"} alignItems={"center"} gap={4}>
            <Text fontWeight={"bold"} fontSize={"20px"}>
              {description}
            </Text>
            {customButton ? (
              CustomButton
            ) : (
              <SlideButton onClick={toggleView}>{buttonLabel}</SlideButton>
            )}
          </Flex>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Image
              src={image}
              alt={""}
              width={550}
              height={550}
              style={{
                width: "auto",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
            <Text
              display={"flex"}
              alignItems={"end"}
              w={"fit-content"}
              fontWeight={"bold"}
              fontSize={"3rem"}
              lineHeight={'3rem'}
              textAlign={"right"}
              h={"100%"}
            >
              {heading}
            </Text>
          </Flex>
        </Flex>
      }
      back={<ActionCard toggleView={toggleView} sliderData={sliderData} />}
      showFront={showFront}
    />
  );
};
