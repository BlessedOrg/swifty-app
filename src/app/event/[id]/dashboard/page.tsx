"use client";

import { Flex } from "@chakra-ui/react";

import { EventDashboard } from "@/components/event/dashboard/EventDashboard";

export default function EventDashboardPage() {
  return (
    <Flex justifyContent={"center"} px={6} bg={"#f3f3f3"}>
      <EventDashboard />
    </Flex>
  );
}
