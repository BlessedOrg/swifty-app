import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import CustomDropzone from "@/components/dropzone/CustomDropzone";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  append?: any;
  update?: any;
  defaultValues?: any;
  isEdit?: boolean;
  index?: number;
}

const schema = z.object({
  name: z.string().min(1, "Field is required!"),
  url: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  avatarUrl: z.any().optional(),
  speakerId: z.string().optional(),
});
export const AddSpeakerModal = ({
  isOpen,
  onClose,
  append,
  defaultValues,
  update,
  isEdit,
  index,
}: IProps) => {
  const [avatarUrl, setAvatarUrl] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: isEdit ? defaultValues : {},
  });

  const onSubmit = (data) => {
    const formatUrl = !!data.url && data.url.includes("http") ? data.url : "https://"+data.url
    const payload = {
      name: data.name,
      url: formatUrl || "",
      company: data.company || "",
      position: data.position || "",
      avatarUrl: avatarUrl || defaultValues?.avatarUrl || "",
    };
    console.log("Paylod", payload);
    if (isEdit) {
      update(index, { ...payload, speakerId: defaultValues?.speakerId });
    } else {
      append(payload);
      reset({ name: "" });
    }
    setAvatarUrl(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? "Edit" : "Add"} speaker</ModalHeader>
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
                  currentImage={defaultValues?.avatarUrl || null}
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
              <Button variant="ghost" mr={3} type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="black"
                type={"button"}
                h={'40px'}
                onClick={handleSubmit(onSubmit)}
              >
                {isEdit ? "Save changes" : "Add speaker"}
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
