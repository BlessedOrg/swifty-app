import { Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import Image from "next/image";
import { AddSpeakerModal } from "@/components/createEvent/createEventForm/modals/addSpeakerModal/AddSpeakerModal";
import { useFieldArray } from "react-hook-form";
import { Trash } from "lucide-react";

export const SpeakersField = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    name: "speakers",
    control,
  });
  const [isAddSpeakerModalOpen, setIsAddSpeakerModalOpen] = useState(false);
  const toggleAddSpeakerModal = () => {
    setIsAddSpeakerModalOpen((prev) => !prev);
  };
  const wrapperBg = "#ECEDEF";
  const colorText = "#0D151CA3";

  return (
    <Flex flexDirection={"column"} gap={4}>
      <Text fontWeight={"bold"}>Speakers</Text>
      {fields.map((field: any, i) => (
        <SpeakerCard key={field.id} {...field} index={i} remove={remove} />
      ))}
      <Button bg={wrapperBg} color={colorText} onClick={toggleAddSpeakerModal}>
        Add speakers
      </Button>
      <AddSpeakerModal
        isOpen={isAddSpeakerModalOpen}
        onClose={toggleAddSpeakerModal}
        addSpeakerHandler={(s) => {
          console.log(s);
        }}
        append={append}
      />
    </Flex>
  );
};

const SpeakerCard = ({ name, description, avatarUrl, index, remove }) => {
  const image =
    avatarUrl instanceof File
      ? URL.createObjectURL(avatarUrl)
      : "/images/logo_dark.svg";
  return (
    <Flex alignItems={"center"} justifyContent={"space-between"} px={4}>
      <Flex alignItems="center" gap={4}>
        <Image
          src={image}
          width={100}
          height={100}
          alt={"speaker name"}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "100%",
          }}
        />
        <Flex flexDirection={"column"}>
          <Text color={"#000"}>{name}</Text>
          <Text>{description}</Text>
        </Flex>
      </Flex>
      <Flex as={"button"} color={"red"} onClick={() => remove(index)}>
        <Trash size={19} />
      </Flex>
    </Flex>
  );
};