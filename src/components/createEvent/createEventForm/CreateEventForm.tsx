import {
  Button,
  Flex,
  FormControl,
  useToast,
  Select,
  Textarea,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/components/createEvent/createEventForm/schema";
import { useEffect, useState } from "react";
import { swrFetcher } from "../../../requests/requests";
import CustomDropzone from "@/components/dropzone/CustomDropzone";
import {
  Hourglass,
  LineChart,
  MapPin,
  NotebookText,
  Receipt,
} from "lucide-react";
import { DatePickerField } from "@/components/createEvent/createEventForm/datePickerField/DatePickerField";
import { PhasesSettings } from "@/components/createEvent/createEventForm/phasesSettings/PhasesSettings";
import { uploadBrowserFilesToS3 } from "../../../services/uploadImagesToS3";
import { AddressFormModal } from "@/components/createEvent/createEventForm/modals/addressFormModal/AddressFormModal";
import { FormField, FormInput } from "./FormFields";
import { SpeakersField } from "@/components/createEvent/createEventForm/speakersField/SpeakersField";
import { payloadFormat } from "@/components/createEvent/createEventForm/payloadFormat";
import { HostsField } from "./hostsField/HostsField";
import { useRouter } from "next/navigation";

interface SpeakerItem {
  avatarUrl: File | any;
  name: string;
  description: string;
}

export const CreateEventForm = ({ address, email }) => {
  const router = useRouter();
  const [eventType, setEventType] = useState<"paid" | "free">("paid");
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const defaultValues = {
    sellerWalletAddr: address,
    sellerEmail: email,
    startsAt: new Date(),
    finishAt: new Date(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    type: "paid",
    category: "event",
  } as any;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(eventSchema(eventType === "free")),
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

  const uploadSpeakersAvatars = async (
    items: SpeakerItem[],
  ): Promise<SpeakerItem[]> => {
    const updatedItems: SpeakerItem[] = [];

    for (const item of items) {
      if (item.avatarUrl instanceof File) {
        const res = await uploadBrowserFilesToS3([item.avatarUrl]);
        const updatedItem: SpeakerItem = {
          ...item,
          avatarUrl: res?.[0].preview,
        };
        updatedItems.push(updatedItem);
      } else {
        updatedItems.push(item);
      }
    }

    return updatedItems;
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    let coverUrl;
    if (uploadedImage) {
      const res = await uploadBrowserFilesToS3([uploadedImage]);
      coverUrl = res?.[0].preview;
    }
    let updatedSpeakers;
    if (!!data?.speakers?.length) {
      const res = await uploadSpeakersAvatars(data.speakers);
      updatedSpeakers = res;
    }
    const payload = payloadFormat(data, coverUrl, updatedSpeakers);
    console.log("🚀 payload:", payload);

    const res = await swrFetcher("/api/events/createEvent", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res?.ticketSale) {
      toast({
        title: "Event created.",
        description: "We've created your event for you.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(`/event/${res.ticketSale.id}`);
    } else {
      toast({
        title: "Something went wrong.",
        description: "",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          gap={4}
          w={"100%"}
          color={"#0D151CA3"}
          maxW={isFreeEvent ? "1100px" : "1600px"}
        >
          <Flex flexDirection={"column"} gap={4} w={"100%"}>
            <Flex gap={2} justifyContent={"flex-end"}>
              <Select
                w={"fit-content"}
                size={"sm"}
                rounded={"5px"}
                alignSelf={"flex-end"}
                {...register("type")}
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </Select>
              <Select
                w={"fit-content"}
                size={"sm"}
                rounded={"5px"}
                alignSelf={"flex-end"}
                {...register("category")}
              >
                <option value="event">Event</option>
                <option value="concert">Concert</option>
                <option value="conference">Conference</option>
              </Select>
            </Flex>
            <FormControl isInvalid={!!errors.title}>
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
              />

              {errors.title && (
                <FormErrorMessage>{`${errors?.title?.message}`}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.startsAt || !!errors.finishAt}>
              <DatePickerField wrapperBg={wrapperBg} control={control} />
              {errors.startsAt && (
                <FormErrorMessage>{`${errors?.startsAt?.message}`}</FormErrorMessage>
              )}
              {errors.finishAt && (
                <FormErrorMessage>{`${errors?.finishAt?.message}`}</FormErrorMessage>
              )}
            </FormControl>
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

            <FormField alignItems={"flex-start"} label={"Event Description"}>
              <NotebookText size={20} />
              <Textarea
                id={"description"}
                p={0}
                border={"none"}
                bg={"transparent"}
                fontWeight={500}
                color={"#0D151CA3"}
                overflow={"hidden"}
                maxH={"450px"}
                _focusVisible={{}}
                placeholder={"Event Description"}
                {...register("description")}
                px={2}
              />
            </FormField>

            <SpeakersField control={control} />
            <HostsField control={control} />
          </Flex>

          {!isFreeEvent && (
            <Flex flexDirection={"column"} gap={4} w={"100%"}>
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
                />
              </FormField>

              <FormField label={"Price increase after each phase (%)"}>
                <FormInput
                  type={"number"}
                  icon={LineChart}
                  id={"priceIncrease"}
                  placeholder={"Price increase after each phase e.g., 5%, 10%"}
                  register={register}
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
                />
              </FormField>
              <PhasesSettings register={register} errors={errors} />
            </Flex>
          )}

          <CustomDropzone
            getImage={(e) => {
              console.log(e);
              setUploadedImage(e);
            }}
            type={"portrait"}
            setIsLoading={setUploadingImage}
            isLoading={uploadingImage}
          />
        </Flex>

        <Button
          type="submit"
          mt={4}
          isLoading={isLoading}
          isDisabled={uploadingImage}
          bg={"#69737D"}
          color={"#fff"}
          _hover={{}}
        >
          Create Event
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
