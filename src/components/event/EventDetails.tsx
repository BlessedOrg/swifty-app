import { Box, Flex, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import ReactHtmlParser from "html-react-parser";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { periodDate } from "@/utils/periodDate";
import { formatPrice } from "@/utils/formatPrice";

interface IProps extends IEvent {}

export const EventDetails = ({
  title,
  startsAt,
  finishAt,
  eventLocation,
  hosts,
  description,
  subtitle,
  priceCents,
}: IProps) => {
  const { street1stLine, street2ndLine, postalCode, city, country } = eventLocation;
  const descriptionColor = useColorModeValue("#737373", "#fff");

  const getMapUrl = () => {
    const encodedAddress = encodeURIComponent(`${street1stLine}, ${street2ndLine}, ${postalCode}, ${city}, ${country}`);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any)?.MSStream;
    const isAndroid = /android/i.test(navigator.userAgent);

    if (isIOS) {
      return `maps://?q=${encodedAddress}`;
    } else if (isAndroid) {
      return `geo:0,0?q=${encodedAddress}`;
    } else {
      return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }
  };

  return (
    <Flex gap={"1rem"} w={"100%"} flexDirection={"column"}>
      <Flex
        py={"1.5rem"}
        px={"2rem"}
        w={"100%"}
        gap={"5rem"}
        color={"#1D1D1B"}
        alignItems="center"
        textAlign="center"
      >
        <Flex
          flexDirection={"column"}
          w={"100%"}
          gap={"2rem"}
          alignItems={"center"}
        >
          <Flex
            flexDirection={"column"}
            gap={1}
            w={"100%"}
            alignItems={"center"}
          >
            <Text
              fontWeight={"bold"}
              fontSize={"3rem"}
              textTransform={"uppercase"}
            >
              {title}
            </Text>
            {!!subtitle && (
              <Text fontWeight={"bold"} color={"#737373"}>
                {subtitle}
              </Text>
            )}
            <Flex gap={"20%"} alignItems={"center"}>
              {!!hosts?.length && (
                <Text fontSize={"1rem"} fontWeight={"400"}>
                  hosted by{" "}
                  {hosts.map((i, idx) => (
                    <Text key={idx} as={"span"} fontWeight={700}>
                      {i.name}{" "}
                    </Text>
                  ))}
                </Text>
              )}
            </Flex>
          </Flex>

          <Flex
            flexDirection={"column"}
            gap={1}
            w={"100%"}
            alignItems={"center"}
            fontSize={"1.5rem"}
          >
            <Text>{eventLocation?.locationDetails}</Text>
            <Text>{eventLocation?.city}</Text>
            <Text>{periodDate({ from: startsAt, to: finishAt })}</Text>
            <Text fontWeight={"bold"} mt={2} py={2} px={4} bg={"#06F881"}>
              From {formatPrice(priceCents)}$
            </Text>
          </Flex>

          <Box
            color={descriptionColor}
            className={"markdown"}
            textAlign={"center"}
            maxW={"920px"}
            fontSize={"1.25rem"}
          >
            {!!description
              ? ReactHtmlParser(description)
              : "There is no description for this event yet."}
          </Box>

          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <a href={getMapUrl()} target="_blank" rel="noopener noreferrer">
              <Tooltip label="Open in maps" aria-label="Open map">
                <Flex
                  gap={"0.5rem"}
                  alignItems={"center"}
                  flexDirection={{ base: "column", md: "row" }}
                  textAlign={{ base: "center", md: "inherit" }}
                  position={"relative"}
                  overflow={"hidden"}
                  height={"96px"}
                  px={6}
                  rounded={"50px"}
                >
                  {!!eventLocation.cityLatitude && !!eventLocation.cityLongitude && (
                    <Flex
                      pos={"absolute"}
                      w={"100%"}
                      h={"100%"}
                      zIndex={-1}
                      top={0}
                      left={0}
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
                        bg={"rgba(6, 248, 129, 0.7)"}
                        zIndex={1}
                      ></Flex>
                    </Flex>
                  )}
                  <Image
                    src={"/images/location-heart-pin.png"}
                    width={28}
                    height={28}
                    style={{ width: "28px", height: "auto" }}
                    alt={""}
                  />
                  <Text
                    fontSize={"14px"}
                    fontWeight={"bold"}
                  >
                    {`${!!street1stLine ? street1stLine : ""}${!!street1stLine && !!street2ndLine ? `, ${street2ndLine}` : ""}, ${postalCode} ${city}, ${country}`}
                  </Text>
                </Flex>
              </Tooltip>
            </a>
          </Flex>
        </Flex>
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
