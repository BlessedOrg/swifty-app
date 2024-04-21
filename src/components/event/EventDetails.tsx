import { Flex, Grid, Text, useColorModeValue } from "@chakra-ui/react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import ReactHtmlParser from "html-react-parser";
import { formatDateToShort } from "@/utilsformatDateToShort";

interface IProps extends IEvent {}

export const EventDetails = ({
  title,
  startsAt,
  finishAt,
  eventLocation,
  speakers,
  hosts,
  description,
  subtitle,
}: IProps) => {
  const descriptionColor = useColorModeValue("#737373", "#fff");

  return (
    <Flex gap={"1rem"} w={"100%"} flexDirection={"column"}>
      <Flex
        border={"1px solid"}
        borderColor={"#D0D0D0"}
        rounded={"24px"}
        py={"1.5rem"}
        px={"2rem"}
        w={"100%"}
        gap={"5rem"}
      >
        <Flex
          flexDirection={"column"}
          w={"100%"}
          gap={"3rem"}
          alignItems={{ base: "center", lg: "initial" }}
        >
          {/*TITLE WITH HOSTS*/}
          <Flex gap={"20%"} alignItems={"center"}>
            <Flex flexDirection={"column"} gap={1}>
              <Text fontWeight={"bold"} fontSize={"2rem"} maxW={"400px"}>
                {title}
              </Text>
              {!!subtitle && (
                <Text fontWeight={"bold"} color={"#737373"}>
                  {subtitle}
                </Text>
              )}
            </Flex>
            {!!hosts?.length && (
              <Text fontSize={"1rem"} fontWeight={"400"}>
                hosted by{" "}
                {hosts.map((i, idx) => (
                  <Text key={idx} as={"span"} fontWeight={700}>
                    {i.name}
                  </Text>
                ))}
              </Text>
            )}
          </Flex>

          {/*DATES*/}

          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Flex
              flexDirection={"column"}
              gap={4}
              fontWeight={"bold"}
              fontSize={"22px"}
            >
              <Text>{formatDateToShort(startsAt)}</Text>
              <Text>{formatDateToShort(finishAt)}</Text>
            </Flex>

            <Flex
              gap={"0.5rem"}
              alignItems={"center"}
              flexDirection={{ base: "column", md: "row" }}
              textAlign={{ base: "center", md: "inherit" }}
            >
              <MapPin size={28} fill={"#FF3300"} color={"#fff"} />
              <Text
                fontWeight={"bold"}
              >{`${eventLocation?.street1stLine}, ${eventLocation?.street2ndLine}, ${eventLocation?.postalCode} ${eventLocation?.city}, ${eventLocation?.country}`}</Text>
            </Flex>
          </Flex>

          {/*Description*/}
          <Text color={descriptionColor}>
            {!!description
              ? ReactHtmlParser(description)
              : "There is no description for this event yet."}
          </Text>
        </Flex>
        {!!speakers?.length && (
          <Grid
            gridTemplateColumns={speakers?.length <= 1 ? "1fr" : "1fr 1fr"}
            gridTemplateRows={speakers?.length > 2 ? "1fr 1fr" : "1fr"}
            gap={"1rem"}
            mt={"2rem"}
            flexWrap={"wrap"}
            justifyContent={{ base: "center", md: "normal" }}
            minW={"max-content"}
          >
            {speakers.slice(0, 4).map((i, idx) => (
              <Flex
                gap={1}
                flexDirection={"column"}
                key={idx}
                alignItems={"center"}
                textAlign={"center"}
              >
                <Image
                  key={idx}
                  src={i.avatarUrl || "/images/logo_dark.svg"}
                  alt={`speaker ${i.name} avatar`}
                  width={200}
                  height={200}
                  style={{
                    objectFit: "cover",
                    width: "120px",
                    height: "120px",
                    borderRadius: "100%",
                  }}
                />
                <Text fontWeight={"600"}>{i.name}</Text>
                <Text>{i.description}</Text>
              </Flex>
            ))}
          </Grid>
        )}
      </Flex>
    </Flex>
  );
};
