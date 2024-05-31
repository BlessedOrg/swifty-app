"use client";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { EventsGrid } from "@/components/events/eventGrid/EventsGrid";
import useSWR from "swr";
import { fetcher } from "../../requests/requests";
import { useSearchParams } from "next/navigation";
import { HeartCrack } from "lucide-react";
import { EventHeader } from "@/components/events/eventHeader/EventHeader";
import Image from "next/image";

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
  const { data: filters, isLoading: filterLoading } = useSWR(
    "/api/events/filterOptions",
      (url)=>fetcher(url, {cache: "no-cache"}),
  );
  const { data, isLoading } = useSWR("/api/events" + reqParam, fetcher);
  const eventsData = data?.tickets || [];

  const params = {
    categoryParam,
    locationParams,
    dateParams,
    speakerParam,
  };
  return (
    <Flex flexDirection={"column"} gap={4}>
      <EventHeader
        filters={filters}
        filterLoading={filterLoading}
        {...params}
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

      <Flex
        bg={"#06F881"}
        justifyContent={"center"}
        pos={"relative"}
        overflow={"hidden"}
        mt={10}
      >
        <Image
          src={"/images/7bars.png"}
          alt={"bars"}
          width={1000}
          height={500}
          style={{
            position: "absolute",
            width: "100%",
            height: "101%",
            objectFit: "cover",
            top: "-3px",
            zIndex: 0,
          }}
        />

        <Flex
          pos={"relative"}
          flexDirection={"column"}
          gap={2}
          alignItems={"center"}
          textAlign={"center"}
          zIndex={2}
          py={"100px"}
        >
          <Text textTransform={"uppercase"} fontWeight={"bold"}>
            Let's go!
          </Text>
          <Text
            fontSize={"4rem"}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            lineHeight={"normal"}
          >
            START buyING tickets <br />
            FOR MODULAR SUMMIT
          </Text>
          <Text fontSize={"1.5rem"}>
            Enroll now to secure your event ticket in four easy steps.
            <br /> Enjoy fair and fun ticket distribution.
          </Text>
          <Button mt={2} variant={"black"} w={"180px"} rounded={"1.5rem"}>
            Enroll
          </Button>{" "}
        </Flex>
      </Flex>
    </Flex>
  );
};
