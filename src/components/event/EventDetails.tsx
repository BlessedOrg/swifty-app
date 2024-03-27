import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { periodDate } from "@/utils/periodDate";
import { MapPin } from "lucide-react";
import Image from "next/image";
import ReactHtmlParser from "html-react-parser";

interface IProps extends IEvent {}

export const EventDetails = ({
  eventTitle,
  period,
  location,
  address,
  avatars,
  host,
  description,
  price,
}: IProps) => {
  const date = periodDate(period);
  const descriptionColor = useColorModeValue("#4c4c4c", "#fff");
  return (
    <Flex gap={"1rem"} w={"100%"} flexDirection={{ base: "column", lg: "row" }}>
      <Flex
        flexDirection={"column"}
        border={"1px solid"}
        borderColor={"#D0D0D0"}
        rounded={"24px"}
        py={"1.5rem"}
        px={"2rem"}
        w={{ base: "100%", lg: "row" }}
        gap={"1rem"}
        alignItems={{ base: "center", lg: "initial" }}
      >
        <Flex w={"100%"} justifyContent={"flex-end"}>
          {!!host?.length && (
            <Text fontSize={"12px"}>
              hosted by{" "}
              {host.map((i, idx) => (
                <Text key={idx} as={"span"} fontWeight={700}>
                  {i.name}
                </Text>
              ))}
            </Text>
          )}
        </Flex>

        <Flex
          justifyContent={"space-between"}
          gap={"1rem"}
          alignItems={"center"}
          w={"100%"}
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Flex flexDirection={"column"} gap={"1rem"} fontWeight={"700"}>
            <Text fontSize={"24px"}>{eventTitle}</Text>
            <Text>{date}</Text>
          </Flex>
          <Flex
            gap={"1rem"}
            alignItems={"center"}
            flexDirection={{ base: "column", md: "row" }}
            textAlign={{ base: "center", md: "inherit" }}
          >
            <MapPin color={"blue"} size={28} />
            <Text
              fontWeight={"bold"}
            >{`${address?.street}, ${address?.postalCode} ${address?.city}, ${address?.country}`}</Text>
          </Flex>
        </Flex>

        {!!avatars?.length && (
          <Flex
            gap={"1rem"}
            mt={"2rem"}
            flexWrap={"wrap"}
            justifyContent={{ base: "center", md: "normal" }}
          >
            {avatars.map((i, idx) => (
              <Image
                key={idx}
                src={i}
                alt={`speaker avatar`}
                width={200}
                height={200}
                style={{
                  objectFit: "cover",
                  width: "100px",
                  height: "100px",
                  borderRadius: "100%",
                }}
              />
            ))}
          </Flex>
        )}

        {!!description && (
          <Flex
            className={"markdown"}
            color={descriptionColor}
            flexDirection={"column"}
            gap={1}
            maxW={"90%"}
            textAlign={{ base: "center", lg: "inherit" }}
            alignItems={{ base: "center", lg: "initial" }}
          >
            {ReactHtmlParser(description)}
          </Flex>
        )}
      </Flex>

      <StepsTiles price={price} />
    </Flex>
  );
};

interface IStepsProps {
  price: number | string;
}

const StepsTiles = ({ price }: IStepsProps) => {
  const stepsItems = [
    {
      title: "First step",
      description: `Deposits ${price} USD`,
    },
    {
      title: "Second step",
      description: `Play the lottery`,
    },
    {
      title: "Third step",
      description: `Mint NFT Ticket`,
    },
    {
      title: `Fourth step +${price} USD`,
      description: `Take part in the auction`,
    },
  ];
  return (
    <Flex
      flexDirection={"column"}
      gap={"1rem"}
      w={"100%"}
      maxW={{ base: "none", lg: "326px" }}
    >
      {stepsItems.map((i, idx) => {
        return (
          <Flex
            key={idx}
            rounded={"24px"}
            border={"1px solid"}
            borderColor={"#D0D0D0"}
            flexDirection={"column"}
            gap={"8px"}
            py={"10px"}
            px={"1rem"}
            alignItems={"center"}
            textAlign={"center"}
          >
            <Text color={"#7E7D7D"} fontWeight={500}>
              {i.title}
            </Text>
            <Text fontSize={"20px"} color={"#9747FF"}>
              {i.description}
            </Text>
          </Flex>
        );
      })}
      <Button
        rounded={"8px"}
        bg={"#9747FF"}
        _hover={{}}
        flexDirection={"column"}
        gap={"8px"}
        py={"10px"}
        px={"1rem"}
        alignItems={"center"}
        textAlign={"center"}
        fontWeight={"600"}
        color={"#fff"}
        h={"50px"}
      >
        Enroll
      </Button>
    </Flex>
  );
};
