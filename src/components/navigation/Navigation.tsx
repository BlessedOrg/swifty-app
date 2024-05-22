import {
  Button,
  Flex,
  Grid,
  Text,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer/Footer";
import { LoginButton } from "@/components/navigation/LoginButton";
import { Menu, Moon, SunMoon, X } from "lucide-react";
import { useConnectWallet } from "@/hooks/useConnect";
import { useSetIsWalletModalOpen } from "@thirdweb-dev/react";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";

interface IProps {
  children: ReactNode;
}

const logoPath = "/images/logo/logo-light.png";
export const Navigation = ({ children }: IProps) => {
  const pathname = usePathname();
  const isHomepage = pathname === "/" || pathname === "";
  const { events } = useUser();

  const { isConnected } = useConnectWallet();
  const setIsModalWalletOpen = useSetIsWalletModalOpen();
  const NAV_HEIGHT = "85px";
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 1023px)");
  const navbarColor = useColorModeValue("#fdfeff", "#242424");
  const { colorMode, toggleColorMode } = useColorMode();

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

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
        h={!isMobile ? "129px" : "unset"}
      >
        <Grid
          gridTemplateColumns={{
            base: "minmax(102px, 1fr) 1fr",
            xl: isScrolled
              ? "minmax(102px, 1fr) 1fr"
              : !isMobile
                ? "minmax(102px, 1fr) 1fr 1fr"
                : "minmax(102px, 1fr) 1fr",
          }}
          w={"100%"}
          justifyContent={"space-between"}
          py={{
            base: "1rem",
            lg: "2rem",
          }}
          gap={8}
          px={{ base: "1rem", lg: "2rem" }}
        >
          <Flex pos={"relative"} overflow={"hidden"}  alignItems={'center'}>
            <Link
              href={"/"}
              onClick={isMobile ? toggleMobileNav : undefined}
              style={{
                position: "absolute",
                top: isScrolled ? "-300%" : "50%",
                left: 0,
                transition: "all 250ms",
                transform: "translateY(-50%)",
              }}
            >
              <Image
                src={"/images/logo/heart.svg"}
                alt={"ticket logo"}
                width={120}
                height={120}
                style={{
                  width: "auto",
                  height: "48px",
                }}
              />
            </Link>

            <Link
              href={"/"}
              onClick={isMobile ? toggleMobileNav : undefined}
              style={{
                position: "absolute",
                bottom: !isScrolled ? "-300%" : "0%",
                left: 0,
                transition: "all 250ms",
              }}
            >
              <Image
                src={logoPath}
                alt={"ticket logo"}
                width={345}
                height={132}
                style={{
                  width: "auto",
                  height: "48px",
                }}
              />
            </Link>
          </Flex>
          {!isScrolled && !isMobile && (
            <Flex justifyContent={"center"}>
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
          >
            {!isMobile && (
              <>
                {isConnected && !!events && (
                  <Link href={"/event/created"}>
                    My Events{" "}
                    <Text as={"span"} fontWeight={"bold"} fontSize={"0.9rem"}>
                      ({events})
                    </Text>
                  </Link>
                )}
                {(!isScrolled || !isHomepage) && (
                  <Link href={"/event/create"}>Create Event</Link>
                )}
                <LoginButton />
              </>
            )}
            {isMobile &&
              (isMobileNavOpen ? (
                <X cursor={"pointer"} onClick={toggleMobileNav} />
              ) : (
                <Menu cursor={"pointer"} onClick={toggleMobileNav} />
              ))}
          </Flex>
        </Grid>
      </Flex>
      {children}
      <Footer />
      {isMobile && (
        <Flex
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
                My Events{" "}
                <Text as={"span"} fontWeight={"bold"} fontSize={"0.9rem"}>
                  ({events})
                </Text>
              </Link>
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
      )}
    </Flex>
  );
};
