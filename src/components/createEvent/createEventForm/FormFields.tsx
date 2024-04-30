import {
  Flex,
  FlexProps,
  FormControl,
  FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface FormInputProps extends InputProps {
  icon?: LucideIcon;
  iconSize?: number;
  register?: any;
}
export const FormInput = ({
  icon,
  iconSize,
  register,
  id,
  ...rest
}: FormInputProps) => {
  const Icon = icon || null;
  return (
    <>
      {!!Icon && <Icon size={iconSize || 20} />}
      <Input
        p={0}
        border={"none"}
        bg={"transparent"}
        fontWeight={500}
        overflow={"hidden"}
        color={"inherit"}
        _focusVisible={{}}
        px={2}
        {...(register ? { ...register(id) } : {})}
        {...rest}
      />
    </>
  );
};

interface FormFieldProps extends FlexProps {
  children: React.ReactNode;
  errorMessage?: any;
  helperText?: any;
  isInvalid?: boolean;
  label?: string;
  isDisabled?: boolean;
}

export const FormField = ({
  children,
  errorMessage,
  isInvalid,
  label,
  isDisabled,
  helperText,
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
      {!!label && <FormLabel>{label}</FormLabel>}
      <Flex
        alignItems={"center"}
        w={"100%"}
        p={"8px"}
        rounded={"7px"}
        gap={1}
        bg={wrapperBg}
        _hover={{
          bg: wrapperHoverBg,
        }}
        transition={"all 150ms"}
        cursor={isDisabled ? "no-drop" : "pointer"}
        color={isDisabled ? "#b9b5b5" : "#0D151CA3"}
        {...rest}
      >
        {children}
      </Flex>

      {isInvalid && errorMessage}
      {!!helperText && !isInvalid && helperText}
    </FormControl>
  );
};
