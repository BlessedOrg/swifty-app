"use client";
import { useState } from "react";
import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, SimpleGrid, Text, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import { Play } from "lucide-react";

const HowItWorks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const blueTextColor = "rgba(97, 87, 255, 1)";
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const steps = [
    {
      id: 1,
      number: "1",
      title: "Lottery 1",
      description: <Text><b>Click <Text as={"span"} color={"#6157FF"}>Log In</Text> to become BLESSED.</b> Select and deposit USDC for a fair distributed personalized tickets by the magic of on-chain randomness.</Text>,
    },
    {
      id: 2,
      number: "2",
      title: "Lottery 2",
      description: <Text><b>Were not BLESSED yet?</b> No worries start chasing your luck by generating your slots to get the best personalized ticket deal for 1 USDC per roll.</Text>,
    },
    {
      id: 3,
      number: "3",
      title: "Auction 1",
      description: <Text><b>Bid round for round.</b> Try to meet the right price range with your bid, then you participate again in a fair on-chain selection for a non-personalized ticket.</Text>,
    },
    {
      id: 4,
      number: "4",
      title: "Auction 2",
      description: <Text><b>Leaderboard Auctions.</b> Here you can drop your bids and be among the top leaders of the auction to get a non-personalized ticket.</Text>,
    },
    {
      id: 5,
      number: "!",
      title: "Marketplace",
      description: <Text><b>Missed your chance - then check the <Text as={"span"} color={"#6157FF"}>Marketplace</Text> to buy from the BLESSED ones.</b> <br/>Note: Just non personalized ticket can be transferred.</Text>,
      isComingSoon: true,
    },
  ];

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen((!isModalOpen))}
        position={"fixed"}
        right={"24px"}
        bottom={"24px"}
        width={"89px"}
        height={"89px"}
        borderRadius={"50px"}
        border={"2px solid #6157FF"}
        background={"#FFFACD"}
        color={"#6157FF"}
        fontSize={"11 0%"}
        fontStyle={"normal"}
        fontWeight={"700"}
        lineHeight={"100%"}
        zIndex={1401}
        transition={"transform .3s ease-out, color .3s ease-out"}
        transform={isModalOpen ? "scale(1.05)" : "rotate(30deg)"}
        hidden={isModalOpen && isMobile}
        _hover={{
          transform: "scale(1.05)",
          bg: "#E2E8F0"
        }}
      >
        HOW IT <br />
        WORKS
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered={true} size={"6xl"}>
        <ModalOverlay background={"rgba(97, 87, 255, 0.6)"} />
        <ModalContent
          border={"4px solid"}
          borderColor={"rgba(97, 87, 255, 1)"}
          bg={"rgba(255, 250, 205, 1)"}
          w={"90%"}
          borderRadius={"20px"}
          width={"100%"}
          maxWidth={"1392px"}
        >
          <ModalCloseButton size={"lg"} zIndex={1} />
          <ModalBody py={0}>
            <SimpleGrid display={"flex"} flexDirection={isMobile ? "column" : "row"} column={isMobile ? 1 : 2} spacing={10} position={"relative"}>
              <Flex flexBasis={"50%"} gap={4} alignItems={"center"}>
                <Flex flexDirection={"column"} height={"100%"} justifyContent={"space-between"}>
                  <Box paddingTop={12}>
                    <Text
                      color={blueTextColor}
                      textTransform={"uppercase"}
                      fontWeight={"bold"}
                    >
                      How it works
                    </Text>
                    <Text
                      color={blueTextColor}
                      textTransform={"uppercase"}
                      fontSize={"5rem"}
                      lineHeight={"5rem"}
                      fontWeight={"bold"}
                      fontFamily={"TT_Bluescreens"}
                      mb={2}
                    >
                      How to buy tickets <br /> in four easy phases
                    </Text>
                    <Text fontSize={"1.5rem"} mb={6} lineHeight={"1.4"}>
                      Four easy steps to secure your event ticket today. <br />
                      Enjoy fair and fun ticket distribution.
                    </Text>
                    <Flex gap={2}>
                      <Button
                        leftIcon={<Play />}
                        variant={"outline"}
                        rounded={"1.5rem"}
                        borderColor={"#000"}
                      >
                        Watch demo
                      </Button>
                      {/*<Button variant={"ghost"} color={blueTextColor}>*/}
                      {/*  Get more tips*/}
                      {/*</Button>*/}
                    </Flex>
                  </Box>
                  {!isMobile &&
                    <Box position={"absolute"} bottom={"0"} left={"0"} zIndex={-1}>
                      <Image
                        src={"/images/howitworksshape.png"}
                        width={595}
                        height={273}
                        alt={""}
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                      />
                    </Box>
                  }
                </Flex>
              </Flex>
              <Flex flexBasis={"50%"} flexDirection={"column"} alignSelf={"center"} paddingBottom={8} paddingTop={isMobile ? 0 : 12} gap={4}>
                {steps.map(step => (
                  <Flex key={step.id} gap={4}>
                    <Flex>
                      <Text fontFamily={"TT_Bluescreens"} fontSize={"55px"} lineHeight={1} color={"#6157FF"}>
                        {step.number}
                      </Text>
                    </Flex>
                    <Flex flexDirection={"column"}>
                      <Text fontSize={"24px"} fontWeight={700} lineHeight={1} color={"#6157FF"} mb={1}>
                        {step.title}
                        {step.isComingSoon && <Text as={"span"} fontSize={"75%"}> (coming soon)</Text>}
                      </Text>
                      <Text>{step.description}</Text>
                    </Flex>
                  </Flex>
                ))}
                <Text marginBottom={8}>
                  Same price means the fastest bidder in whole phase wins (not the user who was faster placing the end price).
                </Text>
              </Flex>
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default HowItWorks;