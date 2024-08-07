import { Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useAmountWarnings } from "@/hooks/useAmountWarnings";
import { shakeWithResize, smallScale } from "../../../../keyframes/keyframes";
import { RandomAvatar } from "@/components/profile/personalInformation/avatar/RandomAvatar";
import { useUserContext } from "@/store/UserContext";
import { ReactNode } from "react";
import { LoadingDots } from "@/components/ui/LoadingDots";
import Link from "next/link";

interface IProps {
  userData: any;
  onToggleDepositViewHandler: () => void;
  isConnected: boolean;
  mintEnabled: boolean;
  depositEnabled: boolean;
  currentSelectedTabId: any;
  activeSaleData: any;
  isLotteryEnded: boolean;
  onMint: any;
  userWonInPrevSale: boolean;
  isCurrentTabSaleEnded: boolean;
  isSeller: boolean;
  children?: ReactNode;
  lockDeposit: boolean;
  isLoading: boolean;
  eventId: string;
}

export const LotterySidebar = ({
  userData,
  onToggleDepositViewHandler,
  mintEnabled,
  depositEnabled,
  activeSaleData,
  isLotteryEnded,
  onMint,
  currentSelectedTabId,
  userWonInPrevSale,
  isCurrentTabSaleEnded,
  isSeller,
  children,
  lockDeposit,
  isLoading,
  eventId,
}: IProps) => {
  const { isLoggedIn } = useUserContext();

  const { currentTabPriceWarnings } = useAmountWarnings(
    activeSaleData,
    userData,
    currentSelectedTabId,
    isLoggedIn,
  );
  return (
    <Flex
      display={!isLoggedIn ? "none" : "flex"}
      flexDirection={"column"}
      rounded={"1rem"}
      pl={{ base: 1, iwMid: 2 }}
      py={{ base: 1, iwMid: 5 }}
      minH={{ base: "200px", iwMid: "330px", iw: "600px" }}
      maxH={{ base: "225px", iwMid: "none" }}
      color={"#000"}
      minW={"280px"}
      overflowY={"auto"}
      bg={"rgba(255, 255, 255, 0.4)"}
    >
      <Flex flexDirection={"column"} gap={{ base: 1, iwMid: 4 }}>
        <Flex gap={4} alignItems={"center"} px={4}>
          <Flex
            rounded={"100%"}
            overflow={"hidden"}
            w={{ base: "40px", iwMid: "52px" }}
            h={{ base: "40px", iwMid: "52px" }}
          >
            <RandomAvatar username={userData?.walletAddress ?? undefined} />
          </Flex>
          <Flex flexDirection={"column"} gap={1}>
            <Text
              fontSize={{ base: "14px", iwMid: "17px" }}
              fontWeight={"bold"}
            >
              {userData.username}
            </Text>
            <Text fontSize={{ base: "12px", iwMid: "14px" }}>
              {activeSaleData?.userFunds || 0}$ Balance
            </Text>
          </Flex>
        </Flex>
        <Flex
          justifyContent={"center"}
          flexDirection={"column"}
          alignItems={"center"}
          textAlign={"center"}
          mt={{ base: "0.5rem", iw: "2.5rem" }}
          mb={{ base: "0rem", iw: "1.5rem" }}
          visibility={isLoading ? "hidden" : "visible"}
        >
          <Text
            fontWeight={"bold"}
            fontSize={{ base: "1.5rem", iwMid: "3rem" }}
          >
            {activeSaleData?.price ? `${activeSaleData.price}$` : "0$"}
          </Text>
          {!isSeller && (
            <Text
              color={
                activeSaleData?.isWinner && isLoggedIn
                  ? "#6157FF"
                  : currentTabPriceWarnings?.isWarning && !isLotteryEnded
                    ? "#F90"
                    : "#000"
              }
              fontWeight={"bold"}
            >
              {currentTabPriceWarnings.priceLabel}
            </Text>
          )}
        </Flex>
      </Flex>
      {isLoading && (
        <Flex justifyContent={"center"}>
          <LoadingDots />
        </Flex>
      )}
      <Flex
        flexDirection={"column"}
        gap={{ base: 2, iwMid: 4 }}
        justifyContent={"space-between"}
        h={"100%"}
        visibility={isLoading ? "hidden" : "visible"}
      >
        {isSeller ? (
          <Flex
            flexDirection={"column"}
            gap={2}
            alignItems={"center"}
            pl={3}
            pr={5}
          >
            {children}
            <Button as={Link} href={`/event/${eventId}/dashboard`} colorScheme={'purple'} w={'100%'} mt={2} rounded={'1.5rem'}>
              Dashboard
            </Button>
          </Flex>
        ) : (
          <Flex
            flexDirection={"column"}
            gap={{ base: 2, iwMid: 4 }}
            alignItems={"center"}
            overflow={"hidden"}
            py={2}
          >
            {mintEnabled && isLoggedIn ? (
              <Button
                animation={`${smallScale} infinite 1s ease-in-out`}
                variant={"blue"}
                onClick={onMint}
                minW={"230px"}
                maxW={"260px"}
                w={"100%"}
                h={{ base: "40px", iw: "52px" }}
                fontSize={{ base: "0.9rem", iwMid: "1rem" }}
              >
                Mint
              </Button>
            ) : activeSaleData?.isWinner ? null : (
              <Tooltip
                label={
                  lockDeposit
                    ? "You have already deposited funds for this phase."
                    : isLotteryEnded
                      ? "Sale is finished"
                      : isCurrentTabSaleEnded
                        ? "This sale is finished"
                        : userWonInPrevSale
                          ? "You already win in previous sale."
                          : !depositEnabled
                            ? "Deposit is locked. Seller have to start sale."
                            : null
                }
              >
                <Button
                  animation={
                    currentTabPriceWarnings?.isWarning && depositEnabled
                      ? `${shakeWithResize} infinite 1s ease-in-out`
                      : undefined
                  }
                  isDisabled={!depositEnabled || isLotteryEnded || lockDeposit}
                  variant={"black"}
                  onClick={onToggleDepositViewHandler}
                  minW={"230px"}
                  maxW={"260px"}
                  w={"100%"}
                  h={{ base: "40px", iw: "52px" }}
                  fontSize={{ base: "0.9rem", iwMid: "1rem" }}
                >
                  {currentTabPriceWarnings.depositLabel}
                </Button>
              </Tooltip>
            )}
            <Text fontSize={"14px"} textAlign={"center"}>
              To participate, deposit funds for each active phase.
              <br /> <br /> Deposits are refunded after each phase. <br />
              Prize amounts are deducted for winners. Refunds are automatic.
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
