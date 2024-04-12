import { Container, Flex } from "@chakra-ui/react";
import ChakraCarousel from "@/components/slider/ChakraCarousel";
import { Play } from "lucide-react";
import { LotterySlideCard } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/lotterySlideCard/LotterySlideCard";
import { SlideButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/lotterySlideCard/SlideButton";

export const LotteryCooldownView = () => {
  return (
    <Flex
      gap={4}
      justifyContent={"center"}
      alignItems={"center"}
      rounded={"24px"}
      w={"100%"}
      h={"452px"}
      maxW={"768px"}
      overflow={"hidden"}
      position={"relative"}
      zIndex={100000}
    >
      <Container py={0} px={0} m={0} w={"full"} maxW={"none"} h={"100%"}>
        <ChakraCarousel gap={32} bottomTools={true}>
          {slides.map((item, index) => (
            <LotterySlideCard key={index} {...item} id={index} />
          ))}
        </ChakraCarousel>
      </Container>
    </Flex>
  );
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
