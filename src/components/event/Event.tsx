"use client";
import { Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { EventDetails } from "@/components/event/EventDetails";
import { ImagesInfiniteSlider } from "@/components/event/sponsors/ImagesInfiniteSlider";
import Image from "next/image";
import { EventAgenda } from "@/components/event/agenda/EventAgenda";
import { LimitedWidthWrapper } from "@/components/limitedWidthWrapper/LimitedWidthWrapper";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Speakers } from "@/components/event/speakers/Speakers";
import { StickyLotteryBar } from "@/components/event/stickyLotteryBar/StickyLotteryBar";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { periodDate } from "@/utils/periodDate";

export const Event = ({ data }) => {
  const [saleViewMobile] = useMediaQuery("(max-width: 1180px)");

  const eventData = ((data || null) as IEvent) || null;
  const { imagesGallery, coverUrl } = eventData;
  const coverImage = coverUrl || "/images/logo_dark.svg";
  const formattedImagesGallery = !!imagesGallery?.length
    ? [
        { original: coverImage, thumbnail: coverImage },
        ...imagesGallery.map((i) => ({ original: i, thumbnail: i })),
      ]
    : [];

  //sales settings
  const [startDate] = useState(new Date().getTime()+8000);
  // const startDate = new Date(eventData.startsAt)

  const [activePhase, setActivePhase] = useState<IPhaseState | null>(null);
  const [phasesState, setPhasesState] = useState<IPhaseState[] | null>(null);
  // hardcoded phase for tests
  // const [activePhase] = useState<IPhaseState | null>({
  //   idx: 0,
  //   phaseState: { isActive: true, isFinished: false, isCooldown: false },
  //   title: "TEST MODE",
  //   timestamp: 123,
  // });
  // const setActivePhase = () => {};

  const updateActivePhase = (activePhase) => {
    setActivePhase(activePhase);
  };
  const updatePhaseState = (state) => {
    setPhasesState(state);
  };
  const { id } = eventData;
  const isEnrolled = getCookie(`${id}-enroll`);
  const [isWindowExpanded, setIsWindowExpanded] = useState(false);

  const toggleWindowExpanded = () => {
    if (!isEnrolled) {
      setCookie(`${id}-enroll`, true);
    }
    setIsWindowExpanded((prev) => !prev);
  };
  const lotterySettings = {
    updateActivePhase,
    updatePhaseState,
    startDate,
    activePhase,
    phasesState,
    isWindowExpanded,
    isEnrolled,
    toggleWindowExpanded,
    setIsWindowExpanded,
  };

  const isCooldown = !!activePhase?.phaseState.isCooldown;
  const isActive = !!activePhase?.phaseState.isActive;

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      gap={"2rem"}
      overflow={"hidden"}
      w={"100%"}
    >
      <LimitedWidthWrapper>
        <Flex w={"100%"} justifyContent={"center"} pos={"relative"} zIndex={1}>
          {!imagesGallery?.length ? (
            <Image
              src={coverImage}
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
          ) : (
            <ImageGallery
              items={formattedImagesGallery}
              showFullscreenButton={false}
              showPlayButton={false}
              renderItem={(props: {
                original: string;
                thumbnail: "string";
              }) => {
                return (
                  <Image
                    src={props.original}
                    unoptimized={true}
                    className={"image-gallery-image"}
                    alt={""}
                    width={1400}
                    height={1400}
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
          )}
          <Flex
            pos={"absolute"}
            top={"20%"}
            left={"50%"}
            style={{ transform: "translate(-50%, -50%)" }}
            textAlign={"center"}
            flexDirection={"column"}
            fontWeight={"bold"}
            w={"100%"}
          >
            <Text
              textShadow={"0 0 10px black"}
              as={"h1"}
              fontSize={{ base: "3rem", xl: "5rem" }}
              color={"#06F881"}
              textTransform={"uppercase"}
            >
              {eventData?.title}
            </Text>
            <Text
              textShadow={"0 0 20px black"}
              fontSize={{ base: "1.5rem", xl: "3rem" }}
              color={"#fff"}
            >
              {periodDate({
                from: eventData?.startsAt,
                to: eventData?.finishAt,
              })}
            </Text>
          </Flex>
        </Flex>

        <EventDetails {...eventData} />

        <Speakers speakers={eventData?.speakers || []} />
      </LimitedWidthWrapper>

      <Flex
        my={"10%"}
        mb={10}
        flexDirection={"column"}
        backgroundImage={"/images/7bars_yellow.png"}
        backgroundRepeat={"no-repeat"}
        backgroundPosition={"center"}
        gap={"10rem"}
      >
        <Flex flexDirection={"column"} gap={0} alignItems={"center"}>
          <Text textTransform={"uppercase"} fontWeight={"bold"}>
            moly
          </Text>
          <Text
            fontWeight={"bold"}
            fontSize={"3rem"}
            textTransform={"uppercase"}
          >
            Sponsors & partners
          </Text>
          <Text>Thanks to these great minds</Text>
        </Flex>

        <ImagesInfiniteSlider />
      </Flex>

      <EventAgenda />

      {isActive && isWindowExpanded && (
        <Flex
          bg={"rgba(6, 248, 129, 0.6)"}
          pos={"fixed"}
          w={"100%"}
          h={"100%"}
          top={0}
          left={0}
          zIndex={6}
          onClick={toggleWindowExpanded}
        ></Flex>
      )}
      {isCooldown && isWindowExpanded && (
        <Flex
          bg={"rgba(135, 206, 235, 0.6)"}
          pos={"fixed"}
          w={"100%"}
          h={"100%"}
          top={0}
          left={0}
          zIndex={6}
          onClick={toggleWindowExpanded}
        ></Flex>
      )}
      {!phasesState?.some((i) => !i.phaseState.isFinished) &&
        isWindowExpanded && (
          <Flex
            bg={"rgba(0, 0, 0, 0.6)"}
            pos={"fixed"}
            w={"100%"}
            h={"100%"}
            top={0}
            left={0}
            zIndex={6}
            onClick={toggleWindowExpanded}
          ></Flex>
        )}

      <StickyLotteryBar eventData={eventData} {...lotterySettings} />
    </Flex>
  );
};
