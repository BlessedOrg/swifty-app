import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { MarketplaceSellers } from "./MarketplaceSellers";

export const EventMarketplace = ({ eventData }: { eventData: IEvent }) => {
  const { title, hosts } = eventData || {};
  return (
    <Flex
      p={"8px"}
      w={"100%"}
      h={"100%"}
      rounded={"8px"}
      gap={4}
      flexDirection={"column"}
      color={"#1D1D1B"}
    >
      <Flex justifyContent={"space-around"} alignItems={"center"}>
        <Image
          src={"/images/rectangle.png"}
          width={200}
          height={200}
          alt=""
          style={{ maxHeight: "110px", width: "auto" }}
        />
        <Flex flexDirection={"column"} textAlign={"center"}>
          <Text fontWeight={"bold"} fontSize={"2.5rem"}>
            {title}
          </Text>
          {!!hosts.length && (
            <Text fontSize={"0.9rem"} fontWeight={"700"}>
              Hosted by{" "}
              {hosts.map((i, idx) => (
                <Text key={idx} as={"span"}>
                  {i.name}{" "}
                </Text>
              ))}
            </Text>
          )}
        </Flex>
        <Flex flexDirection={"column"} fontWeight={600} gap={2}>
          <Text>Thursday, April 22</Text>
          <Text>5:00 PM - 8:00 PM</Text>
        </Flex>
      </Flex>
      <MarketplaceFilters />
      <MarketplaceSellers
        sellers={[
          { name: "Larry Doe", price: 253, avatar: "/images/cover1.png" },
        ]}
      />
    </Flex>
  );
};
