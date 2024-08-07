"use client";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { EventsGrid } from "@/components/events/eventGrid/EventsGrid";
import useSWR from "swr";
import { fetcher } from "../../requests/requests";
import { useSearchParams } from "next/navigation";
import { HeartCrack } from "lucide-react";
import Image from "next/image";
import { LoginButton } from "../navigation/LoginButton";
import { useUserContext } from "@/store/UserContext";
import {EventHeader} from "@/components/events/eventHeader/EventHeader";

export const Events = () => {
  const { isLoggedIn } = useUserContext();
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
    (url) => fetcher(url, { cache: "no-cache" }),
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
      {/*<Flex*/}
      {/*  gap={1}*/}
      {/*  alignItems={"center"}*/}
      {/*  justifyContent={"center"}*/}
      {/*  transition={"all 250ms"}*/}
      {/*  w={"100%"}*/}
      {/*  textAlign={"center"}*/}
      {/*>*/}
      {/*  <TypeAnimation*/}
      {/*    sequence={[*/}
      {/*      "Attend what you love!",*/}
      {/*      1000,*/}

      {/*      "Go where you love!",*/}
      {/*      1000,*/}

      {/*      "Visit when you love!",*/}
      {/*      1000,*/}

      {/*      "See who you love!",*/}
      {/*      1000,*/}
      {/*    ]}*/}
      {/*    wrapper={"span"}*/}
      {/*    speed={50}*/}
      {/*    style={{*/}
      {/*      fontSize: "8vw",*/}
      {/*      fontWeight: "bold",*/}
      {/*      display: "inline-block",*/}
      {/*      fontVariantNumeric: "tabular-nums",*/}
      {/*      color: "#06F881",*/}
      {/*      textTransform: "uppercase",*/}
      {/*      width: "100%",*/}
      {/*      fontFamily: "TT Bluescreens",*/}
      {/*    }}*/}
      {/*    repeat={Infinity}*/}
      {/*  />*/}
      {/*</Flex>*/}
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
            objectFit: "fill",
            top: "-3px",
            zIndex: 0,
          }}
        />
        <Flex pos={'absolute'} w={"99%"} h={"99%"} bg={"#06F881"} zIndex={-1}/>
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
            fontSize={"6rem"}
            textTransform={"uppercase"}
            lineHeight={"normal"}
            fontFamily={'TT Bluescreens'}
          >
            START BUYING <br />
            TICKETS NOW
          </Text>
          <Text fontSize={"1.5rem"}>
            Sign in now to secure your event ticket in four easy steps.
            <br /> Enjoy fair and fun ticket distribution.
          </Text>
          {!isLoggedIn && <LoginButton />}
        </Flex>
      </Flex>
    </Flex>
  );
};
