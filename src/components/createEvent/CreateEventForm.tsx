import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/components/createEvent/schema";
import { DatePicker } from "@/components/datePicker/DatePicker";
import { useEffect, useState } from "react";
import { swrFetcher } from "../../requests/requests";

export const CreateEventForm = ({ address, email }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    sellerWalletAddr: address,
    sellerEmail: email,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection={"column"} gap={4}>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" {...register("title")} />
          {errors.title && <p>{`${errors?.title?.message}`}</p>}
        </FormControl>

        <FormControl isInvalid={!!errors.sellerEmail} isDisabled>
          <FormLabel htmlFor="sellerEmail">Seller Email</FormLabel>
          <Input id="sellerEmail" {...register("sellerEmail")} />
          {errors.sellerEmail && <p>{`${errors?.sellerEmail?.message}`}</p>}
        </FormControl>

        <FormControl isInvalid={!!errors.sellerWalletAddr}>
          <FormLabel htmlFor="sellerWalletAddr">
            Seller Wallet Address
          </FormLabel>
          <Input
            id="sellerWalletAddr"
            {...register("sellerWalletAddr")}
            isDisabled
          />
          {errors.sellerWalletAddr && (
            <p>{`${errors?.sellerWalletAddr?.message}`}</p>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input id="description" {...register("description")} />
          {errors.description && <p>{`${errors?.description?.message}`}</p>}
        </FormControl>

        <FormControl isInvalid={!!errors.coverUrl}>
          <FormLabel htmlFor="coverUrl">Cover URL</FormLabel>
          <Input id="coverUrl" {...register("coverUrl")} />
          {errors.coverUrl && <p>{`${errors?.coverUrl?.message}`}</p>}
        </FormControl>

        <FormControl isInvalid={!!errors.startsAt}>
          <FormLabel htmlFor="startsAt">Starts At</FormLabel>
          <DatePicker name={"startsAt"} control={control} />
          {errors.startsAt && <p>{`${errors?.startsAt?.message}`}</p>}
        </FormControl>

        <FormControl isInvalid={!!errors.finishAt}>
          <FormLabel htmlFor="finishAt">Finish At</FormLabel>
          <DatePicker name={"finishAt"} control={control} />
          {errors.finishAt && <p>{`${errors?.finishAt?.message}`}</p>}
        </FormControl>
      </Flex>

      <Button type="submit" mt={4} isLoading={isLoading}>
        Submit
      </Button>
    </form>
  );
};
