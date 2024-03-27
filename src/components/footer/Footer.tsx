"use client";
import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { Moon, SunMoon } from "lucide-react";

interface IProps {}

export const Footer = ({}: IProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      pt={12}
      pb={"5rem"}
      px={4}
      w={"100%"}
      borderTop={"1px solid"}
      borderColor={"#aaa"}
      mt={12}
      justifyContent={"center"}
    >
      <Button onClick={toggleColorMode}>
        {colorMode === "light" ? <Moon /> : <SunMoon />}
      </Button>
    </Flex>
  );
};
