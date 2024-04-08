import { Flex } from "@chakra-ui/react";
import { PersonalInformationForm } from "@/components/profile/personalInformation/PersonalInformationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};
export default function ProfilePage() {
  return (
    <Flex w={"100%"} justifyContent={"center"}>
      <PersonalInformationForm
        defaultValues={null}
        isLoading={false}
        mutate={null}
        avatarKey={null}
      />
    </Flex>
  );
}
