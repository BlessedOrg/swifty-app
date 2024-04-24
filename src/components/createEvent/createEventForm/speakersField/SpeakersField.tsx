import { Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import Image from "next/image";
import { AddSpeakerModal } from "@/components/createEvent/createEventForm/modals/addSpeakerModal/AddSpeakerModal";
import { useFieldArray } from "react-hook-form";
import { PencilLine, Trash } from "lucide-react";

export const SpeakersField = ({ control, isDisabled, defaultValues }) => {
  const { fields, append, update, remove } = useFieldArray({
    name: "speakers",
    control,
  });
  const [isAddSpeakerModalOpen, setIsAddSpeakerModalOpen] = useState(false);
  const toggleAddSpeakerModal = () => {
    setIsAddSpeakerModalOpen((prev) => !prev);
  };
  const wrapperBg = "#ECEDEF";
  const colorText = "#0D151CA3";

  console.log(fields);
  return (
    <Flex flexDirection={"column"} gap={4}>
      <Text fontWeight={"bold"}>Speakers</Text>
      {fields.map((field: any, i) => (
        <SpeakerCard
          key={field.id}
          {...field}
          index={i}
          remove={remove}
          isDisabled={isDisabled}
          update={update}
        />
      ))}
      <Button
        bg={wrapperBg}
        color={colorText}
        onClick={toggleAddSpeakerModal}
        isDisabled={isDisabled}
      >
        Add speakers
      </Button>
      <AddSpeakerModal
        isOpen={isAddSpeakerModalOpen}
        onClose={toggleAddSpeakerModal}
        append={append}
        defaultValues={null}
      />
    </Flex>
  );
};

const SpeakerCard = ({
  name,
  url,
  position,
  company,
  avatarUrl,
  index,
  remove,
  isDisabled,
  update,
  speakerId,
}) => {
  const [isEditSpeakerModalOpen, setIsEditSpeakerModalOpen] = useState(false);
  const toggleEditSpeakerModal = () => {
    setIsEditSpeakerModalOpen((prev) => !prev);
  };
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
          <Text>{company}</Text>
        </Flex>
      </Flex>

      <Flex gap={4}>
        <Flex
          as={"button"}
          type={"button"}
          color={"green"}
          onClick={toggleEditSpeakerModal}
          disabled={isDisabled}
        >
          <PencilLine size={19} />
        </Flex>
        <Flex
          as={"button"}
          type={"button"}
          color={"red"}
          onClick={() => remove(index)}
          disabled={isDisabled}
        >
          <Trash size={19} />
        </Flex>
      </Flex>

      <AddSpeakerModal
        isOpen={isEditSpeakerModalOpen}
        onClose={toggleEditSpeakerModal}
        update={update}
        defaultValues={{
          name,
          url,
          position,
          company,
          avatarUrl,
          speakerId,
        }}
        index={index}
        isEdit={true}
      />
    </Flex>
  );
};
