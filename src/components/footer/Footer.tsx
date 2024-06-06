"use client";
import { Heart, Moon, SunMoon } from "lucide-react";

import {
  Button,
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import NextLink from "next/link";

export const Footer = () => {
  const textColorBrand = useColorModeValue("black", "white");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      zIndex="3"
      flexDirection={{
        base: "column",
      }}
      alignItems={{
        base: "center",
      }}
      justifyContent="space-between"
      px={{ base: "30px", md: "50px" }}
      pb="30px"
      mt={"250px"}
    >
      <Flex
        w="100%"
        justifyContent={isMobile ? "center" : "space-between"}
        alignItems={"center"}
        pt={"8px"}
        borderTop={"2px solid"}
        borderColor={textColorBrand}
        flexDirection={isMobile ? "column" : "row"}
        gap={{ base: "2", md: 0 }}
        textTransform={"uppercase"}
      >
        <List
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "baseline" }}
          gap={{ base: "2", md: 0 }}
        >
          <ListItem
            me={{
              base: 0,
              md: "44px",
            }}
          >
            <Link
              as={NextLink}
              href="/about"
              fontWeight="500"
              color={textColorBrand}
            >
              About
            </Link>
          </ListItem>
          <ListItem
            me={{
              base: 0,
              md: "44px",
            }}
          >
            <Link
              as={NextLink}
              href="/event/create"
              fontWeight="500"
              color={textColorBrand}
            >
              Create an event
            </Link>
          </ListItem>
          <ListItem
            me={{
              base: 0,
              md: "44px",
            }}
          >
            <Link
              as={NextLink}
              href="mailto:support@blessed.fans "
              fontWeight="500"
              color={textColorBrand}
            >
              Support
            </Link>
          </ListItem>
        </List>
        <List
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          alignItems={"center"}
          gap={{ base: "2", md: 0 }}
        >
          <ListItem
            me={{
              base: 0,
              md: "44px",
            }}
          >
            <Link
              as={NextLink}
              href="/imprint"
              fontWeight="500"
              color={textColorBrand}
            >
              Imprint
            </Link>
          </ListItem>
          <ListItem
            me={{
              base: 0,
              md: "44px",
            }}
          >
            <Link
              as={NextLink}
              href="/terms"
              fontWeight="500"
              color={textColorBrand}
            >
              Terms of use
            </Link>
          </ListItem>
          <ListItem
            me={{
              base: 0,
              md: "44px",
            }}
          >
            <Link
              as={NextLink}
              href="/privacy"
              fontWeight="500"
              color={textColorBrand}
            >
              Privacy
            </Link>
          </ListItem>
          {/*<ListItem>*/}
          {/*  <Button*/}
          {/*    variant="ghost"*/}
          {/*    bg="transparent"*/}
          {/*    p="0px"*/}
          {/*    minW="unset"*/}
          {/*    minH="unset"*/}
          {/*    w="max-content"*/}
          {/*    onClick={toggleColorMode}*/}
          {/*    aria-label="Theme toggle"*/}
          {/*    alignSelf={"center"}*/}
          {/*  >*/}
          {/*    {colorMode === "light" ? <Moon /> : <SunMoon />}*/}
          {/*  </Button>*/}
          {/*</ListItem>*/}
        </List>
      </Flex>
      <Flex
        gap={1}
        alignItems={"center"}
        textTransform={"uppercase"}
        fontWeight={"bold"}
        letterSpacing={-1}
      >
        <Text>From berlin with love </Text>
        <Heart style={{ rotate: "90deg" }} color={"#000"} fill={"#06F881"} />
        <Text>blessed</Text>
      </Flex>
    </Flex>
  );
};
