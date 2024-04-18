import {
  Button,
  Flex,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Binary, Building2, Construction, Globe, MapPin } from "lucide-react";
import {
  FormField,
  FormInput,
} from "@/components/createEvent/createEventForm/FormFields";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  register: any;
  errors: any;
  setValue: any;
  defaultValues: any;
}

const addressSchema = z.object({
  country: z.string().min(1, "Field is required!"),
  city: z.string().min(1, "Field is required!"),
  postalCode: z.string().min(1, "Field is required!"),
  street1stLine: z.string().min(1, "Field is required!"),
  street2ndLine: z.string().optional(),
  locationDetails: z.string().optional(),
});
export const AddressFormModal = ({
  isOpen,
  onClose,
  setValue,
  defaultValues = {},
}: IProps) => {
  const methods = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = (data) => {
    setValue("address", {
      ...data,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Event location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex gap={4} flexDirection={"column"}>
              <Flex gap={4}>
                <FormField
                  label={"Country*"}
                  isInvalid={!!errors?.country}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.country?.message}`}</FormErrorMessage>
                  }
                >
                  <FormInput
                    icon={Globe}
                    id={"country"}
                    placeholder={"Country"}
                    register={register}
                  />
                </FormField>
                <FormField
                  label={"City*"}
                  isInvalid={!!errors?.city}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.city?.message}`}</FormErrorMessage>
                  }
                >
                  <FormInput
                    icon={Building2}
                    id={"city"}
                    placeholder={"City"}
                    register={register}
                  />
                </FormField>
              </Flex>
              <Flex gap={4}>
                <FormField
                  label={"Street 1st line*"}
                  isInvalid={!!errors?.street1stLine}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.street1stLine?.message}`}</FormErrorMessage>
                  }
                >
                  <FormInput
                    icon={Construction}
                    id={"street1stLine"}
                    placeholder={"Street 1st line"}
                    register={register}
                  />
                </FormField>
                <FormField label={"Street 2nd line"}>
                  <FormInput
                    id={"street2ndLine"}
                    placeholder={"Street 2nd line"}
                    register={register}
                  />
                </FormField>
              </Flex>
              <FormField
                label={"Postal Code*"}
                isInvalid={!!errors?.postalCode}
                errorMessage={
                  <FormErrorMessage>{`${errors?.postalCode?.message}`}</FormErrorMessage>
                }
              >
                <FormInput
                  icon={Binary}
                  type={"number"}
                  id={"postalCode"}
                  placeholder={"Postal Code e.g., 123-321"}
                  register={register}
                />
              </FormField>
              <FormField label={"Location details (optional)"}>
                <FormInput
                  icon={MapPin}
                  id={"locationDetails"}
                  placeholder={"Location details e.g., Conference House"}
                  register={register}
                />
              </FormField>
            </Flex>

            <ModalFooter mt={6}>
              <Button variant="ghost" type={"submit"}>
                Save address
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
