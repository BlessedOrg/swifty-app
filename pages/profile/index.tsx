import { Flex } from "@chakra-ui/react";
import { PersonalInformationForm } from "@/components/profile/personalInformation/PersonalInformationForm";
import Head from "next/head";

export default function ProfilePage() {
  return (
    <Flex w={"100%"} justifyContent={"center"}>
      <Head>
        <title>Profile | Blessed</title>
      </Head>
      <PersonalInformationForm
        defaultValues={null}
        isLoading={false}
        mutate={() => {}}
        avatarKey={null}
      />
    </Flex>
  );
}
