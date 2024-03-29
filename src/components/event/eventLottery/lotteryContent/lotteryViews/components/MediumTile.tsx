import { ReactNode } from "react";
import { Flex, FlexProps } from "@chakra-ui/react";

export const MediumTile = ({
  children,
  ...rest
}: { children: ReactNode } & FlexProps) => {
  return (
    <Flex
      w={"300px"}
      h={"120px"}
      rounded={"8px"}
      textAlign={"center"}
      justifyContent={"center"}
      alignItems={"center"}
      p={"30px"}
      fontSize={"14px"}
      {...rest}
    >
      {children}
    </Flex>
  );
};
