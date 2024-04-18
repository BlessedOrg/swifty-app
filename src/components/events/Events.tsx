"use client";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { EventsGrid } from "@/components/events/eventGrid/EventsGrid";
import useSWR from "swr";
import { swrFetcher } from "../../requests/requests";
import { useSearchParams } from "next/navigation";
import { HeartCrack } from "lucide-react";
import { EventFilters } from "@/components/events/eventFilters/EventFilters";

export const Events = () => {
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("what");
  const speakerParam = searchParams.get("who");
  const locationParam = searchParams.get("where");
  const dateParams = searchParams.getAll("when");
  const paramsExist =
    !!speakerParam || categoryParam || locationParam || dateParams;

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
    if (locationParam) {
      const prefix = !reqPath?.includes("/?") ? "/?" : "&";
      reqPath = reqPath + `${prefix}where=${locationParam}`;
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

  const { data, isLoading } = useSWR("/api/events" + reqParam, swrFetcher);
  const eventsData = data?.tickets || [];

  return (
    <Flex flexDirection={"column"} gap={4}>
      <EventFilters
        locationParam={locationParam}
        speakerParam={speakerParam}
        categoryParam={categoryParam}
        dateParams={dateParams}
      />

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
    </Flex>
  );
};
