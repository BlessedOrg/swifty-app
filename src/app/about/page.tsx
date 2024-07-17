"use client";
import {Box, Card, Heading, Text, useMediaQuery} from "@chakra-ui/react";
import useSWR from "swr";
import {fetcher} from "../../requests/requests";

export default function AboutPage() {
  const h2Props = {
    fontSize: "1.7rem",
  };
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { data: statsData, isLoading: statsLoading } = useSWR(
      `/api/events/clypj6aut00069id0f8hsm8lw/stats`,
      fetcher,
  );

  return (
    <Box w={"100%"} display={"grid"} placeItems={"center"}>
      <Card
        py={"4rem"}
        px={"20px"}
        mt={{ base: "3rem", lg: "10rem" }}
        display={"flex"}
        maxW={"700px"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        mb={10}
        gap={4}
      >
        <Heading as={"h1"} mb={8}>
          About
        </Heading>
        <Box
          width={"100%"}
          px={isMobile ? "1rem" : "3rem"}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
        >
          <Heading {...h2Props}>Blessed</Heading>
          <Text>
            Blessed is an event ticketing platform that redefines the experience
            with lottery and auction mechanisms for fair ticket access and
            optimal pricing. Our platform features an interactive window, akin
            to embedding Google Maps on a website, allowing organizers to
            integrate the ticketing experience into their community spaces. This
            innovation not only democratizes ticket distribution for fans but
            also enhances revenue and engagement opportunities for organizers in
            a transparent, scalping-resistant environment. With Blessed, ticket
            purchasing becomes a pivotal part of the event narrative, fostering
            a sense of community and anticipation from the moment of purchase.
          </Text>
        </Box>
      </Card>
    </Box>
  );
}
