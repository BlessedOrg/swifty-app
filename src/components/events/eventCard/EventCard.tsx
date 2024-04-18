"use client";
import { periodDate } from "@/utilsperiodDate";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Heart } from "lucide-react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

export const EventCard = ({
  title,
  coverUrl,
  eventLocation,
  startsAt,
  finishAt,
  price,
  type,
  id,
}: IEvent) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const datePeriod = periodDate({ from: startsAt, to: finishAt });
  const eventInfo = [
    eventLocation.locationDetails,
    eventLocation.country,
    datePeriod,
  ];

  const [cardWidth, setCardWidth] = useState<any>(0);

  const images = [coverUrl];
  useLayoutEffect(() => {
    setCardWidth(containerRef?.current?.offsetWidth);
  }, []);
  useEffect(() => {
    function handleWindowResize() {
      setCardWidth(containerRef?.current?.clientWidth);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const sliderSettings = {
    showArrows: true,
    dynamicHeight: false,
    stopOnHover: false,
    infiniteLoop: true,
    showStatus: false,
    transitionTime: 200,
    showThumbs: false,
    showIndicators: true,
    swipeable: false,
    emulateTouch: true,
    autoPlay: false,
    width: cardWidth || 324,
  };

  const onLikeToggle = () => {
    setIsLiked((prev) => !prev);
  };
  return (
    <Flex
      w={"100%"}
      flexDirection={"column"}
      gap={"1rem"}
      fontFamily={"Poppins"}
      pos={"relative"}
      overflow={"hidden"}
      ref={containerRef}
    >
      <Flex
        width={"100%"}
        maxW={"324px"}
        h={"328px"}
        rounded={"12px"}
        overflow={"hidden"}
      >
        {!!containerRef?.current?.clientWidth && images.length <= 1 ? (
          <Image
            src={images[0] || "/images/logo_dark.svg"}
            alt={`${title} image`}
            width={400}
            height={400}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        ) : (
          <Carousel {...sliderSettings}>
            {images.map((i: string, idx: number) => (
              <Flex
                width={"100%"}
                maxW={"324px"}
                h={"328px"}
                key={idx}
                cursor={"grab"}
              >
                <Link href={`/event/${id}`}>
                  <Image
                    src={images[idx]}
                    alt={`${title} image`}
                    width={400}
                    height={400}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </Flex>
            ))}
          </Carousel>
        )}
        {/*{!!badge && (*/}
        {/*  <Flex*/}
        {/*    pos={"absolute"}*/}
        {/*    top={"1rem"}*/}
        {/*    left={"1rem"}*/}
        {/*    fontSize={"14px"}*/}
        {/*    fontWeight={"bold"}*/}
        {/*    px={"10px"}*/}
        {/*    py={"4px"}*/}
        {/*    rounded={"4px"}*/}
        {/*    bg={"#fff"}*/}
        {/*    color={"#000"}*/}
        {/*  >*/}
        {/*    {badge}*/}
        {/*  </Flex>*/}
        {/*)}*/}

        <Flex
          pos={"absolute"}
          top={"1rem"}
          right={"1rem"}
          zIndex={1}
          cursor={"pointer"}
          onClick={onLikeToggle}
        >
          <Heart color={"#fff"} fill={isLiked ? "#fff" : "#2222224D"} />
        </Flex>
      </Flex>
      <Link href={`/event/${id}`}>
        <Flex flexDirection={"column"} gap={"4px"}>
          <Text fontWeight={"500"} fontSize={"20px"}>
            {title}
          </Text>
          {eventInfo.map((i, idx) => (
            <Text key={idx} color={"#5E5E5E"}>
              {i}
            </Text>
          ))}
          {type === "free" ? (
            <Text
              fontWeight={"700"}
              mt={"4px"}
              fontSize={"14px"}
              py={1}
              px={4}
              textAlign={"center"}
              bg={"#36ab6d"}
              color={"#fff"}
              rounded={"7px"}
              letterSpacing={"2px"}
              w={"fit-content"}
            >
              FREE
            </Text>
          ) : (
            <Text fontWeight={"700"} mt={"4px"} fontSize={"14px"}>
              Starting from ${price}
            </Text>
          )}
        </Flex>
      </Link>
    </Flex>
  );
};
