"use client";
import { Button, Flex, Text } from "@chakra-ui/react";
import { EventDetails } from "@/components/event/EventDetails";
import { ImagesInfiniteSlider } from "@/components/event/ImagesInfiniteSlider";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import "react-image-gallery/styles/css/image-gallery.css";
import Image from "next/image";
import { EventAgenda } from "@/components/event/EventAgenda";
import { LimitedWidthWrapper } from "@/components/limitedWidthWrapper/LimitedWidthWrapper";
import Countdown from "react-countdown";
import { InstructionSection } from "@/components/event/instructionSection/InstructionSection";
import { formatPrice } from "@/utilsformatPrice";

export const Event = ({ data }) => {
  const eventData = ((data || null) as IEvent) || null;

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      gap={"2rem"}
      overflow={"hidden"}
      w={"100%"}
    >
      <LimitedWidthWrapper>
        <Flex w={"100%"} justifyContent={"center"}>
          <Image
            src={eventData?.coverUrl || "/images/logo_dark.svg"}
            unoptimized={true}
            className={"image-gallery-image"}
            alt={""}
            width={1024}
            height={1024}
            priority={true}
            style={{
              width: "100%",
              borderRadius: "24px",
              height: "55vh",
              maxHeight: "800px",
              objectFit: "cover",
            }}
          />
        </Flex>
        <Flex
          my={10}
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
          <Button variant={"red"} w={"100%"} mt={"2.5rem"}>
            Enroll
          </Button>
        </Flex>

        <EventDetails {...eventData} />
        <InstructionSection
          price={
            eventData?.priceCents
              ? formatPrice(eventData?.priceCents)
              : "100 USD"
          }
        />
      </LimitedWidthWrapper>

      <ImagesInfiniteSlider />
      <LimitedWidthWrapper my={"6rem"}>
        <EventLottery />
      </LimitedWidthWrapper>

      <EventAgenda />
    </Flex>
  );
};
const renderer = ({ hours, minutes, completed, days }) => {
  if (completed) {
    return "Already live !";
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

// TODO use it late when will be array with images of event

// <ImageGallery
//     items={
//       eventData?.coverUrl
//           ? [
//             {
//               original: eventData.coverUrl,
//               thumbnail: eventData.coverUrl,
//             },
//           ]
//           : []
//     }
//     showFullscreenButton={false}
//     showPlayButton={false}
//     renderItem={(props: {
//       original: string;
//       thumbnail: "string";
//     }) => {
//       return (
//           <Image
//               src={props.original}
//               unoptimized={true}
//               className={"image-gallery-image"}
//               alt={""}
//               width={1024}
//               height={1024}
//               priority={true}
//               style={{
//                 borderRadius: "24px",
//                 height: "55vh",
//                 maxHeight: "800px",
//                 objectFit: "cover",
//               }}
//           />
//       );
//     }}
// />
