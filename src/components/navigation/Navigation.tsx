import {
  Button,
  Flex,
  Grid,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer/Footer";
import { LoginButton } from "@/components/navigation/LoginButton";
import { Menu, Moon, SunMoon, X } from "lucide-react";

interface IProps {
  children: ReactNode;
}

const navigationItems = {
  middleSide: [
    { title: "Concerts", path: "/concerts" },
    {
      title: "Conference",
      path: "/conference",
    },
    { title: "Events", path: "/events" },
  ],
  rightSide: [
    { title: "Create Event", path: "/createEvent" },
    {
      title: "Sign Up",
      path: "/signup",
    },
  ],
};
export const Navigation = ({ children }: IProps) => {
  const NAV_HEIGHT = "85px";
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 1023px)");
  const navbarColor = useColorModeValue("#fdfeff", "#242424");
  const { colorMode, toggleColorMode } = useColorMode();

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };
  return (
    <Flex
      w={"100%"}
      justifyContent={"center"}
      px={{ base: "1rem", lg: "2rem" }}
    >
      <Flex flexDirection={"column"} w={"100%"} maxW={"1680px"} mt={"8rem"}>
        <Grid
          h={NAV_HEIGHT}
          pos={"fixed"}
          top={0}
          left={0}
          bg={navbarColor}
          gridTemplateColumns={{
            base: "minmax(102px, 1fr) 1fr",
            xl: "minmax(102px, 1fr) 1fr 1fr",
          }}
          w={"100%"}
          justifyContent={"space-between"}
          py={{
            base: "1rem",
            lg: "2rem",
          }}
          gap={8}
          px={{ base: "1rem", lg: "2rem" }}
          zIndex={100}
        >
          <Link href={"/"} onClick={isMobile ? toggleMobileNav : undefined}>
            <Image
              src={"/images/logo/logo-vector.svg"}
              alt={"ticket logo"}
              width={102}
              height={50}
            />
          </Link>

          {!isMobile && (
            <Flex gap={"2rem"} alignItems={"center"} justifyContent={"center"}>
              {navigationItems.middleSide.map((item, idx) => {
                return (
                  <Link key={idx} href={item.path}>
                    {item.title}
                  </Link>
                );
              })}
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
                {navigationItems.rightSide.map((item, idx) => {
                  return (
                    <Link key={idx} href={item.path}>
                      {item.title}
                    </Link>
                  );
                })}
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
        {children}
        <Footer />
      </Flex>
      {isMobile && (
        <Flex
          pos={"fixed"}
          bg={navbarColor}
          h={"100%"}
          w={"100%"}
          zIndex={100}
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
            {navigationItems.middleSide.map((item, idx) => {
              return (
                <Link key={idx} href={item.path} onClick={toggleMobileNav}>
                  {item.title}
                </Link>
              );
            })}
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
