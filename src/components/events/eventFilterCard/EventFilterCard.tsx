import { Flex, Text } from "@chakra-ui/react";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { ReactNode } from "react";

interface IProps {
  label: string | any;
  placeholder: string;
  isLoading: boolean;
  title: string;
  onClick?: () => void;
  icon?: ReactNode;
}
export const EventFilterCard = ({
  label,
  placeholder,
  isLoading,
  title,
  onClick,
  icon,
}: IProps) => {
  return (
    <Flex
      display={"flex"}
      pos={"relative"}
      {...(onClick ? { as: "button", onClick: onClick } : {})}
      style={{
        boxShadow: "0px 8px 24px 0px rgba(29, 29, 29, 0.08)",
      }}
      px={"2rem"}
      py={"1rem"}
      rounded={"100px"}
      gap={1}
      alignItems={"center"}
      justifyContent={"space-between"}
      width={"225px"}
      _disabled={{ cursor: "no-drop" }}
      disabled={isLoading}
    >
      <Flex
        flexDirection={"column"}
        alignItems={"flex-start"}
        maxW={"calc(100% - 28px)"}
      >
        <Text fontWeight={"bold"} fontSize={"15px"}>
          {title}
        </Text>

        {!isLoading && !label && (
          <Text fontSize={"20px"} fontWeight={"bold"} color={"#D3D3D3"}>
            {placeholder}
          </Text>
        )}
        {!isLoading && !!label && (
          <Text
            fontSize={"20px"}
            fontWeight={"bold"}
            color={"#665CFB"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            maxW={"100%"}
          >
            {label}
          </Text>
        )}
        {isLoading && <LoadingDots />}
      </Flex>
      {!!icon && icon}
    </Flex>
  );
};
