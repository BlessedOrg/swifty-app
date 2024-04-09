import React from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  useClipboard,
  Button,
  Text,
} from "@chakra-ui/react";

export const EventsTable = ({ data }) => {
  return (
    <Table variant="simple" size={"sm"}>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>ID</Th>
          <Th>LotteryV1 Contract</Th>
          <Th>LotteryV2 Contract</Th>
          <Th>AuctionV1 Contract</Th>
          <Th>AuctionV2 Contract</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item) => (
          <Tr key={item.id}>
            <Td>{item.title}</Td>
            <Td>
              <IdView id={item.id} />
            </Td>
            <Td>
              <ContractAddrView address={item.lotteryV1contractAddr} />
            </Td>
            <Td>
              <ContractAddrView address={item.lotteryV2contractAddr} />
            </Td>
            <Td>
              <ContractAddrView address={item.auctionV1contractAddr} />
            </Td>
            <Td>
              <ContractAddrView address={item.auctionV2contractAddr} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const IdView = ({ id }) => {
  const { hasCopied, onCopy } = useClipboard(id || "");
  return (
    <>
      <span>{id}</span>
      <Button size="xs" ml={2} onClick={() => onCopy()}>
        {hasCopied ? "Copied" : "Copy"}
      </Button>
    </>
  );
};
const ContractAddrView = ({ address }) => {
  const { hasCopied, onCopy } = useClipboard(address || "");
  const renderContractAddress = () => {
    if (address) {
      const formattedAddress = `${address.substring(
        0,
        6,
      )}...${address.substring(address.length - 4)}`;
      return (
        <>
          <span>{formattedAddress}</span>
          <Button size="xs" ml={2} onClick={() => onCopy()}>
            {hasCopied ? "Copied" : "Copy"}
          </Button>
        </>
      );
    } else {
      return <Text></Text>;
    }
  };
  const content = renderContractAddress();
  return content;
};
