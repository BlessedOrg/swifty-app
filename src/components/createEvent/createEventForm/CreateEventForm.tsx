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
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/components/createEvent/createEventForm/schema";
import { useEffect, useState } from "react";
import { swrFetcher } from "../../../requests/requests";
import CustomDropzone from "@/components/dropzone/CustomDropzone";
import { ArrowDown01, AudioLines, NotebookText } from "lucide-react";
import { DatePickerField } from "@/components/createEvent/createEventForm/datePickerField/DatePickerField";
import dynamic from "next/dynamic";

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
  } as any;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [address]);
  const onSubmit = async (data) => {
    setIsLoading(true);

    const formattedData = {
      ...data,
      startsAt: data.startsAt,
      finishAt: data.finishAt,
    };
    console.log("Form data:", formattedData);

    const res = await swrFetcher("/api/events", {
      method: "POST",
      body: JSON.stringify({
        ...formattedData,
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
          <Select w={"fit-content"} size={"sm"} rounded={"5px"}>
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
            />
            {errors.title && <p>{`${errors?.title?.message}`}</p>}
          </FormControl>
          <DatePickerField wrapperBg={wrapperBg} control={control} />
          <Flex w={"100%"}>
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
          </Flex>

          <FormField alignItems={"flex-start"}>
            <NotebookText size={20} />
            <Textarea
              p={0}
              border={"none"}
              bg={"transparent"}
              fontWeight={500}
              color={"#0D151CA3"}
              overflow={"hidden"}
              maxH={"450px"}
              _focusVisible={{}}
              placeholder={"Event Description"}
            />
          </FormField>

          <FormField>
            <ArrowDown01 size={20} />
            <Input
              type={"number"}
              p={0}
              border={"none"}
              bg={"transparent"}
              fontWeight={500}
              color={"#0D151CA3"}
              overflow={"hidden"}
              maxH={"450px"}
              _focusVisible={{}}
              placeholder={"Amount tickets per phase"}
            />
          </FormField>

          <FormField>
            <AudioLines />
            <Input
              type={"number"}
              p={0}
              border={"none"}
              bg={"transparent"}
              fontWeight={500}
              color={"#0D151CA3"}
              overflow={"hidden"}
              maxH={"450px"}
              _focusVisible={{}}
              placeholder={"Length of each phase (minutes)"}
            />
          </FormField>
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
}

const FormField = ({ children, ...rest }: FormFieldProps) => {
  const wrapperBg = "#ECEDEF";
  const wrapperHoverBg = "rgba(13, 21, 28, 0.08)";
  return (
    <Flex
      w={"100%"}
      p={"8px"}
      rounded={"7px"}
      gap={2}
      bg={wrapperBg}
      h={"100%"}
      _hover={{
        bg: wrapperHoverBg,
      }}
      transition={"all 150ms"}
      alignItems={"center"}
      {...rest}
    >
      {children}
    </Flex>
  );
};
