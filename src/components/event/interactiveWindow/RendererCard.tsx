import {Flex, Text} from "@chakra-ui/react";
import {zeroPad} from "react-countdown";

export const RendererCard = ({ days, hours, minutes }) => {
    return (
        <Flex
            flexDirection={"column"}
            bg={"#fff"}
            rounded={"4px"}
            py={1}
            px={4}
            mb={3}
        >
            <Flex
                style={{ fontVariantNumeric: "tabular-nums" }}
                fontSize={{ base: "1rem", xl: "2rem" }}
                color={"#000"}
                fontWeight={"bold"}
                letterSpacing={{ base: "normal", xl: "-2px" }}
                lineHeight={{ base: "1rem", xl: "2rem" }}
            >
                <Text>
                    {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}
                </Text>
            </Flex>
            <Flex
                justifyContent={"space-around"}
                fontSize={{ base: "0.9rem", xl: "1rem" }}
            >
                <Text>D</Text>
                <Text>H</Text>
                <Text>M</Text>
            </Flex>
        </Flex>
    );
};