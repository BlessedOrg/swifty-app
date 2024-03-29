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
      bg: "linear-gradient(180deg, #22C55E 0%, #37AE99 100%)",
    },
    outline: {
      border: "1px solid",
      borderColor: "#22C55E",
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
      {...rest}
    >
      {children}
    </Flex>
  );
};
