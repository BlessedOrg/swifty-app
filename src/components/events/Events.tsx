"use client";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { EventsGrid } from "@/components/events/eventGrid/EventsGrid";
import useSWR from "swr";
import { fetcher } from "../../requests/requests";
import { useSearchParams } from "next/navigation";
import { HeartCrack } from "lucide-react";
import { EventFilters } from "@/components/events/eventFilters/EventFilters";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import { HowItWorksModal } from "@/components/modals/HowItWorksModal";

export const Events = () => {
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("what");
  const speakerParam = searchParams.get("who");
  const locationParams = searchParams.getAll("where");
  const dateParams = searchParams.getAll("when");
  const paramsExist =
    !!speakerParam ||
    categoryParam ||
    !!locationParams?.length ||
    !!dateParams?.length;

  const createRequestPath = () => {
    let reqPath = "";

    if (speakerParam) {
      const prefix = !reqPath?.includes("/?") ? "/?" : "&";
      reqPath = reqPath + `${prefix}who=${speakerParam}`;
    }
    if (categoryParam) {
      const prefix = !reqPath?.includes("/?") ? "/?" : "&";
      reqPath = reqPath + `${prefix}what=${categoryParam}`;
    }
    if (locationParams?.length) {
      const prefix = !reqPath?.includes("/?") ? "/?" : "&";

      if (locationParams?.length > 1) {
        reqPath = reqPath + `${prefix}where=${locationParams[0]}`;

        for (let i = 1; i < locationParams.length; i++) {
          reqPath = reqPath + `&where=${locationParams[i]}`;
        }
      } else {
        reqPath = reqPath + `${prefix}where=${locationParams[0]}`;
      }
    }
    if (!!dateParams?.length) {
      const prefix = !reqPath?.includes("/?") ? "/?" : "&";
      if (
        dateParams?.length > 1 &&
        Boolean(
          dateParams?.[0] !== new Date().toISOString().slice(0, 10) ||
            dateParams?.[1] !== new Date().toISOString().slice(0, 10),
        )
      ) {
        reqPath =
          reqPath + `${prefix}when=${dateParams[0]}&when=${dateParams[1]}`;
      } else {
        reqPath = reqPath + `${prefix}when=${dateParams[0]}`;
      }
    }

    return reqPath;
  };

  const reqParam = paramsExist ? createRequestPath() : "";

  const { data, isLoading } = useSWR("/api/events" + reqParam, fetcher);
  const eventsData = data?.tickets || [];
  const { data: filters, isLoading: filterLoading } = useSWR(
    "/api/events/filterOptions",
    fetcher,
  );

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 5; // próg przewinięcia w pikselach
      const scrollY = window.scrollY;
      const pageHeight = document.body.clientHeight - (isScrolled ? 300 : 0);

      if (scrollY >= scrollThreshold && !isScrolled) {
        setIsScrolled(true);
      } else if (scrollY < scrollThreshold && isScrolled) {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);
  return (
    <Flex flexDirection={"column"} gap={4}>
      <Flex h={isScrolled ? "0" : "165px"} transition={"all 450ms"}>
        <Flex
          flexDirection={"column"}
          gap={1}
          alignItems={"center"}
          pos={"fixed"}
          top={isScrolled ? "60px" : "200px"}
          left={"50%"}
          style={{ transform: "translate(-50%, -50%)" }}
          zIndex={101}
          transition={"all 250ms"}
          // bg={"#fff"}
        >
          {!isScrolled && (
            <Flex minH={"75px"}>
              {!filterLoading && (
                <TypeAnimation
                  sequence={[
                    "Attend what you love!",
                    1000,
                    "Go where you love!",
                    1000,
                    "Visit when you love!",
                    1000,
                    "See who you love!",
                    1000,
                  ]}
                  wrapper={"span"}
                  speed={50}
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    display: "inline-block",
                    fontVariantNumeric: "tabular-nums",
                  }}
                  repeat={Infinity}
                />
              )}
            </Flex>
          )}
          <EventFilters
            locationParam={locationParams}
            speakerParam={speakerParam}
            categoryParam={categoryParam}
            dateParams={dateParams}
            filters={filters}
            filterLoading={filterLoading}
            isSmallView={isScrolled}
          />
        </Flex>
      </Flex>

      {isLoading && (
        <Flex w={"100%"} justifyContent={"center"}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      )}
      {!eventsData?.length && !isLoading && (
        <Flex
          my={6}
          justifyContent={"center"}
          textAlign={"center"}
          gap={2}
          alignItems={"center"}
          color={"#afaaaa"}
          fontSize={"1.2rem"}
        >
          <Text fontWeight={"bold"}>No results</Text>
          <HeartCrack />
        </Flex>
      )}
      <EventsGrid events={eventsData} />
      <HowItWorksModal isOpen={true} onClose={() => {}} />
    </Flex>
  );
};
