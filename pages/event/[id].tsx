import { Text, Flex } from "@chakra-ui/react";
import { GalleryGrid } from "@/components/event/GalleryGrid";
import { EventDetails } from "@/components/event/EventDetails";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import { ImagesInfiniteSlider } from "@/components/event/ImagesInfiniteSlider";
import FlippableCard from "@/components/flipCard/FlippableCard";

export default function EventPage() {
  return (
    <Flex justifyContent={"center"} w={"100%"}>
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        gap={"2rem"}
        maxW={"1210px"}
        overflow={"hidden"}
      >
        <GalleryGrid />
        <Flex
          bg={"rgba(151, 71, 255, 0.10)"}
          rounded={"24px"}
          p={"1rem"}
          justifyContent={"center"}
          textAlign={"center"}
          fontSize={{ base: "1rem", md: "22px" }}
          gap={"1.5rem"}
          w={"100%"}
        >
          <Text color={"#9747FF"} fontWeight={"700"}>
            2 DAY 6 HOUR 13 MIN
          </Text>
          <Text color={"#7E7D7D"} fontWeight={"700"}>
            to start
          </Text>
        </Flex>

        <EventDetails {...exampleEvent} />

        <ImagesInfiniteSlider />

        <EventLottery />
      </Flex>
    </Flex>
  );
}

const exampleEvent: IEvent = {
  id: 1,
  eventTitle: "Modular summit",
  images: ["/images/event1.png", "/images/event2.png"],
  location: "Conference House",
  country: "Paris",
  period: {
    from: "2023-12-07T19:03:34.074Z",
    to: "2023-12-08T19:03:34.074Z",
  },
  price: 100,
  badge: "Hot",
  avatars: [
    "/images/profile.png",
    "/images/profile.png",
    "/images/profile.png",
  ],
  host: [{ name: "Celestia Lab", url: "https://google.com" }],
  address: {
    street: "3 Rue Mazarine",
    postalCode: "75006",
    country: "France",
    city: "Paris",
  },
  description:
    "<p><strong>Join us for a two-day event to learn from the visionary builders at\n" +
    "the forefront of the modular blockchain revolution.</strong></p>\n" +
    "\n" +
    "<p>We believe in a positive-sum crypto ecosystem, free of maximalism. The\n" +
    "Modular Summit invites founders and builders from all corners of the\n" +
    "industry to blueprint the new modular ecosystem and the path to\n" +
    "sovereign communities.</p>",
};
