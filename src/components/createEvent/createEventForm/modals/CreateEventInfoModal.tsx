import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Spinner, Text } from "@chakra-ui/react";

export const CreateEventInfoModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
      <ModalOverlay background={"rgba(29, 29, 27, 0.6)"} zIndex={5} />
      <ModalContent zIndex={6}>
        <ModalHeader>Creating Event...</ModalHeader>
        <ModalBody paddingBottom={10} display={"flex"} alignItems={"center"} flexDirection={"column"} gap={6}>
          <Text>Please be patient and don't close this page. We are deploying and configuring Smart Contracts for your event. This can take a couple of minutes, depending on the Network traffic.</Text>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#6157FF"
            size="xl"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
