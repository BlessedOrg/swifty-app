import { Button, Flex, Link, Text } from "@chakra-ui/react";
import Image from "next/image";
import { CloseButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/CloseButton";

export const SponsorshipActionView = ({ toggleView, sliderData }) => {
  const { ctaLabel, ctaUrl, description, logo, backgroundUrl, title } =
    sliderData || ({} as any);
  return (
    <Flex w={"100%"} h={"100%"}>
      <CloseButton
        onClick={toggleView}
        pos={"absolute"}
        top={"1.5rem"}
        right={"1.5rem"}
        bg={"#fff"}
        borderColor={"#000"}
        color={"#000"}
        zIndex={1}
      />
      <Flex flexDirection={"column"} p={6} gap={6} w={"100%"}>
        <Flex w={"fit-content"}>
          {!!logo && (
            <Image
              src={logo}
              alt={"sponsor logo"}
              width={200}
              height={200}
              style={{
                width: "auto",
                height: "70px",
                objectFit: "contain",
              }}
            />
          )}
        </Flex>
        <Text fontWeight={"bold"} fontSize={"3rem"} maxW={"90%"}>
          {title}
        </Text>
        <Text>{description}</Text>

        {ctaLabel && (
          <Button
            as={Link}
            href={ctaUrl || "/"}
            target={"_blank"}
            mt={4}
            w={"fit-content"}
          >
            {ctaLabel}
          </Button>
        )}
      </Flex>
      {!!backgroundUrl && (
        <Image
          src={"/images/cooldownSlider/gelato.png"}
          alt={""}
          width={500}
          height={500}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      )}
    </Flex>
  );
};
