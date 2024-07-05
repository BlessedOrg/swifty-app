"use client";
import {
  Button,
  Flex,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useToast,
  Menu,
} from "@chakra-ui/react";
import { shortenWalletAddress } from "@/utils/shortenWalletAddress";
import { RandomAvatar } from "@/components/profile/personalInformation/avatar/RandomAvatar";
import {
  AutoConnect,
  ConnectButton_connectButtonOptions,
  useActiveAccount,
} from "thirdweb/react";
import { login, checkIsLoggedIn, logout } from "@/server/auth";
import { createWallet } from "thirdweb/wallets";
import { useUserContext } from "@/store/UserContext";
import { useConnect } from "thirdweb/react";
import { client } from "../../lib/client";
import { activeChainForThirdweb } from "../../services/web3Config";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import {MyTicketsModal} from "@/components/myTickets/MyTicketsModal";

export const supportedWallets = [createWallet("io.metamask")];

interface ILoginButtonProps {
  connectButton?: ConnectButton_connectButtonOptions;
}

export const LoginButton = ({ connectButton }: ILoginButtonProps) => {
  //states
  const [isTicketsModal, setIsTicketsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //toggle functions
  const toggleTicketsModalState = () => setIsTicketsModal((prev) => !prev);

  //thirdweb hooks
  const activeAccount = useActiveAccount();
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveWallet();
  const { connect } = useConnect();

  //other hooks
  const { walletAddress, isLoggedIn, mutate, tickets, events } = useUserContext();
  const toast = useToast();

  //functions
  const loginAndConnectUser = async () => {
    setIsLoading(true);
    const connectedWallet = await connect(async () => {
      const wallet = createWallet("io.metamask");
      await wallet.connect({ chain: activeChainForThirdweb, client });
      return wallet;
    });
    if (connectedWallet) {
      const acc = connectedWallet.getAccount();
      if (acc) {
        try {
          await acc.signMessage({
            message: "Sign in transaction to log into our app!",
          });
          toast({
            title: "Sign message success!",
            description: "Log in...",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } catch (e) {
          const errorInstance = e as any;
          toast({
            title: "Sign message error!",
            description: errorInstance.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsLoading(false);
          return;
        }
        const loginStatus = await login(acc.address);
        if (loginStatus) {
          const isLoggedInn = await checkIsLoggedIn(
            acc.address,
            loginStatus.token,
          );
          if (isLoggedInn) {
            mutate();
          }
        }
      }
    } else {
      toast({
        title: "Failed to connect wallet",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };
  const onLogOut = async () => {
    await logout(walletAddress);
    if (activeWallet) {
      disconnect(activeWallet);
    }
    window.location.reload();
  };

  const initalLoginChecker = async() => {
    const res = await checkIsLoggedIn(activeAccount?.address);
    if(res){
      mutate();
    }
    setIsLoading(false)
  }
  useEffect(() => {
    initalLoginChecker()
  }, [activeAccount]);
  return (
    <Flex>
      {!isLoggedIn && (
        <Button isLoading={isLoading} onClick={loginAndConnectUser} colorScheme={'green'} px={8} rounded={'1.5rem'}>
          Login
        </Button>
      )}
      {isLoggedIn && (
        <Menu>
          <MenuButton>
            <Button
              fontWeight={"600"}
              bg={"transparent"}
              color={"#000"}
              px={"0"}
              border={"1px solid black"}
              rounded={"50px"}
              fontSize={{
                base: "0.8rem",
                lg: "1rem",
              }}
              display={"flex"}
              alignItems={"center"}
              isLoading={!walletAddress}
              minW={"120px"}
            >
              <Flex transform={"scale(0.92)"} transformOrigin={"right"}>
                <RandomAvatar
                  username={
                    isLoggedIn && walletAddress ? walletAddress : undefined
                  }
                  width={36}
                  height={36}
                  rounded
                  lighter
                />
              </Flex>
              <Text pl={2} pr={3}>
                {shortenWalletAddress(walletAddress)}
              </Text>
            </Button>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Flex gap={2} alignItems={"center"}>
                <Flex transform={"scale(0.92)"} transformOrigin={"right"}>
                  <RandomAvatar
                    username={
                      isLoggedIn && walletAddress ? walletAddress : undefined
                    }
                    width={36}
                    height={36}
                    rounded
                    lighter
                  />
                </Flex>
                <Text pl={2} pr={3}>
                  {shortenWalletAddress(walletAddress)}
                </Text>
              </Flex>
            </MenuItem>
            <MenuItem as={Link} href={"/profile"}>
              My Profile
            </MenuItem>
            {!!events &&
              <MenuItem as={Link} href={"/event/created"}>
                My Events
              </MenuItem>
            }
            {!!tickets?.length && (
              <MenuItem onClick={toggleTicketsModalState}>My Tickets</MenuItem>
            )}
            <MenuItem as={Link} href={"/event/create"}>Create Event</MenuItem>
            <MenuDivider />
            <MenuItem onClick={onLogOut}>Logout</MenuItem>
          </MenuList>
        </Menu>
      )}
      <MyTicketsModal
        isOpen={isTicketsModal}
        onClose={toggleTicketsModalState}
        tickets={tickets || null}
        isLoading={isLoading}
      />
      <AutoConnect
          client={client}
          timeout={10000}
          wallets={supportedWallets}
      />
    </Flex>
  );
};
