import {
  Button,
  Flex,
  FormControl,
  useToast,
  Select,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventSchema,
  eventEditSchema,
} from "@/components/createEvent/createEventForm/schema";
import { useEffect, useState } from "react";
import { swrFetcher } from "../../../requests/requests";
import CustomDropzone from "@/components/dropzone/CustomDropzone";
import { BookType, Hourglass, LineChart, MapPin, Receipt } from "lucide-react";
import { DatePickerField } from "@/components/createEvent/createEventForm/datePickerField/DatePickerField";
import { PhasesSettings } from "@/components/createEvent/createEventForm/phasesSettings/PhasesSettings";
import { uploadBrowserFilesToS3 } from "../../../services/uploadImagesToS3";
import { AddressFormModal } from "@/components/createEvent/createEventForm/modals/addressFormModal/AddressFormModal";
import { FormField, FormInput } from "./FormFields";
import { SpeakersField } from "@/components/createEvent/createEventForm/speakersField/SpeakersField";
import { payloadFormat } from "@/utils/createEvent/payloadFormat";
import { HostsField } from "./hostsField/HostsField";
import { useRouter } from "next/navigation";
import { UploadImagesGrid } from "@/components/createEvent/createEventForm/uploadImagesGrid/UploadImagesGrid";
import { TextEditor } from "@/components/createEvent/textEditor/TextEditor";
import { uploadSpeakersAvatars } from "@/utils/createEvent/uploadSpeakersAvatars";
import { formatAndUploadImagesGallery } from "@/utils/createEvent/formatAndUploadImagesGallery";
import { getDefaultValues } from "@/utilscreateEvent/getDefaultValues";

interface IProps {
  isEditForm?: boolean;
  defaultValues?: IEvent | null;
  address: string;
  email: string | null;
  userId?: string;
}
export const CreateEventForm = ({
  address,
  email,
  isEditForm = false,
  defaultValues: createdEventDefaultValues,
  userId,
}: IProps) => {
  const router = useRouter();
  const [eventType, setEventType] = useState<"paid" | "free">("paid");
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagesGallery, setImagesGallery] = useState<
    { index: number; source: File }[] | null
  >([]);
  const [enteredDescription, setEnteredDescription] = useState(
    createdEventDefaultValues?.description || "",
  );

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
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(
      isEditForm ? eventEditSchema() : eventSchema(eventType === "free"),
    ),
    defaultValues,
  });
  const watchType = watch("type");

  useEffect(() => {
    reset(defaultValues);
  }, [address]);
  useEffect(() => {
    console.log(errors);
    console.log("🚨 CreateEventForm.tsx errors ^ ");
  }, [errors]);

  useEffect(() => {
    if (watchType !== eventType) {
      setEventType(watchType);
    }
  }, [watchType]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      //update cover url
      let coverUrl = createdEventDefaultValues?.coverUrl;
      if (uploadedImage instanceof File) {
        const res = await uploadBrowserFilesToS3([uploadedImage]);
        coverUrl = res?.[0].preview;
      }
      //update speakers and their avatars urls
      let updatedSpeakers;
      if (!!data?.speakers?.length) {
        const res = await uploadSpeakersAvatars(data.speakers);
        updatedSpeakers = res;
      }

      //update images gallery
      const finalGalleryImages = await formatAndUploadImagesGallery(
        imagesGallery,
        isEditForm,
      );

      //final payload
      const payload = payloadFormat(
        data,
        coverUrl,
        updatedSpeakers,
        finalGalleryImages,
        isEditForm,
      );
      console.log("🚀 payload:", payload);

      const method = isEditForm ? "PUT" : "POST";
      const res = await swrFetcher("/api/events/createEvent", {
        method,
        body: JSON.stringify({
          ...payload,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res?.ticketSale) {
        toast({
          title: `Event ${isEditForm ? "updated" : "created"}.`,
          description: `We've ${
            isEditForm ? "updated" : "created"
          } your event for you. You will be redirected in sec.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        if (isEditForm) {
          router.push(`/event/created`);
        } else {
          router.push(`/event/${res.ticketSale.id}`);
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
      console.error(error);
    }
    setIsLoading(false);
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
            <Flex flexDirection={"column"} gap={4}>
              <Flex gap={2} justifyContent={"flex-end"} w={"100%"}>
                {!isEditForm && (
                  <Select
                    w={"fit-content"}
                    size={"sm"}
                    rounded={"5px"}
                    alignSelf={"flex-end"}
                    {...register("type")}
                    isDisabled={isLoading}
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
                  isDisabled={isLoading}
                >
                  <option value="event">Event</option>
                  <option value="concert">Concert</option>
                  <option value="conference">Conference</option>
                </Select>
              </Flex>
              <FormControl isInvalid={!!errors.title} isDisabled={isLoading}>
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
                  isDisabled={isLoading}
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
                  isDisabled={isLoading}
                />
              </FormField>

              {!isEditForm && (
                <FormControl isInvalid={!!errors.startsAt || !!errors.finishAt}>
                  <DatePickerField
                    wrapperBg={wrapperBg}
                    control={control}
                    isDisabled={isLoading}
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
                  disabled={isLoading}
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
                isDisabled={isLoading}
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

              <SpeakersField control={control} isDisabled={isLoading} />
              <HostsField control={control} isDisabled={isLoading} />
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
                    isDisabled={isLoading}
                  />
                </FormField>

                <FormField label={"Price increase after each phase (%)"}>
                  <FormInput
                    type={"number"}
                    icon={LineChart}
                    id={"priceIncrease"}
                    placeholder={
                      "Price increase after each phase e.g., 5%, 10%"
                    }
                    register={register}
                    isDisabled={isLoading}
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
                    isDisabled={isLoading}
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
          isLoading={isLoading}
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
        register={register}
        errors={errors}
        setValue={setValue}
        defaultValues={addressData}
        control={control}
      />
    </>
  );
};
