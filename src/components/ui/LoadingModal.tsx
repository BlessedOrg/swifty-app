import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  Text,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { LoadingDots } from "@/components/ui/LoadingDots";

export const LoadingModal = ({ isOpen, onClose, title, description }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent py={5}>
        <ModalHeader textAlign={"center"}>{title}</ModalHeader>

        <ModalBody>
          <Flex flexDirection={"column"} gap={4} alignItems={"center"}>
            <Text textAlign={"center"}>{description}</Text>

            <LoadingDots />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
