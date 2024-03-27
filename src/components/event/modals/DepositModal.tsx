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
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { useConnectWallet } from "../../../hooks/useConnect";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositHandler: (amount) => void;
  defaultValue: number;
}

export const DepositModal = ({
  isOpen,
  onClose,
  onDepositHandler,
  defaultValue,
}: IProps) => {
  const [enteredValue, setEnteredValue] = useState(
    defaultValue ? defaultValue : undefined,
  );
  const { connectWallet, isConnected } = useConnectWallet();

  const onValueChange = (e) => {
    setEnteredValue(e.target.value);
  };
  const onValueSubmit = () => {
    if (enteredValue) {
      onDepositHandler(+enteredValue);
    }
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deposit</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} gap={4}>
          {isConnected && (
            <Flex>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  $
                </InputLeftElement>
                <Input
                  type={"number"}
                  placeholder="Enter deposit amount"
                  value={enteredValue}
                  onChange={onValueChange}
                />
              </InputGroup>
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
              onClick={connectWallet}
              alignSelf={"center"}
              my={6}
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
            <Button variant="ghost" onClick={onValueSubmit}>
              Submit
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
