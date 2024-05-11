import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  Text,
  ModalHeader,
  ModalOverlay, Spinner,
} from "@chakra-ui/react";
import { LoadingDots } from "@/components/ui/LoadingDots";
import {CheckIcon, X} from "lucide-react";

export const LoadingModal = ({ isOpen, onClose, title, description, transactionLoadingState }) => {
  console.log(transactionLoadingState)
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent py={5}>
        <ModalHeader textAlign={"center"}>{title}</ModalHeader>
        <Flex justifyContent={'center'}><LoadingDots /></Flex>

        <ModalBody>
          <Flex flexDirection={"column"} gap={4} alignItems={"center"}>
            <Text textAlign={"center"}>{description}</Text>

            {!!transactionLoadingState?.length && transactionLoadingState.map((item, idx) => {

              return <Flex gap={2} key={idx}>
                {item?.isLoading && <Spinner w={'22px'} height={'22px'} />}
                {item?.isFinished && !item?.isError && <CheckIcon />}
                {item?.isFinished && !!item?.isError &&<X />}

                <Text>{item?.name}</Text>
              </Flex>
            })}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
