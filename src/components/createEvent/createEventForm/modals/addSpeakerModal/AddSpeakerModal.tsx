import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

import CustomDropzone from "@/components/dropzone/CustomDropzone";
import { useState } from "react";
import { z } from "zod";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  addSpeakerHandler: (speaker: any) => void;
  append: any;
}

const schema = z.object({
  name: z.string().min(1, "Field is required!"),
  description: z.string().optional(),
  avatarUrl: z.any().optional(),
});
export const AddSpeakerModal = ({ isOpen, onClose, append }: IProps) => {
  const toast = useToast();
  const [speakerName, setSpeakerName] = useState("");
  const [speakerDescription, setSpeakerDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<any>(null);

  const handleAddSpeaker = () => {
    const validatedData = schema.safeParse({
      name: speakerName,
      description: speakerDescription,
      avatarUrl: avatarUrl || "",
    });

    if (validatedData.success) {
      append({
        name: speakerName,
        description: speakerDescription,
        avatarUrl: avatarUrl || "",
      });
      setAvatarUrl("");
      setSpeakerName("");
      setSpeakerDescription("");
      onClose();
    } else {
      toast({
        title: "At least ,Name' field is required to add speaker.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add speaker</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={2} w={"100%"} justifyContent={"space-between"}>
            <FormControl w={"fit-content"}>
              <FormLabel m={0} textAlign={"center"}>
                Avatar
              </FormLabel>
              <CustomDropzone
                getImage={(file) => setAvatarUrl(file)}
                type={"avatar"}
                setIsLoading={() => {}}
                w={"150px"}
              />
            </FormControl>
            <Flex gap={4} flexDirection={"column"} w={"65%"}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  value={speakerDescription}
                  onChange={(e) => setSpeakerDescription(e.target.value)}
                />
              </FormControl>
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter mt={6}>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost" onClick={handleAddSpeaker}>
            Add speaker
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
