"use client";
import { Button, Flex, Text } from "@chakra-ui/react";
import { EventDetails } from "@/components/event/EventDetails";
import { ImagesInfiniteSlider } from "@/components/event/ImagesInfiniteSlider";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import { publicClient, userClient } from "services/viem";
import { default as LotteryV1 } from "services/contracts/LotteryV1.json";
import "react-image-gallery/styles/css/image-gallery.css";
import Image from "next/image";
import { EventAgenda } from "@/components/event/EventAgenda";
import { LimitedWidthWrapper } from "@/components/limitedWidthWrapper/LimitedWidthWrapper";
import Countdown from "react-countdown";
import { InstructionSection } from "@/components/event/instructionSection/InstructionSection";
import { formatPrice } from "@/utilsformatPrice";

const contract = {
  ["LotteryV1"]: LotteryV1,
};
const abi = contract["LotteryV1"].abi;

// deployed by API
// const LotteryV1Address = "0x59a4ea7c33b6d91777d28da0d112cf235e13525a";
const LotteryV1Address = "0x1Db46ce4780BeDF8429c2A1D9782497c4a8Be950";

export const Event = ({ data }) => {
  const eventData = ((data || null) as IEvent) || null;

  const writeToContract = async () => {
    // const { address } = useUser();
    const [account] = await userClient.getAddresses();

    console.log("🦦 data: ", data);
    // const tx = await userClient.writeContract({
    //   address: "0x39008557c498c7B620Ec9F882e556faD8ADBdCd5",
    //   functionName: "approve",
    //   args: ["0x43808fc3037b88cb186fc4bf327b28b48f1ec015", "1000"],
    //   abi: usdcContractAbi,
    //   account,
    // });
    // console.log("🔥 account: ", account)

    const tx = await userClient.writeContract({
      address: LotteryV1Address,
      functionName: "requestRandomness",
      args: [],
      abi,
      account,
    });
    // await userClient.writeContract(request)

    // const tx = await client.writeContract({
    //   address: "0x43808fc3037b88cb186fc4bf327b28b48f1ec015",
    //   functionName: "getParticipants",
    //   args: [],
    //   abi,
    //   account,
    // });
    // const tx = await client.writeContract({
    //   address: "0x43808fc3037b88cb186fc4bf327b28b48f1ec015",
    //   functionName: "setUsdcContractAddr",
    //   args: ["0x39008557c498c7B620Ec9F882e556faD8ADBdCd5"],
    //   abi,
    //   account,
    // });

    // console.log("🦦 tx1: ", tx1)
    console.log("🦦 tx: ", tx.toString());
  };

  const readContract = async () => {
    const data = await publicClient.readContract({
      address: LotteryV1Address,
      abi,
      functionName: "randomNumber",
    });
    console.log("🐬 data: ", data);
  };

  const hitApiRoute = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      contract: "BlessedFactory",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    } as any;

    fetch(
      "http://localhost:3000/api/events/clv5lq5qj00039uh57d58gg2e/deployContracts",
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      gap={"2rem"}
      overflow={"hidden"}
      w={"100%"}
    >
      <LimitedWidthWrapper>
        <Flex gap={2}>
          <Button onClick={hitApiRoute}>HIT API</Button>
          <Button onClick={writeToContract}>Deposit</Button>
          <Button onClick={readContract}>Read</Button>
        </Flex>
        <Flex w={"100%"} justifyContent={"center"}>
          <Image
            src={eventData?.coverUrl || "/images/logo_dark.svg"}
            unoptimized={true}
            className={"image-gallery-image"}
            alt={""}
            width={1024}
            height={1024}
            priority={true}
            style={{
              width: "100%",
              borderRadius: "24px",
              height: "55vh",
              maxHeight: "800px",
              objectFit: "cover",
            }}
          />
        </Flex>
        <Flex
          my={10}
          flexDirection={"column"}
          w={"100%"}
          alignItems={"center"}
          textAlign={"center"}
          maxW={"580px"}
          alignSelf={"center"}
        >
          <Text fontSize={"1.5rem"} color={"#858585"}>
            sale starts in
          </Text>
          <Countdown
            date={new Date(eventData?.startsAt || "")}
            renderer={renderer}
            zeroPadTime={0}
          />
          <Button variant={"red"} w={"100%"} mt={"2.5rem"}>
            Enroll
          </Button>
        </Flex>

        <EventDetails {...eventData} />
        <InstructionSection
          price={
            eventData?.priceCents
              ? formatPrice(eventData?.priceCents)
              : "100 USD"
          }
        />
      </LimitedWidthWrapper>

      <ImagesInfiniteSlider />
      <LimitedWidthWrapper my={"6rem"}>
        <EventLottery />
      </LimitedWidthWrapper>

      <EventAgenda />
    </Flex>
  );
};
const renderer = ({ hours, minutes, completed, days }) => {
  if (completed) {
    return "Already live !";
  } else {
    return (
      <Text
        style={{ fontVariantNumeric: "tabular-nums" }}
        fontSize={"3rem"}
        color={"#000"}
        fontWeight={"bold"}
        letterSpacing={"-2px"}
      >
        {days} DAY {hours} HOUR {minutes} MIN
      </Text>
    );
  }
};

// TODO use it late when will be array with images of event

// <ImageGallery
//     items={
//       eventData?.coverUrl
//           ? [
//             {
//               original: eventData.coverUrl,
//               thumbnail: eventData.coverUrl,
//             },
//           ]
//           : []
//     }
//     showFullscreenButton={false}
//     showPlayButton={false}
//     renderItem={(props: {
//       original: string;
//       thumbnail: "string";
//     }) => {
//       return (
//           <Image
//               src={props.original}
//               unoptimized={true}
//               className={"image-gallery-image"}
//               alt={""}
//               width={1024}
//               height={1024}
//               priority={true}
//               style={{
//                 borderRadius: "24px",
//                 height: "55vh",
//                 maxHeight: "800px",
//                 objectFit: "cover",
//               }}
//           />
//       );
//     }}
// />
