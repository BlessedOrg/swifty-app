"use client";
import {Box, Card, Flex, Heading,Text, useMediaQuery} from "@chakra-ui/react";


export default function ImprintPage() {
  const boxProps = {
    mt: 10,
  };

  const flexColumnProps = {
    flexDirection: "column" as any,
    gap: 1,
  };

  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (

        <Box w={"100%"} display={"grid"} placeItems={"center"}>
          <Card py={"4rem"} mt={{ base: "3rem", lg: "10rem" }} display={"flex"} maxW={"600px"}
                flexDirection={"column"} justifyContent={"center"} alignItems={"center"} mb={10}>
            <Heading as={"h1"}>Imprint</Heading>
            <Box width={"100%"} px={isMobile ? "1rem" : "3rem"}>
              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Text>Pandr UG </Text>
                  <Text>Erich-Weinert-Str. 51</Text>
                  <Text> 10439 Berlin</Text>
                  <Text>Germany</Text>
                </Flex>
              </Box>
            </Box>
          </Card>
        </Box>

  );
}
