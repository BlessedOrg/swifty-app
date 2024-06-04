"use client";
import { Button, Flex } from "@chakra-ui/react";
import { Ticket } from "lucide-react";
import { useState } from "react";
import { MyTicketsModal } from "@/components/myTickets/MyTicketsModal";
import useSWR from "swr";
import { fetcher } from "../../requests/requests";

export const MyTicketsButton = () => {
  const { data, isLoading } = useSWR("/api/user/myTickets", fetcher);

  const [isOpen, setIsOpen] = useState(false);

  const toggleModalState = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
        <Button
          pos={"fixed"}
          top={"35%"}
          right={!data?.mints?.length ? "-100%": "0"}
          style={{ transform: "translateY(-50%)" }}
          bg={"#ffdada"}
          zIndex={101}
          px={4}
          py={2}
          roundedTopLeft={"24px"}
          roundedBottomLeft={"24px"}
          roundedBottomRight={"0px"}
          roundedTopRight={"0px"}
          fontWeight={"bold"}
          _hover={{}}
          onClick={toggleModalState}
          transition={'all 250ms'}
        >
          <Flex gap={2} pos={"relative"} pr={4}>
            <Ticket size={26} />{" "}
          </Flex>
        </Button>

      <MyTicketsModal
        isOpen={isOpen}
        onClose={toggleModalState}
        tickets={data?.mints || null}
        isLoading={isLoading}
      />
    </>
  );
};
