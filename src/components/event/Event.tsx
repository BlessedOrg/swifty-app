"use client";
import { Button, Flex, Text } from "@chakra-ui/react";
import { EventDetails } from "@/components/event/EventDetails";
import { ImagesInfiniteSlider } from "@/components/event/ImagesInfiniteSlider";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import { publicClient, userClient } from "services/viem";
import { default as LotteryV1 } from "services/contracts/LotteryV1.json";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Image from "next/image";

const contract = {
  ['LotteryV1']: LotteryV1,
}
const abi = contract["LotteryV1"].abi;

// deployed by API
// const LotteryV1Address = "0x59a4ea7c33b6d91777d28da0d112cf235e13525a";
const LotteryV1Address = "0x1Db46ce4780BeDF8429c2A1D9782497c4a8Be950";

export const Event = ({ data }) => {
  const eventData = ((data || null) as IEvent) || null;

  const writeToContract = async () => {
    // const { address } = useUser();
    const [account] = await userClient.getAddresses()

    console.log("🦦 data: ", data)
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
    })
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
    console.log("🦦 tx: ", (tx.toString()))
  };


  const readContract = async () => {
    const data = await publicClient.readContract({
      address: LotteryV1Address,
      abi,
      functionName: "randomNumber",
    })
    console.log("🐬 data: ", data)
  };

  const hitApiRoute = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "contract": "BlessedFactory"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3000/api/events/clv5lq5qj00039uh57d58gg2e/deployContracts", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      gap={"2rem"}
      maxW={"1210px"}
      overflow={"hidden"}
    >
      <Button onClick={hitApiRoute}>
        HIT API
      </Button>
      <Button onClick={writeToContract}>
        Deposit
      </Button>
      <Button onClick={readContract}>
        Read
      </Button>
      <Flex w={"100%"} justifyContent={"center"}>
        <ImageGallery
          items={
            eventData?.coverUrl
              ? [
                {
                  original: eventData.coverUrl,
                  thumbnail: eventData.coverUrl,
                },
              ]
              : []
          }
          showFullscreenButton={false}
          showPlayButton={false}
          renderItem={(props: { original: string; thumbnail: "string" }) => {
            return (
              <Image
                src={props.original}
                unoptimized={true}
                className={"image-gallery-image"}
                alt={""}
                width={1024}
                height={1024}
                priority={true}
                style={{
                  borderRadius: "24px",
                  height: "55vh",
                  maxHeight: "800px",
                  objectFit: "cover",
                }}
              />
            );
          }}
        />
      </Flex>
      <Flex
        bg={"rgba(151, 71, 255, 0.10)"}
        rounded={"24px"}
        p={"1rem"}
        justifyContent={"center"}
        textAlign={"center"}
        fontSize={{ base: "1rem", md: "22px" }}
        gap={"1.5rem"}
        w={"100%"}
      >
        <Text color={"#9747FF"} fontWeight={"700"}>
          2 DAY 6 HOUR 13 MIN
        </Text>
        <Text color={"#7E7D7D"} fontWeight={"700"}>
          to start
        </Text>
      </Flex>

      <EventDetails {...eventData} />
      <ImagesInfiniteSlider />
      <EventLottery />
    </Flex>
  );
};
