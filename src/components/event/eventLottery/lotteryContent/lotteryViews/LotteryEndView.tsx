import {Button, Flex, Text} from "@chakra-ui/react";
import Link from "next/link";
import {smallScale} from "../../../../../keyframes/keyframes";

interface IProps {
  isWinner: boolean;
  onMint: any;
  hasMinted: boolean
}
export const LotteryEndView = ({isWinner, onMint, hasMinted}: IProps) => {

  return (
    <Flex
      gap={2}
      justifyContent={"center"}
      alignItems={"center"}
      h={"100%"}
      flexDirection={"column"}
      w={{base: "100%", iwLg: "unset"}}
    >
      <Text fontWeight={"bold"} fontSize={"3rem"} textTransform={"uppercase"}>
        {isWinner ? "You win the Ticket 🎉" : "Sale is finished!"}
      </Text>
      <Text fontWeight={"500"} fontSize={"1.5rem"} textTransform={"uppercase"}>
        {hasMinted ? "Enjoy your ticket! 🎟️":isWinner
          ? "You can mint your ticket now."
          : "Try again with other ticket event sale."}
      </Text>
      {!isWinner || hasMinted &&
        <Button
          mt={4}
          colorScheme={"blue"}
          rounded={"1.5rem"}
          as={Link}
          href={"/"}
        >
          Explore more events
        </Button>
      }
      {isWinner && !hasMinted && (
        <Button
          animation={`${smallScale} infinite 1s ease-in-out`}
          variant={"blue"}
          onClick={onMint}
          minW={"230px"}
          maxW={"260px"}
          w={"100%"}
          mt={4}
          h={{ base: "40px", iw: "52px" }}
          fontSize={{ base: "0.9rem", iwMid: "1rem" }}
        >
          Mint
        </Button>
      )}
    </Flex>
  );
};
