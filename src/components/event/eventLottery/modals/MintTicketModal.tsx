import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";


interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MintTicketModal = ({ isOpen, onClose }: IProps) => {
  const [ticketsToMint, setTicketsToMint] = useState(1);
  const { connectWallet, isLoggedIn:isConnected } = useUser();

  const onTicketsInputValueChange = (value: any) => {
    setTicketsToMint(value);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mint ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} gap={4}>
          {isConnected && (
            <Flex flexDirection={"column"} gap={4}>
              <Flex gap={4} alignItems={"center"}>
                <Text>Tickets amount: </Text>
                <NumberInput
                  defaultValue={1}
                  max={10}
                  min={1}
                  keepWithinRange={false}
                  clampValueOnBlur={false}
                  onChange={onTicketsInputValueChange}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text>Total price:</Text>
                <Text>2</Text>
              </Flex>
            </Flex>
          )}
          {!isConnected && (
            <Button
              fontWeight={"600"}
              bg={"rgba(151, 71, 255, 1)"}
              color={"#fff"}
              px={"1.5rem"}
              py={"1rem"}
              rounded={"8px"}
              alignSelf={"center"}
              my={6}
              onClick={connectWallet}
            >
              Connect wallet
            </Button>
          )}
        </ModalBody>

        {isConnected && (
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Submit</Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
