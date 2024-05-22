import { Box, chakra, Flex, Stack, Text, useCheckbox, useCheckboxGroup } from "@chakra-ui/react";
import { FormField, FormInput } from "@/components/createEvent/createEventForm/FormFields";
import { BookType } from "lucide-react";

export const SliderSettings = ({ setValue, register, watchSlider }) => {
  function CustomCheckbox(props) {
    const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
      useCheckbox(props);

    if (props.isBoolean && state.isChecked && !watchSlider?.[props.value]) {
      setValue(`slider.${props.value}`, true);
    } else if (
      props.isBoolean &&
      !state.isChecked &&
      !!watchSlider?.[props.value]
    ) {
      setValue(`slider.${props.value}`, false);
    }

    if (!state.isChecked && !!watchSlider?.[props.value]) {
      setValue(`slider.${props.value}`, false);
    }
    return (
      <chakra.label
        display="flex"
        flexDirection="row"
        alignItems="center"
        gridColumnGap={2}
        bg="#e1e1e1a3"
        rounded="lg"
        px={3}
        py={4}
        cursor="pointer"
        w={"fit-content"}
        {...htmlProps}
      >
        <input {...getInputProps()} hidden />
        <Flex
          alignItems="center"
          justifyContent="center"
          border="2px solid"
          borderColor="#000"
          w={4}
          h={4}
          {...getCheckboxProps()}
        >
          {state.isChecked && <Box w={2} h={2} bg="#000" />}
        </Flex>
        <Text fontSize={"0.9rem"} color="gray.700" {...getLabelProps()}>
          {props.label}
        </Text>
      </chakra.label>
    );
  }

  const { value, getCheckboxProps } = useCheckboxGroup({
    defaultValue: [],
  });

  const getFieldsByActiveValues = () => {
    const fields = slideOptionsWithFields.filter((field) =>
      value.includes(field.id),
    );

    return fields;
  };

  const activeFields = getFieldsByActiveValues();

  return (
    <Flex flexDirection={"column"} gap={4}>
      <Stack direction={"row"}>
        {slideOptionsWithFields.map((slide) => {
          const isBoolean = !slide?.fields?.length;
          return (
            <CustomCheckbox
              {...getCheckboxProps({
                value: slide.id,
                label: slide.label,
                isBoolean,
              })}
            />
          );
        })}
      </Stack>

      {activeFields
        .filter((i) => !!i?.fields?.length)
        .map((field) => {
          return (
            <Flex
              key={field.id}
              flexDirection={"column"}
              gap={2}
              bg={"#ededed"}
              p={2}
            >
              <Text fontWeight={"bold"} fontSize={"1.1rem"}>
                {field.label} settings
              </Text>
              {field?.fields?.map((i) => {
                return (
                  <FormField id={`slider.${field.id}.${i.id}`} label={i.label}>
                    <FormInput
                      icon={BookType}
                      id={`slider.${field.id}.${i.id}`}
                      placeholder={i.label}
                      register={register}
                      isDisabled={false}
                    />
                  </FormField>
                );
              })}
            </Flex>
          );
        })}
    </Flex>
  );
};

const slideOptionsWithFields = [
  {
    id: "ama",
    label: "AMA Experts",
    description: "User can ask a question a be picked to get reward.",
  },
  {
    id: "video",
    label: "Video clips",
    description: "Have a simple way to show any video",

    fields: [
      {
        id: "videoUrl",
        label: "Video URL",
      },
    ],
  },
  {
    id: "sponsorship",
    label: "Sponsorship",
    description: "You can provide sponsor solution details",

    fields: [
      {
        id: "logo",
        label: "Logo URL",
      },
      {
        id: "title",
        label: "Title",
      },
      {
        id: "description",
        label: "Description",
      },
      {
        id: "ctaLabel",
        label: "CTA Label",
      },
      {
        id: "ctaUrl",
        label: "CTA URL",
      },
    ],
  },
  {
    id: "quizzes",
    label: "Quizzes",
    fields: [{ id: "typeformId", label: "Typeform Id" }],
    description: "Set up and provide quiz typeform ID.",
  },
  // {
  //   id: "digitalConfession",
  //   label: "Digital Confession",
  // },
];
