import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { EventCard } from "@/components/events/eventCard/EventCard";

interface IProps {
  events: IEvent[];
}

export const EventsGrid = ({ events }: IProps) => {
  return (
    <Flex flexDirection={"column"} alignItems={"center"} w={"100%"} gap={12}>
      <Grid
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(290px, 1fr))"
        rowGap={8}
        columnGap={4}
        w={"100%"}
        placeItems={"center"}
        alignItems={"baseline"}
      >
        {events.map((item, idx) => (
          <GridItem key={idx} minW="290px" maxW="324px" gap={"1rem"}>
            <EventCard {...item} />
          </GridItem>
        ))}
      </Grid>
      {!!events?.length && (
        <Button
          mt={10}
          bg={"rgba(34, 34, 34, 1)"}
          color={"#fff"}
          py={"14px"}
          w={"100%"}
          maxW={"300px"}
          _hover={{}}
        >
          Show more...
        </Button>
      )}
    </Flex>
  );
};
