"use client";
import { periodDate } from "@/utils/periodDate";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Heart } from "lucide-react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

interface IProps extends IEvent {
  editingView?: boolean;
}

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
  editingView,
}: IProps) => {
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

        {!editingView ? (
          <Flex
            pos={"absolute"}
            top={"1rem"}
            right={"1rem"}
            zIndex={1}
            cursor={"pointer"}
            onClick={onLikeToggle}
            style={{
              rotate: "90deg"
            }}
          >
            <Heart color={"#fff"} fill={isLiked ? "#06F881" : "transparent"} />
          </Flex>
        ) : (
          <Flex
            pos={"absolute"}
            top={"1rem"}
            left={"50%"}
            style={{
              transform: "translateX(-50%)",
            }}
            zIndex={1}
            cursor={"pointer"}
            onClick={onLikeToggle}
            bg={"#fff"}
            rounded={"10px"}
            _hover={{
              bg: "#eee",
            }}
            transition={"all 150ms"}
          >
            <Flex
              as={Link}
              href={`/event/${id}/edit`}
              color={"#494949"}
              py={2}
              px={4}
              fontWeight={"bold"}
            >
              Edit event
            </Flex>
          </Flex>
        )}
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
          <Text
              fontWeight={"700"}
              mt={"4px"}
              fontSize={"14px"}
              py={1}
              px={2}
              bg={"#06F881"}
              color={"#000"}
              w={"100%"}
          >
            {type === "free" ? "FREE" : `From ${formatPrice(priceCents)}$`}
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
};
