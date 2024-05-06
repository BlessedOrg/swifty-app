"use client";
import { Flex } from "@chakra-ui/react";
import { EventDetails } from "@/components/event/EventDetails";
import { ImagesInfiniteSlider } from "@/components/event/ImagesInfiniteSlider";
import Image from "next/image";
import { EventAgenda } from "@/components/event/agenda/EventAgenda";
import { LimitedWidthWrapper } from "@/components/limitedWidthWrapper/LimitedWidthWrapper";
import { InstructionSection } from "@/components/event/instructionSection/InstructionSection";
import { formatPrice } from "@/utilsformatPrice";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Speakers } from "@/components/event/speakers/Speakers";
import { StickyLotteryBar } from "@/components/event/stickyLotteryBar/StickyLotteryBar";
import { useState } from "react";

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

  //lottery settings
  const [startDate] = useState(new Date().getTime() + 2000);
  // const startDate = new Date(eventData.startsAt)

  const [activePhase, setActivePhase] = useState<IPhaseState | null>(null);
  const [phasesState, setPhasesState] = useState<IPhaseState[] | null>(null);
  // hardcoded phase for tests
  // const [activePhase] = useState<IPhaseState | null>({
  //   idx: 2,
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
  const lotterySettings = {
    updateActivePhase,
    updatePhaseState,
    startDate,
    activePhase,
    phasesState,
  };

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

      <StickyLotteryBar eventData={eventData} {...lotterySettings} />
    </Flex>
  );
};
