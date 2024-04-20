"use client";
import { Flex, Text } from "@chakra-ui/react";
import { EventDetails } from "@/components/event/EventDetails";
import { ImagesInfiniteSlider } from "@/components/event/ImagesInfiniteSlider";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Image from "next/image";

export const Event = ({ data }) => {
  const eventData = ((data || null) as IEvent) || null;
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      gap={"2rem"}
      maxW={"1210px"}
      overflow={"hidden"}
    >
      <Flex w={"100%"} justifyContent={"center"}>
        <ImageGallery
          items={
            eventData?.coverUrl
              ? [
                {
                  original: eventData.coverUrl,
                  thumbnail: eventData.coverUrl,
                },
              ]
              : []
          }
          showFullscreenButton={false}
          showPlayButton={false}
          renderItem={(props: { original: string; thumbnail: "string" }) => {
            return (
              <Image
                src={props.original}
                unoptimized={true}
                className={"image-gallery-image"}
                alt={""}
                width={1024}
                height={1024}
                priority={true}
                style={{
                  borderRadius: "24px",
                  height: "55vh",
                  maxHeight: "800px",
                  objectFit: "cover",
                }}
              />
            );
          }}
        />
      </Flex>
      <Flex
        bg={"rgba(151, 71, 255, 0.10)"}
        rounded={"24px"}
        p={"1rem"}
        justifyContent={"center"}
        textAlign={"center"}
        fontSize={{ base: "1rem", md: "22px" }}
        gap={"1.5rem"}
        w={"100%"}
      >
        <Text color={"#9747FF"} fontWeight={"700"}>
          2 DAY 6 HOUR 13 MIN
        </Text>
        <Text color={"#7E7D7D"} fontWeight={"700"}>
          to start
        </Text>
      </Flex>

      <EventDetails {...eventData} />
      <ImagesInfiniteSlider />
      <EventLottery />
    </Flex>
  );
};
