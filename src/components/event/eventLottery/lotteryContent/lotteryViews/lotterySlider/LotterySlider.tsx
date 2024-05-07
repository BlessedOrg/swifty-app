import { Container, Flex, Text } from "@chakra-ui/react";
import ChakraCarousel from "@/components/slider/ChakraCarousel";
import { LotterySlideCard } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/lotterySlideCard/LotterySlideCard";
import Countdown from "react-countdown";
import { SlideButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/lotterySlideCard/SlideButton";
import { Play } from "lucide-react";
import { FlipButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/FlipButton";
import React from "react";

export const LotterySlider = ({
  eventData,
  toggleFlipView,
}: {
  eventData: IEvent;
  toggleFlipView: () => void;
}) => {
  const categories = [
    {
      id: "ama",
      data: slides[0],
      sliderData: eventData?.sliderSettings?.ama || null,
    },
    {
      id: "video",
      data: slides[1],
      sliderData: eventData?.sliderSettings?.video || null,
    },
    {
      id: "sponsorship",
      data: slides[2],
      sliderData: eventData?.sliderSettings?.sponsorship || null,
    },
    {
      id: "quizzes",
      data: slides[3],
      sliderData: eventData?.sliderSettings?.quizzes || null,
    },
    {
      id: "digitalConfession",
      data: slides[5],
      sliderData: eventData?.sliderSettings?.digitalConfession || null,
    },
  ];
  return (
      <Flex w={'100%'} gap={2}>
        <Flex
            gap={4}
            justifyContent={"center"}
            alignItems={"center"}
            rounded={"24px"}
            w={"100%"}
            h={"452px"}
            overflow={"hidden"}
            position={"relative"}
            zIndex={100000}
        >
          <Container py={0} px={0} m={0} w={"full"} maxW={"none"} h={"100%"}>
            {!!categories.filter((i) => !!i.sliderData)?.length ? (
                <ChakraCarousel gap={32} bottomTools={true}>
                  {categories
                      .filter((i) => !!i.sliderData)
                      .map((item, index) => {
                        return (
                            <LotterySlideCard
                                key={index}
                                {...(item?.data || {})}
                                id={item.id}
                                sliderData={item.sliderData}
                            />
                        );
                      })}
                </ChakraCarousel>
            ) : (
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
                  <Text fontSize={"1.5rem"}>cooldown will end in</Text>
                  <Countdown
                      date={new Date().getTime() + eventData.cooldownTimeSeconds * 1000}
                      renderer={renderer}
                      zeroPadTime={2}
                  >
                    <Completionist />
                  </Countdown>
                </Flex>
            )}
          </Container>
        </Flex>
        <FlipButton onClick={toggleFlipView}/>
      </Flex>
  );
};
const Completionist = () => <span>You are good to go!</span>;
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <Completionist />;
  } else {
    return (
      <Text
        style={{ fontVariantNumeric: "tabular-nums" }}
        fontSize={"3rem"}
        color={"#E7E7E7"}
      >
        {hours} HOUR {minutes} MIN {seconds} SEC
      </Text>
    );
  }
};
const slides = [
  {
    description: "Your chance to ask experts directly and win prizes!",
    heading: "Ask Me Anything Live!",
    buttonLabel: "Submit Your Question",
    image: "/images/cooldownSlider/ama.svg",
  },
  {
    description: "Watch the latest insights and highlights.",
    heading: "Featured\n" + "Video Clips",
    image: "/images/cooldownSlider/camera.svg",
    bgImage: "/images/cooldownSlider/video_bg.png",
    customButton: (props) => {
      return (
        <SlideButton
          rounded={"100%"}
          w={"50px"}
          h={"50px"}
          p={0}
          onClick={props?.toggleView}
        >
          <Play fill={"#fff"} style={{ marginLeft: "5px" }} />
        </SlideButton>
      );
    },
  },
  {
    description: "Watch the latest insights and highlights.",
    heading: "Explore\n" + "Sponsor\n" + "Solutions",
    buttonLabel: "Learn more",
    image: "/images/cooldownSlider/sponsorships.svg",
  },
  {
    description: "Engage with fun and educational quizzes.",
    heading: "Test Your Knowledge!",
    buttonLabel: "Start Quiz",
    image: "/images/cooldownSlider/quizzes.svg",
  },
  {
    description: "Link your socials for exclusive live event access!",
    heading: "Connect & Engage",
    image: "/images/cooldownSlider/heart.svg",
    bgImage: "/images/cooldownSlider/community.png",
    buttonLabel: "Connect",
  },
  {
    description:
      "Too many crypto sins in your life? We got you covered. Get blessed!",
    heading: "Confess Your Crypto Sins!",
    buttonLabel: "Submit Your Sin",
    image: "/images/cooldownSlider/phone.svg",
  },
];