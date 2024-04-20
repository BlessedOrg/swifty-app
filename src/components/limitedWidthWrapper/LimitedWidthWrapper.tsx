import { Flex, FlexProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface WrapperProps extends FlexProps {
  children: ReactNode;
  size?: "xl" | "lg";
}
export const LimitedWidthWrapper = ({
  children,
  size = "lg",
  ...rest
}: WrapperProps) => {
  const propsMaxWidth = {
    xl: "1680px",
    lg: "1210px",
  };
  return (
    <Flex
      flexDirection={"column"}
      maxW={propsMaxWidth[size]}
      w={"100%"}
      gap={"2rem"}
      {...rest}
    >
      {children}
    </Flex>
  );
};
