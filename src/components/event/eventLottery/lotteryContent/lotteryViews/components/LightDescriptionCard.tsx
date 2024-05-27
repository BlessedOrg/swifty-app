import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export const LightDescriptionCard = ({
  children,
  ...rest
}: { children: ReactNode | any } & FlexProps) => {
  return (
    <Flex
      py={1}
      px={4}
      bg={"#FFFACD"}
      color={"#6157FF"}
      rounded={'4px'}
      fontSize={{base: "10px", iwMid: "20px"}}
      {...rest}
    >
      <Text fontWeight={"bold"}>{children}</Text>
    </Flex>
  );
};
