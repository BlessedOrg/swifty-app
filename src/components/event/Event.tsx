"use client";
import { Flex } from "@chakra-ui/react";
import { EventDetails } from "@/components/event/EventDetails";
import { ImagesInfiniteSlider } from "@/components/event/ImagesInfiniteSlider";
import Image from "next/image";
import { EventAgenda } from "@/components/event/agenda/EventAgenda";
import { LimitedWidthWrapper } from "@/components/limitedWidthWrapper/LimitedWidthWrapper";
import { InstructionSection } from "@/components/event/instructionSection/InstructionSection";
import { formatPrice } from "@/utils/formatPrice";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Speakers } from "@/components/event/speakers/Speakers";
import { StickyLotteryBar } from "@/components/event/stickyLotteryBar/StickyLotteryBar";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";

export const Event = ({ data }) => {
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
  const [startDate] = useState(new Date().getTime());
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
        <Flex w={"100%"} justifyContent={"center"}>
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

      <Speakers speakers={eventData?.speakers || []} />

      <EventAgenda />

      {isActive && isWindowExpanded &&
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
      }
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
      <StickyLotteryBar eventData={eventData} {...lotterySettings} />
    </Flex>
  );
};
