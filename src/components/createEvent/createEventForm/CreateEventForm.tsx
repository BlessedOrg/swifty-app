import { Button, Flex, FormControl, FormErrorMessage, Select, Text, useToast } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { swrFetcher } from "../../../requests/requests";
import CustomDropzone from "@/components/dropzone/CustomDropzone";
import { DatePickerField } from "@/components/createEvent/createEventForm/datePickerField/DatePickerField";
import { PhasesSettings } from "@/components/createEvent/createEventForm/phasesSettings/PhasesSettings";
import { uploadBrowserFilesToS3 } from "../../../services/uploadImagesToS3";
import { AddressFormModal } from "@/components/createEvent/createEventForm/modals/addressFormModal/AddressFormModal";
import { FormField, FormInput } from "./FormFields";
import { SpeakersField } from "@/components/createEvent/createEventForm/speakersField/SpeakersField";
import { HostsField } from "./hostsField/HostsField";
import { eventEditSchema, eventSchema } from "@/components/createEvent/createEventForm/schema";
import { BookType, Hourglass, LineChart, MapPin, Receipt } from "lucide-react";
import { payloadFormat } from "@/utils/createEvent/payloadFormat";
import { formatAndUploadImagesGallery } from "@/utils/createEvent/formatAndUploadImagesGallery";
import { getDefaultValues } from "@/utilscreateEvent/getDefaultValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadImagesGrid } from "@/components/createEvent/createEventForm/uploadImagesGrid/UploadImagesGrid";
import { TextEditor } from "@/components/createEvent/textEditor/TextEditor";
import { uploadSpeakersAvatars } from "@/utils/createEvent/uploadSpeakersAvatars";
import { useRouter } from "next/navigation";

interface IProps {
  isEditForm?: boolean;
  defaultValues?: IEvent | null;
  address: string;
  email: string | null;
  userId?: string;
}

export const CreateEventForm = ({ address, email,  isEditForm = false, defaultValues: createdEventDefaultValues, userId, }: IProps) => {
  const [eventType, setEventType] = useState<"paid" | "free">("paid");
  const toast = useToast();
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [imagesGallery, setImagesGallery] = useState<{ index: number; source: File }[] | null>([]);
  const [enteredDescription, setEnteredDescription] = useState(createdEventDefaultValues?.description || "",);

  const defaultValues = getDefaultValues(
    address,
    email,
    isEditForm,
    createdEventDefaultValues,
    userId,
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(isEditForm ? eventEditSchema() : eventSchema(eventType === "free")),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [address]);

  useEffect(() => {
    if (watch("type") !== eventType) {
      setEventType(watch("type"));
    }
  }, [watch("type")]);


  const onSubmit = async (formData) => {
    try {
      let coverUrl = createdEventDefaultValues?.coverUrl;
      if (uploadedImage instanceof File) {
        const res = await uploadBrowserFilesToS3([uploadedImage]);
        coverUrl = res?.[0].preview;
      }

      let updatedSpeakers;
      if (!!formData?.speakers?.length) {
        updatedSpeakers = await uploadSpeakersAvatars(formData.speakers);
      }

      const finalGalleryImages = await formatAndUploadImagesGallery(
        imagesGallery,
        isEditForm,
      );

      const payload = payloadFormat(
        formData,
        coverUrl,
        updatedSpeakers,
        finalGalleryImages,
        isEditForm,
      );

      const createEventRes = await swrFetcher("/api/events/createEvent", {
        method: isEditForm ? "PUT" : "POST",
        body: JSON.stringify({
          ...payload,
        })
      });

      if (createEventRes?.ticketSale) {
        const deployedContracts = await swrFetcher(`/api/events/${createEventRes.ticketSale.id}/deployContracts`);

        if (!deployedContracts.error) {
          toast({
            title: "Event created.",
            description: "We've created your event for you.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }

        if (isEditForm) {
          router.push(`/event/created`);
        } else {
          router.push(`/event/${createEventRes.ticketSale.id}`);
        }
      } else {
        toast({
          title: "Something went wrong.",
          description: "",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("🚨 Error while creating Event: ", (error as any).message);
    }
  };

  const wrapperBg = "#ECEDEF";
  const isFreeEvent = eventType === "free";
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const toggleAddressModal = () => {
    setIsAddressModalOpen((prev) => !prev);
  };

  const addressData = watch("address");

  const addressLabel = addressData?.country
    ? `${addressData.country}, ${addressData.city}, ${addressData.street1stLine}, ${addressData.street2ndLine}, ${addressData.postalCode}, ${addressData.locationDetails}`
    : "Add Event Location";

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Flex
          flexDirection={"column"}
          gap={4}
          w={"100%"}
          color={"#0D151CA3"}
          maxW={isFreeEvent ? "1100px" : "1600px"}
        >
          <Flex gap={4} w={"100%"} justifyContent={"space-between"}>
            <Flex flexDirection={"column"} gap={4} w={"100%"} maxW={"550px"}>
              <Flex gap={2} justifyContent={"flex-end"} w={"100%"}>
                {!isEditForm && (
                  <Select
                    w={"fit-content"}
                    size={"sm"}
                    rounded={"5px"}
                    alignSelf={"flex-end"}
                    {...register("type")}
                    isDisabled={isSubmitting}
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </Select>
                )}
                <Select
                  w={"fit-content"}
                  size={"sm"}
                  rounded={"5px"}
                  alignSelf={"flex-end"}
                  {...register("category")}
                  isDisabled={isSubmitting}
                >
                  <option value="event">Event</option>
                  <option value="concert">Concert</option>
                  <option value="conference">Conference</option>
                </Select>
              </Flex>
              <FormControl isInvalid={!!errors.title} isDisabled={isSubmitting}>
                <FormInput
                  color={"#000"}
                  fontWeight={"bold"}
                  fontSize={"1.6rem"}
                  id={"title"}
                  placeholder={"Event Name"}
                  _placeholder={{
                    color: "#9FA3A7",
                  }}
                  register={register}
                  isDisabled={isSubmitting}
                />

                {errors.title && (
                  <FormErrorMessage>{`${errors?.title?.message}`}</FormErrorMessage>
                )}
              </FormControl>

              <FormField>
                <FormInput
                  type={"text"}
                  icon={BookType}
                  id={"subtitle"}
                  placeholder={"Subtitle"}
                  register={register}
                  isDisabled={isSubmitting}
                />
              </FormField>

              {!isEditForm && (
                <FormControl isInvalid={!!errors.startsAt || !!errors.finishAt}>
                  <DatePickerField
                    wrapperBg={wrapperBg}
                    control={control}
                    isDisabled={isSubmitting}
                    defaultZoneValue={
                      createdEventDefaultValues?.timezoneIdentifier || null
                    }
                  />
                  {errors.startsAt && (
                    <FormErrorMessage>{`${errors?.startsAt?.message}`}</FormErrorMessage>
                  )}
                  {errors.finishAt && (
                    <FormErrorMessage>{`${errors?.finishAt?.message}`}</FormErrorMessage>
                  )}
                </FormControl>
              )}
              <FormControl
                w={"100%"}
                maxW={"550px"}
                isInvalid={Boolean(Object.keys(errors?.address || {})?.length)}
              >
                <Flex
                  as={"button"}
                  type={"button"}
                  onClick={toggleAddressModal}
                  w={"100%"}
                  p={"8px"}
                  rounded={"7px"}
                  gap={2}
                  alignItems={"center"}
                  bg={"#ECEDEF"}
                  disabled={isSubmitting}
                  _disabled={{ cursor: "no-drop" }}
                >
                  <MapPin size={20} style={{ minWidth: "20px" }} />
                  <Text
                    fontWeight={500}
                    color={"#0D151CA3"}
                    whiteSpace={"nowrap"}
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                  >
                    {addressLabel}
                  </Text>
                </Flex>
                {Boolean(Object.keys(errors?.address || {})?.length) && (
                  <FormErrorMessage>{`Missing fields in address form.`}</FormErrorMessage>
                )}
              </FormControl>

              <FormField
                alignItems={"flex-start"}
                label={"Event Description"}
                isDisabled={isSubmitting}
              >
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextEditor
                        onTextChangeHandler={(e) => {
                          field.onChange(e);
                          setEnteredDescription(e);
                        }}
                        enteredText={enteredDescription}
                      />
                    );
                  }}
                  name={"description"}
                />
              </FormField>

              <SpeakersField control={control} isDisabled={isSubmitting} />
              <HostsField control={control} isDisabled={isSubmitting} />
            </Flex>

            <Flex flexDirection={"column"} gap={2} maxW={"500px"} w={"100%"}>
              <CustomDropzone
                getImage={(e) => {
                  setUploadedImage(e);
                }}
                type={"portrait"}
                setIsLoading={setUploadingImage}
                isLoading={uploadingImage}
                currentImage={createdEventDefaultValues?.coverUrl || null}
              />
              <UploadImagesGrid
                onFilesChange={(e: { index: number; source: File }[]) => {
                  setImagesGallery(e);
                }}
                defaultValues={createdEventDefaultValues?.imagesGallery}
                currentState={imagesGallery}
              />
            </Flex>
          </Flex>

          {!isFreeEvent && !isEditForm && (
            <Flex gap={4} w={"100%"}>
              <Flex flexDirection={"column"} gap={4} w={"50%"}>
                <FormField
                  isInvalid={!!errors?.price}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.price?.message}`}</FormErrorMessage>
                  }
                  label={"Start Price (USD)"}
                >
                  <FormInput
                    type={"number"}
                    icon={Receipt}
                    id={"price"}
                    placeholder={"Start Price (USD)"}
                    register={register}
                    isDisabled={isSubmitting}
                  />
                </FormField>

                <FormField label={"Price increase after each phase (%)"}>
                  <FormInput
                    type={"number"}
                    icon={LineChart}
                    id={"priceIncrease"}
                    placeholder={"Price increase after each phase e.g., 5%, 10%"}
                    register={register}
                    isDisabled={isSubmitting}
                  />
                </FormField>
                <FormField
                  id={"cooldownTime"}
                  isInvalid={!!errors.cooldownTime}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.cooldownTime?.message}`}</FormErrorMessage>
                  }
                  label={"Cooldown time between each phase (minutes)"}
                >
                  <FormInput
                    type={"number"}
                    icon={Hourglass}
                    id={"cooldownTime"}
                    placeholder={"Cooldown time e.g., 5, 10, 15"}
                    register={register}
                    isDisabled={isSubmitting}
                  />
                </FormField>
              </Flex>
              <PhasesSettings register={register} errors={errors} />
            </Flex>
          )}
        </Flex>

        <Button
          type="submit"
          mt={8}
          isLoading={isSubmitting}
          isDisabled={uploadingImage}
          bg={"#69737D"}
          color={"#fff"}
          _hover={{}}
        >
          {isEditForm ? "Save change" : "Create Event"}
        </Button>
      </form>
      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={toggleAddressModal}
        setValue={setValue}
        defaultValues={addressData}
      />
    </>
  );
};
