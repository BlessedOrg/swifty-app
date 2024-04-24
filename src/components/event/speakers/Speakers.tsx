import { Flex, Grid, Text } from "@chakra-ui/react";
import Image from "next/image";
import { HeartCrack } from "lucide-react";

export const Speakers = ({ speakers }: { speakers: IEvent["speakers"] }) => {
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      textAlign={"center"}
      w={"100%"}
      my={20}
    >
      <Text fontWeight={"bold"} fontSize={"3rem"} mb={20}>
        Speakers
      </Text>

      {!speakers?.length && (
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
      {!!speakers?.length && (
        <Grid
          gridTemplateColumns="repeat(auto-fill, 220px)"
          gap={10}
          w={"100%"}
          placeItems={"center"}
          alignItems={"flex-start"}
          maxW={"1100px"}
        >
          {speakers.map((speaker, idx) => (
            <Flex
              {...(!!speaker.url ? { as: "a", href: speaker.url } : {})}
              gap={4}
              flexDirection={"column"}
              key={idx}
              alignItems={"center"}
              textAlign={"center"}
            >
              <Image
                key={idx}
                src={speaker.avatarUrl || "/images/logo_dark.svg"}
                alt={`speaker ${speaker.name} avatar`}
                width={220}
                height={220}
                style={{
                  objectFit: "cover",
                  borderRadius: "100%",
                  width: "220px",
                  height: "220px",
                }}
              />
              <Text fontWeight={"600"} fontSize={"1.6rem"}>
                {speaker.name}
              </Text>
              <Flex flexDirection={"column"} alignItems={"center"}>
                {!!speaker.position && (
                  <Text fontWeight={"bold"}>{speaker.position}</Text>
                )}
                {!!speaker.company && (
                  <Text color={"#494949"}>{speaker.company}</Text>
                )}
              </Flex>
            </Flex>
          ))}
        </Grid>
      )}
    </Flex>
  );
};
