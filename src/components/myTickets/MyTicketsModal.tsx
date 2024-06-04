import {
  Button,
  Card,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { fetcher } from "../../requests/requests";
import useSWR from "swr";
import { LoadingDots } from "@/components/ui/LoadingDots";
import Image from "next/image";
import { shortenAddress } from "@thirdweb-dev/react";
import { useNftMetadata } from "@/hooks/useNftMetadata";
import { Copy } from "lucide-react";

interface IMint {
  id: string;
  txHash: string;
  tokenId: string;
  contractAddr: string;
  walletAddress: string;
  userId: string;
  ticketSaleId: string;
  gasWeiPrice: string;
  createdAt: string;
  updatedAt: string;
  ticketSale: IEvent;
}

export const MyTicketsModal = ({ isOpen, onClose, tickets, isLoading }) => {
  const mints = (tickets || []) as IMint[];
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>My tickets</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            gap={2}
            alignItems={"center"}
            my={2}
            overflowX={"auto"}
            maxW={"100%"}
            px={2}
            py={8}
          >
            {isLoading && <LoadingDots />}

            {!mints.length && !isLoading && <Text my={10}>No results</Text>}

            {!!mints.length &&
              mints.map((mint) => {
                return <TicketCard key={mint.id} mint={mint} />;
              })}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const TicketCard = ({ mint }: { mint: IMint }) => {
  const { name, uri } = useNftMetadata(mint.contractAddr);
  const toast = useToast();
  return (
    <Card
      w={"100%"}
      gap={2}
      py={2}
      borderBottom={"1px solid"}
      borderColor={"#ddd"}
      maxW={"220px"}
      minW={"220px"}
      px={2}
      fontWeight={"bold"}
      boxShadow={'none'}
      style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"}}
    >
      <Text textAlign={"center"}>{`,,${mint.ticketSale.title}"`} event</Text>
      <Image
        src={"/images/cover-auctions.png"}
        alt={"ticket image"}
        width={200}
        height={200}
        style={{
          height: "auto",
          width: "100%",
          borderRadius: "10px"
        }}
      />
      <Text>{name}</Text>
      <Text>ID #{mint.tokenId}</Text>
      <Button
        variant={"ghost"}
        h={"auto"}
        py={2}
        fontSize={"0.9rem"}
        onClick={() => {
          navigator.clipboard.writeText(mint.contractAddr);
          toast({
            title: "Contract address copied!",
            status: "success",
          });
        }}
      >
        <Flex gap={2} alignItems={"center"}>
          {shortenAddress(mint.contractAddr)}
          <Copy size={19} />
        </Flex>{" "}
      </Button>
      <Button
        h={"auto"}
        py={2}
        fontSize={"0.9rem"}
        onClick={async () => {
          if (window?.ethereum) {
            try {
              const addnft = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                  type: "ERC1155",
                  options: {
                    address: mint.contractAddr,
                    tokenId: "0",
                  },
                },
              });
              if (addnft) {
                toast({
                  title: "NFT added successfully!",
                  status: "success",
                });
              } else {
                toast({
                  title: "Action denied!",
                  status: "error",
                });
              }
            } catch (e) {
              const error = e as any;
              toast({
                title: `${error.message}`,
                status: "error",
              });
            }
          } else {
            toast({
              title: `No wallet detected, copy address and add token manually: ${mint.contractAddr}`,
              status: "error",
            });
          }
        }}
      >
        Add to wallet{" "}
      </Button>
    </Card>
  );
};