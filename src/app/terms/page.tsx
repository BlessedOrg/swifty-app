"use client";
import {
  Box,
  Flex,
  Heading,
  Text,
  Link,
  useMediaQuery,
  Card,
} from "@chakra-ui/react";

export default function TermsPage() {
  const boxProps = {
    mt: 10,
  };
  const flexColumnProps = {
    flexDirection: "column" as any,
    gap: 3,
  };

  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Box w={"100%"} display={"grid"} placeItems={"center"}>
      <Card
        py={"4rem"}
        mt={{ base: "3rem", lg: "10rem" }}
        display={"flex"}
        maxW={"600px"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        mb={10}
      >
        <Heading as={"h1"}>Terms of service</Heading>
        <Box width={"100%"} px={isMobile ? "1rem" : "3rem"}>
          <Box {...boxProps}>
            <Flex {...flexColumnProps}>
              <Text>
                The Site is operated by: Pandr UG (“Pandr”, “we”, “us”, “our”)
                represented by its managing director Frank Bartels and Daud
                Zulfacar Erich-Weinert-Str.51, 10439 Berlin, Germany{" "}
                <Link href={"https://blessed.fan"}>https://blessed.fan</Link>
              </Text>
            </Flex>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
