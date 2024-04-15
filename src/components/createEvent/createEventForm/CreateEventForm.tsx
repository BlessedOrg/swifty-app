import {
  Button,
  Flex,
  FormControl,
  Input,
  useToast,
  Select,
  Textarea,
  FlexProps,
  Skeleton,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/components/createEvent/createEventForm/schema";
import { useEffect, useState } from "react";
import { swrFetcher } from "../../../requests/requests";
import CustomDropzone from "@/components/dropzone/CustomDropzone";
import { LineChart, MonitorPause, NotebookText, Receipt } from "lucide-react";
import { DatePickerField } from "@/components/createEvent/createEventForm/datePickerField/DatePickerField";
import dynamic from "next/dynamic";
import { PhasesSettings } from "@/components/createEvent/createEventForm/phasesSettings/PhasesSettings";

const LocationSelect = dynamic(
  () => import("@/components/locationSelect/LocationSelect"),
  {
    ssr: false,
    loading: () => <Skeleton w={"full"} h={350} rounded={"24px"} />,
  },
);
export const CreateEventForm = ({ address, email }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    sellerWalletAddr: address,
    sellerEmail: email,
    startsAt: new Date(),
    finishAt: new Date(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  } as any;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [address]);
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);
    const formattedValues = {
      ...data,
      increaseValue: !!data.increaseValue ? +data.increaseValue : 0,
      cooldownTime: !!data.cooldownTime ? +data.cooldownTime : 5,
      lotteryV1settings: {
        ...data.lotteryV1settings,
        phaseDuration: !!data.lotteryV1settings.phaseDuration
          ? +data.lotteryV1settings.phaseDuration
          : 30,
      },
      lotteryV2settings: {
        ...data.lotteryV2settings,
        phaseDuration: !!data.lotteryV2settings.phaseDuration
          ? +data.lotteryV2settings.phaseDuration
          : 30,
      },
      auctionV1settings: {
        ...data.auctionV1settings,
        phaseDuration: !!data.auctionV1settings.phaseDuration
          ? +data.auctionV1settings.phaseDuration
          : 30,
      },
      auctionV2settings: {
        ...data.auctionV2settings,
        phaseDuration: !!data.auctionV2settings.phaseDuration
          ? +data.auctionV2settings.phaseDuration
          : 30,
      },
    };

    console.log("Formatted form data:", formattedValues);

    const res = await swrFetcher("/api/events", {
      method: "POST",
      body: JSON.stringify({
        ...formattedValues,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex gap={4} w={"100%"} maxW={"800px"} color={"#0D151CA3"}>
        <Flex flexDirection={"column"} gap={4} w={"100%"}>
          <Select
            w={"fit-content"}
            size={"sm"}
            rounded={"5px"}
            alignSelf={"flex-end"}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </Select>
          <FormControl isInvalid={!!errors.title}>
            <Input
              id="title"
              {...register("title")}
              color={"#000"}
              fontSize={"1.6rem"}
              border={"none"}
              placeholder={"Event Name"}
              fontWeight={"bold"}
              p={0}
              _active={{}}
              _focus={{}}
              _focusVisible={{}}
              _placeholder={{
                color: "#9FA3A7",
              }}
              px={2}
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
          <FormControl w={"100%"} isInvalid={!!errors.location}>
            <Controller
              render={({ field }) => (
                <LocationSelect
                  setCoordinates={(e) => console.log(e)}
                  handleCoords={(e) => field.onChange(e)}
                />
              )}
              name={"location"}
              control={control}
            />
            {errors.location && (
              <FormErrorMessage>{`${errors?.location?.message}`}</FormErrorMessage>
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

          <FormField
            isInvalid={!!errors?.startPrice}
            errorMessage={
              <FormErrorMessage>{`${errors?.cooldownTime?.message}`}</FormErrorMessage>
            }
            label={"Start Price (USD)"}
          >
            <Receipt />
            <Input
              id={"startPrice"}
              type={"number"}
              p={0}
              border={"none"}
              bg={"transparent"}
              fontWeight={500}
              color={"#0D151CA3"}
              overflow={"hidden"}
              maxH={"450px"}
              _focusVisible={{}}
              placeholder={"Start Price (USD)"}
              {...register("startPrice")}
              px={2}
            />
          </FormField>

          <FormField label={"Price increase after each phase (%)"}>
            <LineChart />
            <Input
              id={"increaseValue"}
              type={"number"}
              p={0}
              border={"none"}
              bg={"transparent"}
              fontWeight={500}
              color={"#0D151CA3"}
              overflow={"hidden"}
              maxH={"450px"}
              _focusVisible={{}}
              placeholder={"Price increase after each phase e.g., 5%, 10%"}
              {...register("increaseValue")}
              px={2}
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
            <MonitorPause />
            <Input
              id={"cooldownTime"}
              type={"number"}
              p={0}
              border={"none"}
              bg={"transparent"}
              fontWeight={500}
              color={"#0D151CA3"}
              overflow={"hidden"}
              maxH={"450px"}
              _focusVisible={{}}
              placeholder={"Cooldown time e.g., 5, 10, 15"}
              {...register("cooldownTime")}
              px={2}
            />
          </FormField>

          <PhasesSettings register={register} errors={errors} />
        </Flex>

        <Flex>
          <CustomDropzone
            getImage={(e) => console.log(e)}
            type={"portrait"}
            setIsLoading={() => {}}
          />
        </Flex>
      </Flex>

      <Button
        type="submit"
        mt={4}
        isLoading={isLoading}
        bg={"#69737D"}
        color={"#fff"}
      >
        Submit
      </Button>
    </form>
  );
};

interface FormFieldProps extends FlexProps {
  children: React.ReactNode;
  errorMessage?: any;
  isInvalid?: boolean;
  label?: string;
}

export const FormField = ({
  children,
  errorMessage,
  isInvalid,
  label,
  ...rest
}: FormFieldProps) => {
  const wrapperBg = "#ECEDEF";
  const wrapperHoverBg = "rgba(13, 21, 28, 0.08)";

  return (
    <FormControl
      display={"flex"}
      flexDirection={"column"}
      w={"100%"}
      gap={1}
      isInvalid={isInvalid}
    >
      <FormLabel>{label}</FormLabel>
      <Flex
        alignItems={"center"}
        w={"100%"}
        p={"8px"}
        rounded={"7px"}
        gap={1}
        bg={wrapperBg}
        h={"100%"}
        _hover={{
          bg: wrapperHoverBg,
        }}
        transition={"all 150ms"}
        {...rest}
      >
        {children}
      </Flex>

      {isInvalid && errorMessage}
    </FormControl>
  );
};
