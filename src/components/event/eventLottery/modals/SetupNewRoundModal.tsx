import { Button, Flex, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupNewRound: any;
}

export const SetupNewRoundModal = ({ isOpen, onClose, onSetupNewRound }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [numberOfTickets, setNumberOfTickets] = useState(0);
  const { connectWallet, isLoggedIn: isConnected } = useUser();

  const handleSubmit = async () => {
    if (duration && numberOfTickets) {
      setIsLoading(true);
      const finishAtTimeStamp = new Date(new Date().getTime() + duration * 60000 + 15000).getTime();
      await onSetupNewRound(finishAtTimeStamp, numberOfTickets);
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Setup new round</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} gap={4}>
          {isConnected && (
            <Flex flexDirection="column">
              <FormLabel>Duration</FormLabel>
              <Input
                type={"number"}
                placeholder="Enter duration time (in minutes)"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                mb={4}
              />
              <FormLabel>Tickets' amount</FormLabel>
              <Input
                type={"number"}
                placeholder="Enter amount of tickets"
                value={numberOfTickets}
                onChange={e => setNumberOfTickets(Number(e.target.value))}
              />
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

