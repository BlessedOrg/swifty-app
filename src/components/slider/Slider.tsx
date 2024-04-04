"use client";
import React from "react";
import { Container, Flex, Text } from "@chakra-ui/react";
import ChakraCarousel from "./ChakraCarousel";

export const Slider = ({ slider }) => {
  const sliderItems = slider;

  return (
    <>
      {!!sliderItems.length ? (
        sliderItems.length !== 1 ? (
          <Container
            py={0}
            px={0}
            m={0}
            w={"full"}
            maxW={"none"}
            pos={"relative"}
          >
            <ChakraCarousel gap={32}>
              {sliderItems.map((item, index) => (
                <Flex
                  key={index}
                  // boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                  justifyContent="space-between"
                  flexDirection="column"
                  overflow="hidden"
                  color="gray.300"
                  bg="base.d100"
                  rounded={"24px"}
                  flex={1}
                  w={"full"}
                >
                  <Flex
                    gap={4}
                    justifyContent={"center"}
                    alignItems={"center"}
                    bg={"linear-gradient(180deg, #9977D4 0%, #6337AE 100%)"}
                    w={"100%"}
                    h={"300px"}
                  >
                    <Text
                      fontWeight={"bold"}
                      fontSize={"3rem"}
                      textTransform={"uppercase"}
                    >
                      Slider
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </ChakraCarousel>
          </Container>
        ) : (
          <Flex
            gap={4}
            justifyContent={"center"}
            alignItems={"center"}
            bg={"linear-gradient(180deg, #9977D4 0%, #6337AE 100%)"}
            rounded={"24px"}
            w={"100%"}
            h={"300px"}
          >
            <Text
              fontWeight={"bold"}
              fontSize={"3rem"}
              textTransform={"uppercase"}
            >
              Slider
            </Text>
          </Flex>
        )
      ) : null}
    </>
  );
};
