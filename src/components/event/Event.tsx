"use client";
import { Flex, Text } from "@chakra-ui/react";
import { EventDetails } from "@/components/event/EventDetails";
import { ImagesInfiniteSlider } from "@/components/event/sponsors/ImagesInfiniteSlider";
import Image from "next/image";
import { LimitedWidthWrapper } from "@/components/limitedWidthWrapper/LimitedWidthWrapper";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Speakers } from "@/components/event/speakers/Speakers";
import { InteractiveWindow } from "@/components/event/interactiveWindow/InteractiveWindow";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { periodDate } from "@/utils/periodDate";
import { ModularSummitVideos } from "@/components/event/ModularSummit2023";
import useSWR from "swr";
import { fetcher } from "../../requests/requests";
import { LoadingDots } from "@/components/ui/LoadingDots";

export const Event = ({ id }) => {
  const { data, isLoading } = useSWR(`/api/events/${id}`, fetcher);
  const eventData = data?.event || null;
  // const eventData = ((data || null) as IEvent) || null;
  const imagesGallery = eventData?.imagesGallery;
  const coverUrl = eventData?.coverUrl;
  const coverImage = coverUrl || "/images/logo_dark.svg";
  const formattedImagesGallery = !!imagesGallery?.length
    ? [
        { original: coverImage, thumbnail: coverImage },
        ...imagesGallery.map((i) => ({ original: i, thumbnail: i })),
      ]
    : [];

  const startDate = new Date(eventData?.saleStart).getTime() || new Date();

  const [activePhase, setActivePhase] = useState<IPhaseState | null>(null);
  const [phasesState, setPhasesState] = useState<IPhaseState[] | null>(null);

  const updateActivePhase = (activePhase) => setActivePhase(activePhase);
  const updatePhaseState = (state) => setPhasesState(state);

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

  if (isLoading) {
    <LoadingDots />
  }

  if (!eventData) {
    return (
      <Text fontSize={"2.5rem"} color={"#afaaaa"} fontWeight={"bold"} mt={10}>
        Event not found.
      </Text>
    )
  }

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      gap={"2rem"}
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
        gap={"5rem"}
        overflow={"hidden"}
        maxWidth={"100%"}
        w={"100%"}
      >
        <Flex flexDirection={"column"} gap={0} alignItems={"center"}>
          <Text textTransform={"uppercase"} fontWeight={"bold"}>
            moly
          </Text>
          <Text
            fontWeight={"bold"}
            fontSize={{ base: "2rem", xl: "3rem" }}
            textTransform={"uppercase"}
            textAlign={"center"}
          >
            Sponsors & partners
          </Text>
          <Text>Thanks to these great minds</Text>
        </Flex>

        <ImagesInfiniteSlider />
      </Flex>

      <ModularSummitVideos />

      {isActive && isWindowExpanded && (
        <Flex
          bg={"#6AFBB3"}
          pos={"fixed"}
          w={"100%"}
          h={"100%"}
          top={0}
          left={0}
          zIndex={110}
          onClick={toggleWindowExpanded}
        ></Flex>
      )}
      {isCooldown && isWindowExpanded && (
        <Flex
          bg={"rgba(135, 206, 235, 1)"}
          pos={"fixed"}
          w={"100%"}
          h={"100%"}
          top={0}
          left={0}
          zIndex={110}
          onClick={toggleWindowExpanded}
        ></Flex>
      )}
      {!isCooldown && !isActive && isWindowExpanded && (
        <Flex
          bg={"rgba(42, 40, 40, 0.92)"}
          pos={"fixed"}
          w={"100%"}
          h={"100%"}
          top={0}
          left={0}
          zIndex={110}
          onClick={toggleWindowExpanded}
        ></Flex>
      )}

      <InteractiveWindow eventData={eventData} {...lotterySettings} />
    </Flex>
  );
};
