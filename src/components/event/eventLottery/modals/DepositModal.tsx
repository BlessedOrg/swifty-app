import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  Flex,
  InputGroup,
  Input,
  Text,
  InputRightElement,
} from "@chakra-ui/react";
import { useConnectWallet } from "@/hooks/useConnect";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositHandler: any;
  defaultValue?: number | null;
  eventData: IEvent;
  currentTabId: string;
  currentTabSaleData: any;
}

export const DepositModal = ({
  isOpen,
  onClose,
  onDepositHandler,
  defaultValue,
  currentTabId,
  currentTabSaleData,
}: IProps) => {
  const price = `${currentTabSaleData?.price || 0}$`
  const depositContentPerSale = {
    lotteryV1: {
      title: "Get ready for lottery 1!",
      description:
        "Deposit the start price as a minimum amount to participate in the first lottery draw.",
      price,
      infoBoxes: [
        {
          title: "Maximize Your Chances",
          description:
            "Deposit more to ensure you can participate in all phases.",
          variant: "yellow",
        },
        {
          title: "Flexible Withdrawals",
          description:
            "You can withdraw your money during cooldown periods at the end of each phase.",
          variant: "blue",
        },
      ],
    },
    lotteryV2: {
      title: "Get ready for lottery 2!",
      description:
        "Deposit funds to generate numbers, each costing 1 USDC. Match target numbers to win.",
      price,
      infoBoxes: [
        {
          title: "Free Boost Times",
          description:
            "Utilize the boost phase for added number ranges, enhancing your chances.",
          variant: "yellow",
        },
        {
          title: "Plan Ahead",
          description:
            "Remember, two more auction phases follow. Manage your deposits to stay in the game across all stages.",
          variant: "yellow",
        },
      ],
    },
    auctionV1: {
      title: "Get ready for Auction 1!",
      description:
        "Set your auction price above the current strike price to win.",
      price,
      infoBoxes: [
        {
          title: "Dynamic Pricing",
          description:
            "The strike price adjusts based on supply and demand. Consider that in your bidding!",
          variant: "yellow",
        },
        {
          title: "Strategic Bidding",
          description:
            "Keep an eye on the strike prices and demand. In the last phase we sell the rest of the tickets via auctions for the rest of the tickets.",
          variant: "yellow",
        },
      ],
    },
    auctionV2: {
      title: "Get ready for Auction 2!",
      description:
        "Enter your bid at least as high as the leaderboard entry price to compete.",
      price,
      infoBoxes: [
        {
          title: "Aim Higher",
          description:
            "We recommend placing your bid within the top two-thirds of all bidders to increase your chances.",
          variant: "yellow",
        },
        {
          title: "Last Opportunity",
          description:
            "This is your final chance to secure a ticket through direct bidding. After this, your next option will be the secondary market for auctioned tickets.",
          variant: "yellow",
        },
      ],
    },
  };
  const depositData =
    depositContentPerSale?.[currentTabId] || depositContentPerSale["lotteryV1"];
  const [isLoading, setIsLoading] = useState(false);
  const [enteredValue, setEnteredValue] = useState(
    defaultValue ? defaultValue : "",
  );
  const { connectWallet, isConnected } = useConnectWallet();

  const onValueChange = (e) => {
    setEnteredValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (enteredValue) {
      setIsLoading(true);
      await onDepositHandler(+enteredValue);
    }
    setIsLoading(false);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={"#E5E5E5"} rounded="20px" pb={8}>
        <ModalHeader
          textTransform={"uppercase"}
          fontWeight={"bold"}
          fontSize={"1rem"}
        >
          Deposit
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} gap={4}>
          {isConnected && (
            <Flex flexDirection={"column"} gap={4} textAlign={"center"}>
              <Text
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"1.5rem"}
              >
                {depositData.title}
              </Text>
              <Flex
                flexDirection={"column"}
                gap={4}
                bg={"#EFEFEF"}
                rounded={"1rem"}
                px={4}
                py={6}
              >
                <Text>{depositData.description}</Text>
                <Flex
                  flexDirection={"column"}
                  alignItems={"center"}
                  fontWeight={"bold"}
                >
                  <Text fontSize={"1.5rem"}> {depositData.price}</Text>
                  <Text>Start price</Text>
                </Flex>
                <InputGroup>
                  <Input
                    type={"number"}
                    placeholder={`Enter minimum ${depositData.price}`}
                    value={enteredValue}
                    onChange={onValueChange}
                    bg={"#fff"}
                    borderColor={"#ACABAB"}
                    rounded={"24px"}
                    py={2}
                  />
                  <InputRightElement
                    pointerEvents="none"
                    color="black"
                    fontSize="1.2em"
                  >
                    $
                  </InputRightElement>
                </InputGroup>

                <Button
                  variant={"black"}
                  h={"48px"}
                  onClick={handleSubmit}
                  isLoading={isLoading}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          )}
          {!isConnected && (
            <Button
              fontWeight={"600"}
              bg={"rgba(151, 71, 255, 1)"}
              color={"#fff"}
              px={"1.5rem"}
              py={"1rem"}
              rounded={"8px"}
              onClick={connectWallet}
              alignSelf={"center"}
              my={6}
            >
              Connect wallet
            </Button>
          )}
        </ModalBody>

        {isConnected && (
          <ModalFooter>
            <Flex flexDirection={"column"} gap={2} fontSize={"14px"}>
              {depositData.infoBoxes.map((item, idx) => <InfoCard key={idx} {...item}/>)}
            </Flex>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};


const InfoCard = ({title, description, variant}) => {
  const bg = variant === "yellow" ? "#FFFACD" : "#87CEEB";
  const color = variant === "yellow" ? "#6157FF" : "#000";
  return <Flex
      bg={bg}
      color={color}
      flexDirection={"column"}
      p={4}
      rounded={"2px"}
  >
    <Text fontWeight={"bold"}>{title}</Text>
    <Text>{description}</Text>
  </Flex>
}