import { Flex, Text } from "@chakra-ui/react";
import { Event } from "@/components/event/Event";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event",
};
async function getEventData(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`,
    { next: { revalidate: 5 } },
  );

  return res.json();
}
export default async function EventPage({ params }) {
  const { id } = params;
  const data = await getEventData(id);
  const eventData = data?.event || null;

  return (
    <Flex justifyContent={"center"} w={"100%"}>
      {!!eventData && <Event data={eventData} />}
      {!eventData && (
        <Text fontSize={"2.5rem"} color={"#afaaaa"} fontWeight={"bold"} mt={10}>
          Event not found.
        </Text>
      )}
    </Flex>
  );
}
