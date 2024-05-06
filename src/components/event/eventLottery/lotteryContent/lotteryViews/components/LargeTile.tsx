import { ReactNode } from "react";
import { Flex, FlexProps } from "@chakra-ui/react";

export const LargeTile = ({
  children,
  variant = "solid",
  ...rest
}: {
  children: ReactNode;
  variant?: "solid" | "outline";
} & FlexProps) => {
  const style = {
    solid: {
      bg: "#06F881",
    },
    outline: {
      border: "1px solid",
      borderColor: "#FFA500",
    },
  };
  return (
    <Flex
      w={"300px"}
      h={"300px"}
      {...style[variant]}
      rounded={"1.5rem"}
      flexDirection={"column"}
      alignItems={"center"}
      textAlign={"center"}
      fontWeight={"bold"}
      justifyContent={"center"}
      color={"#000"}
      p={2}
      {...rest}
      lineHeight={"normal"}
    >
      {children}
    </Flex>
  );
};
