import {
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Table,
  Text,
  Button,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

export const MarketplaceSellers = ({
  sellers,
}: {
  sellers: { name: string; price: number; avatar: string }[];
}) => {
  const [cart, setCart] = useState([]);

  const onAddToCart = (offer) => {};
  return (
    <TableContainer
      w={"100%"}
      color={"#000"}
      h={{ base: "250px", iwMid: "420px" }}
      overflowY={"auto"}
      pos={"relative"}
      rounded={"8px"}
      overflow={"hidden"}
      border={"1px solid"}
      borderColor={"#D3D3D3"}
    >
      <Table variant="simple">
        <Thead pos={"sticky"} left={0} zIndex={"docked"}>
          <Tr>
            <Th>Seller</Th>
            <Th>Price</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody overflowY={"auto"}>
          {!!sellers?.length &&
            sellers
              ?.sort((a, b) => {
                return b.price - a.price;
              })
              ?.map((user, idx) => {
                return (
                  <Tr key={idx}>
                    <Td>
                      <Flex gap={4} alignItems={"center"}>
                        <Image
                          src={user.avatar || "/images/profile.png"}
                          alt={""}
                          width={32}
                          height={32}
                          style={{ borderRadius: "100%" }}
                        />
                        <Text fontWeight={600}>{user.name}</Text>
                      </Flex>
                    </Td>
                    <Td>{user.price}$</Td>
                    <Td>
                      <Button
                        variant={"outline"}
                        minW={"150px"}
                        h={"2.5rem"}
                        borderColor={"#000"}
                        rounded={"24px"}
                      >
                        Buy
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
        </Tbody>
      </Table>
      {!sellers?.length && (
        <Flex
          w={"100%"}
          justifyContent={"center"}
          textAlign={"center"}
          alignItems={"center"}
          p={6}
        >
          <Text fontWeight={"bold"}>No sellers yet.</Text>
        </Flex>
      )}
    </TableContainer>
  );
};
