import {
  Button,
  Flex,
  Grid,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer/Footer";
import { LoginButton } from "@/components/navigation/LoginButton";
import { Menu, Moon, SunMoon, X } from "lucide-react";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../../requests/requests";
import { MyTicketsModal } from "@/components/myTickets/MyTicketsModal";
import { useUserContext } from "@/store/UserContext";

interface IProps {
  children: ReactNode;
}

const logoPath = "/images/logo/logo-light.png";
export const Navigation = ({ children }: IProps) => {
  const [isTicketsModal, setIsTicketsModal] = useState(false);
  const toggleModalState = () => setIsTicketsModal((prev) => !prev);
  const pathname = usePathname();
  const isHomepage =
    pathname === "/deletethispathlater" || pathname === "deletethispathlater";
  const { events, isLoggedIn: isConnected } = useUserContext();
  const { data, isLoading } = useSWR(
    isConnected ? "/api/user/myTickets" : null,
    fetcher,
  );
  const tickets = data?.mints || [];

  const NAV_HEIGHT = "85px";
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navbarColor = useColorModeValue("#fdfeff", "#242424");
  const { colorMode, toggleColorMode } = useColorMode();
  const toggleMobileNav = () => setIsMobileNavOpen((prev) => !prev);

  const navigationItems = {
    rightSide: [{ title: "Create Event", path: "/event/create" }],
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 5;
      const scrollY = window.scrollY;
      const pageHeight = document.body.clientHeight - (isScrolled ? 300 : 0);

      if (scrollY >= scrollThreshold && !isScrolled) {
        setIsScrolled(true);
      } else if (scrollY < scrollThreshold && isScrolled) {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  return (
    <Flex
      w={"100%"}
      flexDirection={"column"}
      justifyContent={"center"}
      pos={"relative"}
      gap={6}
    >
      <Flex
        w={"100%"}
        pos={"sticky"}
        top={0}
        zIndex={5}
        bg={navbarColor}
        flexDirection={"column"}
        transition={"all 250ms"}
        h={{ base: "85px", xl: "129px" }}
      >
        <Grid
          gridTemplateColumns={{
            base: "minmax(102px, 1fr) auto",
            xl: isScrolled
              ? "minmax(102px, 1fr) 1fr"
              : "minmax(102px, 1fr) 1fr 1fr",
          }}
          w={"100%"}
          justifyContent={"space-between"}
          py={{
            base: "0.5rem",
            xl: "2rem",
          }}
          gap={8}
          px={{ base: "1rem", lg: "2rem" }}
          h={"100%"}
        >
          <Flex pos={"relative"} overflow={"hidden"} alignItems={"center"}>
            <Link
              href={"/"}
              style={{
                position: "absolute",
                top: isScrolled ? "-300%" : "50%",
                left: 0,
                transition: "all 250ms",
                transform: "translateY(-50%)",
              }}
            >
              <Image
                src={"/images/logo/heart.png"}
                alt={"ticket logo"}
                width={120}
                height={120}
                style={{
                  width: "auto",
                  height: "80px",
                }}
              />
            </Link>

            <Link
              href={"/"}
              style={{
                position: "absolute",
                bottom: !isScrolled ? "-300%" : "50%",
                left: 0,
                transition: "all 250ms",
                transform: "translateY(50%)",
              }}
            >
              <Image
                src={logoPath}
                alt={"ticket logo"}
                width={345}
                height={132}
                style={{
                  width: "auto",
                  height: "80px",
                }}
              />
            </Link>
          </Flex>
          {!isScrolled && (
            <Flex
              justifyContent={"center"}
              display={{ base: "none", xl: "flex" }}
            >
              <Image
                src={"/images/logo/workmark.svg"}
                alt={"ticket logo"}
                width={300}
                height={120}
                style={{
                  width: "auto",
                  height: "65px",
                }}
              />
            </Flex>
          )}
          <Flex
            gap={"2rem"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            minW={"max-content"}
            display={{ base: "none", xl: "flex" }}
          >
            {isConnected && !!events && (
              <Link href={"/event/created"}>
                My events{" "}
                <Text as={"span"} fontWeight={"bold"} fontSize={"0.9rem"}>
                  ({events})
                </Text>
              </Link>
            )}
            {isConnected && !!tickets?.length && (
              <Text as={"button"} onClick={toggleModalState}>
                My tickets{" "}
                <Text as={"span"} fontWeight={"bold"} fontSize={"0.9rem"}>
                  ({tickets.length})
                </Text>
              </Text>
            )}
            {(!isScrolled || !isHomepage) && (
              <Link href={"/event/create"}>Create event</Link>
            )}
            <LoginButton />
          </Flex>
          <Flex
            gap={"2rem"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            minW={"max-content"}
            display={{ base: "flex", xl: "none" }}
          >
            {isMobileNavOpen ? (
              <X cursor={"pointer"} onClick={toggleMobileNav} />
            ) : (
              <Menu cursor={"pointer"} onClick={toggleMobileNav} />
            )}
          </Flex>
        </Grid>
      </Flex>
      {children}
      <Footer />
      <Flex
        display={{ base: "flex", xl: "none" }}
        pos={"fixed"}
        bg={navbarColor}
        h={"100%"}
        w={"100%"}
        zIndex={8}
        top={NAV_HEIGHT}
        left={isMobileNavOpen ? "0" : "-100%"}
        transition={"all"}
        transitionDuration={"150ms"}
        justifyContent={"center"}
        py={"2rem"}
        overflowY={"auto"}
        textAlign={"center"}
      >
        <Flex flexDirection={"column"} gap={4}>
          {isConnected && !!events && (
            <Link href={"/event/created"}>
              My events{" "}
              <Text as={"span"} fontWeight={"bold"} fontSize={"0.9rem"}>
                ({events})
              </Text>
            </Link>
          )}
          {isConnected && !!tickets?.length && (
            <Text as={"button"} onClick={toggleModalState}>
              My tickets{" "}
              <Text as={"span"} fontWeight={"bold"} fontSize={"0.9rem"}>
                ({tickets.length})
              </Text>
            </Text>
          )}
          {navigationItems.rightSide.map((item, idx) => {
            return (
              <Link key={idx} href={item.path} onClick={toggleMobileNav}>
                {item.title}
              </Link>
            );
          })}
          <LoginButton />
          <Button onClick={toggleColorMode} mt={4}>
            {colorMode === "light" ? <Moon /> : <SunMoon />}
          </Button>
        </Flex>
      </Flex>
      <MyTicketsModal
        isOpen={isTicketsModal}
        onClose={toggleModalState}
        tickets={tickets || null}
        isLoading={isLoading}
      />
    </Flex>
  );
};
