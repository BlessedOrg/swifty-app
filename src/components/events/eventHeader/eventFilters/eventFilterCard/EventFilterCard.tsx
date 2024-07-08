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
  isSmallView?: boolean;
}
export const EventFilterCard = ({
  label,
  placeholder,
  isLoading,
  title,
  onClick,
  icon,
  isSmallView,
}: IProps) => {
  return (
    <Flex
      display={"flex"}
      pos={"relative"}
      {...(onClick ? { as: "button", onClick: onClick } : {})}
      px={isSmallView ? "1rem" : "1.5rem"}
      py={isSmallView ? "10px" : "1rem"}
      rounded={"100px"}
      lineHeight={'normal'}
      gap={isSmallView ? "2px" : 1}
      alignItems={"center"}
      justifyContent={"space-between"}
      width={!isSmallView ? "225px" : "150px"}
      _disabled={{ cursor: "no-drop" }}
      disabled={isLoading}
      transition={"all 150ms"}
      border={'1px solid #1D1D1B'}
      h={isSmallView ? "51px": '72px'}
    >
      <Flex
        flexDirection={"column"}
        alignItems={"flex-start"}
        maxW={"calc(100% - 28px)"}
      >
        <Text fontWeight={"bold"} fontSize={"15px"} color={'#1D1D1B'}>
          {title}
        </Text>

        {!isLoading && !label && (
          <Text
            fontSize={isSmallView ? "1rem" : "20px"}
            fontWeight={"bold"}
            color={"#D3D3D3"}
          >
            {placeholder}
          </Text>
        )}
        {!isLoading && !!label && (
          <Text
            fontSize={isSmallView ? "1rem" : "20px"}
            fontWeight={"bold"}
            color={"rgb(6, 248, 129)"}
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
