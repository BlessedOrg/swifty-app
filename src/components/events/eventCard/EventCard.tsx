"use client";
import { periodDate } from "@/utilsperiodDate";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Heart } from "lucide-react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/utilsformatPrice";

export const EventCard = ({
  title,
  coverUrl,
  eventLocation,
  startsAt,
  finishAt,
  priceCents,
  type,
  id,
  imagesGallery,
}: IEvent) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const datePeriod = periodDate({ from: startsAt, to: finishAt });
  const eventInfo = [
    eventLocation.locationDetails,
    eventLocation.country,
    datePeriod,
  ];
  const coverImage = coverUrl || "/images/logo_dark.svg";
  const [cardWidth, setCardWidth] = useState<any>(0);

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

  const formattedImageGallery = !!imagesGallery?.length
    ? [coverImage, ...imagesGallery]
    : [];

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
        pos={"relative"}
      >
        {!!containerRef?.current?.clientWidth ? (
          !imagesGallery?.length ? (
            <Link href={`/event/${id}`} style={{ width: "100%" }}>
              <Image
                src={coverImage}
                alt={`${title} image`}
                width={400}
                height={400}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Link>
          ) : (
            <Carousel {...sliderSettings}>
              {formattedImageGallery.map((i: string, idx: number) => (
                <Flex
                  width={"100%"}
                  maxW={"324px"}
                  h={"328px"}
                  key={idx}
                  cursor={"grab"}
                >
                  <Link href={`/event/${id}`} style={{ width: "100%" }}>
                    <Image
                      src={i}
                      alt={`${title} image`}
                      width={400}
                      height={400}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                </Flex>
              ))}
            </Carousel>
          )
        ) : null}

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
              Starting from ${formatPrice(priceCents)}
            </Text>
          )}
        </Flex>
      </Link>
    </Flex>
  );
};
