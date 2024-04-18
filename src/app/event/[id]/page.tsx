import { Flex } from "@chakra-ui/react";
import { Event } from "@/components/event/Event";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event",
};
async function getEventData(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`,
  );

  return res.json();
}
export default async function EventPage({ params }) {
  const { id } = params;
  const data = await getEventData(id);
  const eventData = data?.event || {};

  return (
    <Flex justifyContent={"center"} w={"100%"}>
      <Event data={eventData} />
    </Flex>
  );
}
