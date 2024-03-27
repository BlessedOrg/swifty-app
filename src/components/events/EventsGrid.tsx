import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { EventCard } from "@/components/events/EventCard";

interface IProps {}

export const EventsGrid = ({}: IProps) => {
  return (
    <Flex flexDirection={"column"} alignItems={"center"} w={"100%"} gap={12}>
      <Grid
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(290px, 1fr))"
        rowGap={8}
        columnGap={4}
        w={"100%"}
        placeItems={"center"}
      >
        {exampleEvents.map((item, idx) => (
          <GridItem key={idx} minW="290px" maxW="324px" gap={"1rem"}>
            <EventCard {...item} />
          </GridItem>
        ))}
      </Grid>
      <Button
        bg={"rgba(34, 34, 34, 1)"}
        color={"#fff"}
        py={"14px"}
        w={"100%"}
        maxW={"300px"}
        _hover={{}}
      >
        Show more...
      </Button>
    </Flex>
  );
};

const exampleEvents: IEvent[] = [
  {
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
  },
  {
    id: 1,
    eventTitle: "Modular summit",
    images: ["/images/event2.png", "/images/event1.png"],
    location: "Conference House",
    country: "Paris",
    period: {
      from: "2023-12-07T19:03:34.074Z",
      to: "2023-12-08T19:03:34.074Z",
    },
    price: 100,
    badge: "Hot",
  },
  {
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
  },
  {
    id: 1,
    eventTitle: "Modular summit",
    images: ["/images/event2.png", "/images/event1.png"],
    location: "Conference House",
    country: "Paris",
    period: {
      from: "2023-12-07T19:03:34.074Z",
      to: "2023-12-08T19:03:34.074Z",
    },
    price: 100,
    badge: "Hot",
  },
  {
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
  },
  {
    id: 1,
    eventTitle: "Modular summit",
    images: ["/images/event2.png", "/images/event1.png"],
    location: "Conference House",
    country: "Paris",
    period: {
      from: "2023-12-07T19:03:34.074Z",
      to: "2023-12-08T19:03:34.074Z",
    },
    price: 100,
    badge: "Hot",
  },
  {
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
  },
  {
    id: 1,
    eventTitle: "Modular summit",
    images: ["/images/event2.png", "/images/event1.png"],
    location: "Conference House",
    country: "Paris",
    period: {
      from: "2023-12-07T19:03:34.074Z",
      to: "2023-12-08T19:03:34.074Z",
    },
    price: 100,
    badge: "Hot",
  },
  {
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
  },
  {
    id: 1,
    eventTitle: "Modular summit",
    images: ["/images/event2.png", "/images/event1.png"],
    location: "Conference House",
    country: "Paris",
    period: {
      from: "2023-12-07T19:03:34.074Z",
      to: "2023-12-08T19:03:34.074Z",
    },
    price: 100,
    badge: "Hot",
  },
];
