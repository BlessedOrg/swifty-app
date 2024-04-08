"use client";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { schema } from "./schema";
import countryList from "react-select-country-list";
import { ProfileAvatar } from "./avatar/ProfileAvatar";
import { zodResolver } from "@hookform/resolvers/zod";

export const PersonalInformationForm = ({
  defaultValues,
  isLoading,
  avatarKey,
  mutate,
}) => {
  const avatarUrl = "/images/cover-placeholder.png";
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema(defaultValues)),
  });
  const options = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const updateProfile = async (data: any) => {};
  const findCountry = (name: string) => {
    return options.find((i) => i.label === name);
  };
  const onSubmit = async (data) => {};

  return (
    <Card my={8} maxWidth={{ lg: "4xl" }} px={0} w={"100%"}>
      <Flex flexDirection={"column"} alignItems="center" gap={8}>
        <Heading
          as={"h1"}
          fontSize={"xl"}
          w="full"
          textAlign={"center"}
          borderBottom="2px"
          borderColor={"gray"}
          py={"4"}
        >
          Personal Information
        </Heading>
        <Box position={"relative"}>
          <Avatar src={avatarUrl} w={128} h={128} rounded={"full"} />
          <ProfileAvatar mutate={mutate} />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection={"column"} gap={5} px={8}>
            <Flex
              flexDirection={"column"}
              gap={5}
              borderBottom={"2px"}
              borderColor={"gray.300"}
              pb={6}
            >
              <FormControl>
                <FormLabel htmlFor="name">{"Name"}</FormLabel>
                <Input
                  mb="0"
                  placeholder={"Name"}
                  type="text"
                  {...register("name")}
                />
              </FormControl>
              <FormControl isInvalid={!!errors?.username}>
                <FormLabel htmlFor="username">{"Username"}</FormLabel>
                <Input
                  mb="0"
                  placeholder={"Username"}
                  type="username"
                  {...register("username")}
                />
              </FormControl>
              <Box>
                <FormLabel>{"Email"}</FormLabel>
                <Input
                  mb="0"
                  placeholder={"Email"}
                  type="email"
                  value={defaultValues?.email || ""}
                  disabled={true}
                />
              </Box>

              <FormControl>
                <FormLabel>{"Location"}</FormLabel>
                <Controller
                  name="locationValue"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        onChange={field.onChange}
                        ref={field.ref}
                        value={field.value}
                      >
                        {options.map((i) => (
                          <option key={i.label} value={i.label}>
                            {i.label}
                          </option>
                        ))}
                      </Select>
                    );
                  }}
                />
              </FormControl>
            </Flex>
            <Flex
              flexDirection={"column"}
              gap={5}
              borderBottom={"2px"}
              borderColor={"gray.300"}
              pb={6}
            >
              <FormControl>
                <FormLabel>{"Twitter"}</FormLabel>
                <Input
                  mb="0"
                  placeholder={"Twitter"}
                  type="text"
                  {...register("twitterUrl")}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="discordHandler">{"Discord"}</FormLabel>
                <Input
                  mb="0"
                  placeholder={"Discord handle"}
                  type="text"
                  {...register("discordHandler")}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="githubUrl">{"Github"}</FormLabel>
                <Input
                  mb="0"
                  placeholder={"Github"}
                  type="text"
                  {...register("githubUrl")}
                />
              </FormControl>
              <FormControl isInvalid={!!errors?.websiteUrl}>
                <FormLabel htmlFor="websiteUrl">{"Website"}</FormLabel>
                <Input
                  mb="0"
                  placeholder={"Website"}
                  type="text"
                  {...register("websiteUrl")}
                />
              </FormControl>
            </Flex>

            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              my={5}
              alignSelf={{ base: "inherit", md: "flex-end" }}
            >
              <Button
                type="submit"
                isDisabled={isLoading || loading || !defaultValues}
                isLoading={isLoading}
                colorScheme={"blue"}
                px={"24px"}
              >
                {"Save Changes"}
              </Button>
            </Stack>
          </Flex>
        </form>
      </Flex>
    </Card>
  );
};
