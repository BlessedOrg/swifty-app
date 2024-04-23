import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { EventCard } from "@/components/events/eventCard/EventCard";

interface IProps {
  events: IEvent[];
  editingView?: boolean;
}

export const EventsGrid = ({ events, editingView }: IProps) => {
  return (
    <Flex flexDirection={"column"} alignItems={"center"} w={"100%"} gap={12}>
      <Grid
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 320px)"
        rowGap={8}
        columnGap={4}
        w={"100%"}
        placeItems={"center"}
        alignItems={"flex-start"}
        justifyContent={"center"}
      >
        {events.map((item, idx) => (
          <EventCard {...item} editingView={editingView} key={idx} />
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
