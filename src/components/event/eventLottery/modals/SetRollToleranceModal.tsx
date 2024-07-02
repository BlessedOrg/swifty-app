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
import { useState } from "react";
import {useUserContext} from "@/store/UserContext";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSetRollTolerance: any;
  defaultValue?: number | null;
}

export const SetRollToleranceModal = ({
  isOpen,
  onClose,
  onSetRollTolerance,
  defaultValue,
}: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enteredValue, setEnteredValue] = useState(
    defaultValue ? defaultValue : "",
  );
  const { connectWallet, isLoggedIn:isConnected } = useUserContext();

  const onValueChange = (e) => {
    const value = +e.target.value
    if(value >= 1 && value <= 99){
      setEnteredValue(value);
    } else {
      setEnteredValue(1)
    }
  };

  const handleSubmit = async () => {
    if (enteredValue) {
      setIsLoading(true);

      await onSetRollTolerance(enteredValue);
    }
    setIsLoading(false);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set Roll Tolerance</ModalHeader>
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
                  %
                </InputLeftElement>
                <Input
                  type={"number"}
                  placeholder="Enter roll tolerance 0-100%"
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
            <Button
              variant="ghost"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};




