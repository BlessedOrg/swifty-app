import { Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Spinner, Text } from "@chakra-ui/react";
import { CheckIcon, CornerDownRight, X } from "lucide-react";

export const LoadingModal = ({ isOpen, onClose, title, description, transactionLoadingState }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent py={5}>
        <ModalHeader textAlign={"center"}>{title}</ModalHeader>
        <ModalBody>
          <Flex flexDirection={"column"} gap={4} alignItems={"start"}>
            <Text textAlign={"start"} my={4}>{description}</Text>
            {!!transactionLoadingState?.length && transactionLoadingState.map(item => (
              <Flex gap={2} key={item?.name} alignItems={"center"}>
                {item?.isLoading && <Spinner w={'22px'} height={'22px'} />}
                {item?.isFinished && !item?.isError && <CheckIcon />}
                {item?.isFinished && !!item?.isError && <X />}
                {!item?.isLoading && !item?.isError && !item?.isFinished && <CornerDownRight />}
                <Text>{item?.name}</Text>
              </Flex>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
