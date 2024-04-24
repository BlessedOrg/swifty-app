import { Box, Flex, Grid, Text, useColorModeValue } from "@chakra-ui/react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import ReactHtmlParser from "html-react-parser";
import { formatDateToShort } from "@/utilsformatDateToShort";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
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
              position={"relative"}
              overflow={"hidden"}
              height={"100px"}
              px={2}
            >
              {!!eventLocation.cityLatitude &&
                !!eventLocation.cityLongitude && (
                  <Flex
                    pos={"absolute"}
                    w={"100%"}
                    h={"100%"}
                    zIndex={-1}
                    top={0}
                    left={0}
                    bg={"rgba(255,255,255, 0.6)"}
                  >
                    <MapBackground
                      lat={eventLocation.cityLatitude}
                      lng={eventLocation.cityLongitude}
                    />
                    <Flex
                      pos={"absolute"}
                      top={0}
                      width={"100%"}
                      height={"100%"}
                      bg={"rgba(255,255,255, 0.7)"}
                      zIndex={1}
                    ></Flex>
                  </Flex>
                )}
              <MapPin size={28} fill={"#FF3300"} color={"#fff"} />
              <Text
                fontWeight={"bold"}
              >{`${eventLocation?.street1stLine}, ${eventLocation?.street2ndLine}, ${eventLocation?.postalCode} ${eventLocation?.city}, ${eventLocation?.country}`}</Text>
            </Flex>
          </Flex>

          {/*Description*/}
          <Box color={descriptionColor} className={"markdown"}>
            {!!description
              ? ReactHtmlParser(description)
              : "There is no description for this event yet."}
          </Box>
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
            columnGap={8}
          >
            {speakers.slice(0, 4).map((speaker, idx) => (
              <Flex
                {...(!!speaker.url ? { as: "a", href: speaker.url } : {})}
                flexDirection={"column"}
                key={idx}
                alignItems={"center"}
                textAlign={"center"}
                gap={1}
              >
                <Image
                  src={speaker.avatarUrl || "/images/logo_dark.svg"}
                  alt={`speaker ${speaker.name} avatar`}
                  width={200}
                  height={200}
                  style={{
                    objectFit: "cover",
                    width: "120px",
                    height: "120px",
                    borderRadius: "100%",
                  }}
                />
                <Text fontWeight={"600"} fontSize={"1.2rem"}>
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
    </Flex>
  );
};

const MapBackground = ({ lat, lng }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{
        width: "100%",
        height: "100px",
        zIndex: 1,
        borderRadius: "24px",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};
