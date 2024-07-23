import { Box, Button, Divider, Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import { getExplorerUrl } from "services/web3Config";
import { Check, X } from "lucide-react";
import { fetcher } from "requests/requests";
import { mutate } from "swr";
import { useEffect, useMemo, useState } from "react";

const PropListItem = ({ label, value, isListItem }) => (
  <ListItem>
    <Flex justifyContent="space-between" w="100%">
      <span>{label} </span>
      <span>{value ? <Check color="green" /> : <X color="red" />}</span>
    </Flex>
    {!isListItem ? <Divider style={{ borderColor: "#b4b4b4" }} /> : null}
  </ListItem>
);

const LinkWrapper = ({ children, value }) =>
  value ? <Link href={getExplorerUrl(value)} rel="noopener nofollow" target="_blank">{children}</Link> : children;

const EventNotConfigured = ({ eventData }) => {
  const [loading, setLoading] = useState(false);

  const retry = async () => {
    try {
      setLoading(true);
      console.log(`💽 RESUMING...`)
      await fetcher(`/api/events/${eventData?.id}/resume`);
      console.log(`💽 Mutated`)
    } catch (error: any) {
      console.log("🚨 Error while resuming event:", error.message);
    } finally {
      console.log(`💽 finallty block`)
      await mutate(`/api/events/${eventData?.id}`);
      // await mutate(`/event/${eventData?.id}`)
      setLoading(false);
    }
  };

  const checkMapper = (check) => {
    switch (check) {
      case "factoryContractDeployHash":
        return "1. deploy BlessedFactory";
      case "setBaseContractsHash":
        return "2. call setBaseContracts";
      case "createSaleHash":
        return "3. call createSale";
      case "lotteryV1GelatoTaskHash":
        return "4. create Gelato VRF task for LotteryV1";
      case "lotteryV2GelatoTaskHash":
        return "5. create Gelato VRF task for LotteryV2";
      case "lotteryV2RandomNumberHash":
        return "6. create Gelato VRF task for AuctionV1";
      case "lotteryV2SetSellerHash":
        return "7. call requestRandomness on LotteryV2";
      case "auctionV1GelatoTaskHash":
        return "8. call setSeller on LotteryV2";
      default:
        return "Unknown check type";
    }
  };

  const checkOrder = [
    "factoryContractDeployHash",
    "setBaseContractsHash",
    "createSaleHash",
    "lotteryV1GelatoTaskHash",
    "lotteryV2GelatoTaskHash",
    "lotteryV2RandomNumberHash",
    "lotteryV2SetSellerHash",
    "auctionV1GelatoTaskHash"
  ];

  // Sort the checks based on the predefined order
  const sortedChecks = Object.entries(eventData.checks)
    .sort(([keyA], [keyB]) => checkOrder.indexOf(keyA) - checkOrder.indexOf(keyB));

  // const validateAndUpdateChecks = (checks, orderedKeys) => {
  //   const updatedChecks = { ...checks };
  //   orderedKeys.forEach(key => {
  //     if (!(key in updatedChecks)) {
  //       updatedChecks[key] = null;
  //     }
  //   });
  //   return updatedChecks;
  // };
  //
  // const checkMapper = () => {
  //   switch (eventData.checks) {
  //     case "factoryContractDeployHash":
  //       return "1. deploy BlessedFactory";
  //     case "setBaseContractsHash":
  //       return "2. call setBaseContracts";
  //     case "createSaleHash":
  //       return "3. call createSale";
  //     case "lotteryV1GelatoTaskHash":
  //       return "4. create Gelato VRF task for LotteryV1";
  //     case "lotteryV2GelatoTaskHash":
  //       return "5. create Gelato VRF task for LotteryV2";
  //     case "lotteryV2RandomNumberHash":
  //       return "6. create Gelato VRF task for AuctionV1";
  //     case "lotteryV2SetSellerHash":
  //       return "7. call requestRandomness on LotteryV2";
  //     case "auctionV1GelatoTaskHash":
  //       return "8. call setSeller on LotteryV2";
  //     default:
  //       return "Unknown check type";
  //   }
  // }

  // useEffect(() => {
  //   console.log("🦦 eventData.checks: ", eventData.checks)
  // }, [eventData])

  // return validateAndUpdateChecks(eventData.checks, orderedCheckKeys);
  // const updatedChecks = useMemo(() => {
  // }, [eventData]);
  // console.log("🐬 updatedChecks: ", updatedChecks)



  return (
    <Box>
      <Text align="center" fontWeight="bold" fontSize="150%" mb={6} color="red">
        Event is not configured properly on-chain wise!
      </Text>
      <Box maxWidth="350px" marginInline="auto">
        <List>
          {Object.entries(eventData.checks)
            .sort(([keyA], [keyB]) => checkOrder.indexOf(keyA) - checkOrder.indexOf(keyB))
            .map(([key, value], index) => {
              console.log("🦦 value: ", value)
              console.log("🐬 checkMapper(key): ", checkMapper(key))
              console.log("____________");
              return (
                <LinkWrapper value={value}>
                  <PropListItem
                    label={checkMapper(key)}
                    value={value}
                    isListItem={Object.keys(eventData.checks).length - 1 === index}
                  />
                </LinkWrapper>
              )
            })}
        </List>
        <Flex justifyContent="center">
          <Button
            mt={8}
            mb={4}
            isDisabled={loading}
            isLoading={loading}
            onClick={retry}
            bg={"#69737D"}
            color={"#fff"}
            _hover={{
              bg: "#fff",
              color: "#69737D"
            }}
          >
            Retry
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default EventNotConfigured;
