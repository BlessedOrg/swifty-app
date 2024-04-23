import { Metadata } from "next";
import { Flex } from "@chakra-ui/react";
import { LimitedWidthWrapper } from "@/components/limitedWidthWrapper/LimitedWidthWrapper";
import { EventEdit } from "@/components/eventEdit/EventEdit";

export const metadata: Metadata = {
  title: "Edit Event",
};
const getEventData = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`,
    { next: { revalidate: 5 } },
  );

  const data = await res.json();

  return data?.event || null;
};
export default async function EventEditPage({ params }) {
  const { id } = params;

  const eventData = await getEventData(id);

  return (
    <Flex
      my={10}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      px={8}
    >
      <LimitedWidthWrapper size={"xl"}>
        <EventEdit eventData={eventData} />
      </LimitedWidthWrapper>
    </Flex>
  );
}
