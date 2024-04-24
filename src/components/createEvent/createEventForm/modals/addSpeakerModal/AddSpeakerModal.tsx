import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import CustomDropzone from "@/components/dropzone/CustomDropzone";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  addSpeakerHandler: (speaker: any) => void;
  append: any;
}

const schema = z.object({
  name: z.string().min(1, "Field is required!"),
  url: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  avatarUrl: z.any().optional(),
});
export const AddSpeakerModal = ({ isOpen, onClose, append }: IProps) => {
  const [avatarUrl, setAvatarUrl] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    append({
      name: data.name,
      url: data.url,
      company: data.company,
      position: data.position,
      avatarUrl: avatarUrl || "",
    });
    reset({ name: "", company: "", url: "", position: "" });
    setAvatarUrl(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add speaker</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                <FormControl isInvalid={!!errors?.name}>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" {...register("name")} />
                  <FormErrorMessage>{`${errors?.name?.message}`}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Company</FormLabel>
                  <Input type="text" {...register("company")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Position</FormLabel>
                  <Input type="text" {...register("position")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Social Media Url</FormLabel>
                  <Input type="text" {...register("url")} />
                </FormControl>
              </Flex>
            </Flex>

            <ModalFooter mt={6}>
              <Button colorScheme="blue" mr={3} type="button" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="ghost"
                type={"button"}
                onClick={handleSubmit(onSubmit)}
              >
                Add speaker
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
