import { Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Play } from "lucide-react";

export const HowItWorksModal = ({ isOpen, onClose }) => {
  const blueTextColor = "rgba(97, 87, 255, 1)";
  return (
    <Modal isOpen={false} onClose={onClose} isCentered={true} size={"6xl"}>
      <ModalOverlay background={"rgba(97, 87, 255, 0.4)"} />
      <ModalContent
        py={5}
        border={"2px solid"}
        borderColor={"rgba(97, 87, 255, 1)"}
        bg={"rgba(255, 250, 205, 1)"}
        w={"90%"}
      >
        <ModalBody>
          <Flex gap={4} alignItems={"center"}>
            <Flex flexDirection={"column"} gap={2}>
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
              >
                How to buy tickets <br /> in four easy phases
              </Text>
              <Text fontSize={"1.5rem"}>
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
                <Button variant={"ghost"} color={blueTextColor}>
                  Get more tips
                </Button>
              </Flex>
              <Image
                src={"/images/howitworksshape.png"}
                width={300}
                height={300}
                alt={""}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Flex>
            <Flex flexDirection={"column"}></Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const steps = [
  {
    idx: "1",
    title: "Royale Arena",
    description: <Text></Text>,
  },
  {
    idx: "2",
    title: "Click Clacks",
    description: <Text></Text>,
  },
  {
    idx: "3",
    title: "Fair Bids",
    description: <Text></Text>,
  },
  {
    idx: "4",
    title: "Battle Royale",
    description: <Text></Text>,
  },
  {
    idx: "!",
    title: "Marketplace",
    description: <Text></Text>,
  },
];
