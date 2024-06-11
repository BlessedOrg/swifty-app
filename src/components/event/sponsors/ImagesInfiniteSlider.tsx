import Slider from "react-infinite-logo-slider";
import Image from "next/image";
import { Flex, Grid, useMediaQuery, Text } from "@chakra-ui/react";

export const ImagesInfiniteSlider = () => {
  const platinumSponsors = sponsorsData.filter((i) => i.level === 1);
  const goldSponsors = sponsorsData.filter((i) => i.level === 2);
  const silverSponsors = sponsorsData.filter((i) => i.level === 3);

  const [isMobile] = useMediaQuery("(max-width: 767px)");

  return (
    <Flex
      my={10}
      maxW={"1280px"}
      mx={"auto"}
      w={"100%"}
      flexDirection={"column"}
      gap={6}
      px={2}
    >
      {!isMobile &&
        sponsorsData.map(function (sponsor: any, key: number) {
          return (
            <Flex flexDirection={"column"} gap={4}>
              <Text textTransform={"uppercase"} fontWeight={"bold"}>
                {sponsor.label}
              </Text>
              <Flex
                flexWrap={"wrap"}
                mx={"auto"}
                alignItems={"center"}
                mb={4}
                w={"100%"}
                justifyContent={"center"}
              >
                {sponsor.elements.map(function (element: any, index: number) {
                  return (
                    <Flex
                      flexBasis={{
                        base: `${(3 / 12) * 100}%`,
                        lg: `${(sponsor.grid / 12) * 100}%`,
                      }}
                      p={sponsor.gap}
                      key={index}
                    >
                      <a
                        href={element.url}
                        target={"_blank"}
                        style={{ width: "100%" }}
                      >
                        <Image
                          width={300}
                          height={300}
                          src={element.logo}
                          alt={element.title}
                          style={{ maxHeight: `${sponsor.size}px`, width: "auto" }}
                          className={`mx-auto`}
                        />
                      </a>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          );
        })}
      {isMobile &&
        platinumSponsors.map(function (sponsor: any, key: number) {
          return (
            <Flex flexDirection={"column"} gap={4} key={key}>
              <Text textTransform={"uppercase"} fontWeight={"bold"}>
                {sponsor.label}
              </Text>
              <Flex
                flexWrap={"wrap"}
                mx={"auto"}
                alignItems={"center"}
                key={key}
                w={"100%"}
                justifyContent={"center"}
              >
                {sponsor.elements.map(function (element: any, index: number) {
                  return (
                    <Flex
                      flexBasis={{
                        base: `${(6 / 12) * 100}%`,
                        lg: `${(sponsor.grid / 12) * 100}%`,
                      }}
                      p={sponsor.gap}
                      key={index}
                    >
                      <a
                        href={element.url}
                        target={"_blank"}
                        style={{ width: "100%" }}
                      >
                        <Image
                            width={300}
                            height={300}
                            src={element.logo}
                            alt={element.title}
                            style={{ maxHeight: `${sponsor.size}px`, width: "auto" }}
                            className={`mx-auto`}
                        />
                      </a>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          );
        })}
      {isMobile &&
        [...goldSponsors, ...silverSponsors].map((i) => {
          return (
            <Flex flexDirection={"column"} gap={4}>
              <Text textTransform={"uppercase"} fontWeight={"bold"}>
                {i.label}
              </Text>
              <Slider
                width="200px"
                duration={40}
                pauseOnHover={false}
                blurBorders={false}
              >
                {i.elements.map((element, idx) => (
                  <Slider.Slide key={idx}>
                    <Flex justifyContent={"center"} w={"100%"} mr={10}>
                      <a
                        href={element.url}
                        target={"_blank"}
                        style={{ width: "100%" }}
                      >
                        <Image
                            width={300}
                            height={300}
                            src={element.logo}
                            alt={element.title}
                            style={{ maxHeight: `${i.size}px`, width: "auto" }}
                            className={`mx-auto`}
                        />
                      </a>
                    </Flex>
                  </Slider.Slide>
                ))}
              </Slider>
            </Flex>
          );
        })}
    </Flex>
  );
};
export const sponsorsData = [
  {
    level: 1,
    grid: 3,
    gap: 4,
    size: 150,
    label: "Platinum",
    elements: [
      {
        url: "/",
        title: "Astria",
        logo: "/images/sponsors/astria.png",
      },
      {
        url: "/",
        title: "Anoma",
        logo: "/images/sponsors/anoma.png",
      },
      {
        url: "/",
        title: "Initia",
        logo: "/images/sponsors/initia.png",
      },
      {
        url: "/",
        title: "Hyperlane",
        logo: "/images/sponsors/hyperlane.png",
      },
    ],
  },
  {
    level: 2,
    grid: 2,
    gap: 3,
    size: 40,
    label: "Gold",
    elements: [
      {
        url: "/",
        title: "Hashflow",
        logo: "/images/sponsors/hashflow.png",
      },
      {
        url: "/",
        title: "Manta Network",
        logo: "/images/sponsors/manta-network.png",
      },
      {
        url: "/",
        title: "Polymer",
        logo: "/images/sponsors/polymer.png",
      },
      {
        url: "/",
        title: "Movement",
        logo: "/images/sponsors/movement.png",
      },
      {
        url: "/",
        title: "Cartesi",
        logo: "/images/sponsors/cartesi.png",
      },
      {
        url: "/",
        title: "Union",
        logo: "/images/sponsors/union.png",
      },
      {
        url: "/",
        title: "Morph",
        logo: "/images/sponsors/morph.png",
      },
      {
        url: "/",
        title: "Li.Fi",
        logo: "/images/sponsors/lifi.png",
      },
      {
        url: "/",
        title: "Drop",
        logo: "/images/sponsors/drop.png",
      },
    ],
  },
  {
    level: 3,
    grid: 2,
    gap: 5,
    size: 20,
    label: "Silver",
    elements: [
      {
        url: "/",
        title: "Barter",
        logo: "/images/sponsors/barter.svg",
      },
      {
        url: "/",
        title: "Lagrange",
        logo: "/images/sponsors/lagrange.png",
      },
      {
        url: "/",
        title: "Fluent",
        logo: "/images/sponsors/fluent.png",
      },
      {
        url: "/",
        title: "Argus Labs",
        logo: "/images/sponsors/argus-labs.png",
      },
      {
        url: "/",
        title: "Dora",
        logo: "/images/sponsors/dora.png",
      },
      {
        url: "/",
        title: "Optimism",
        logo: "/images/sponsors/optimism.png",
      },
      {
        url: "/",
        title: "Arbitrum",
        logo: "/images/sponsors/arbitrum.png",
      },
      {
        url: "/",
        title: "zkSync",
        logo: "/images/sponsors/zksync.png",
      },
      {
        url: "/",
        title: "Tokonomy",
        logo: "/images/sponsors/tokonomy.png",
      },
      {
        url: "/",
        title: "Citrea",
        logo: "/images/sponsors/citrea.png",
      },
      {
        url: "/",
        title: "Penumbra",
        logo: "/images/sponsors/penumbra.png",
      },
      {
        url: "/",
        title: "Socket",
        logo: "/images/sponsors/socket.png",
      },
      {
        url: "/",
        title: "Kr1",
        logo: "/images/sponsors/kr1.png",
      },
      {
        url: "/",
        title: "Envio",
        logo: "/images/sponsors/envio.png",
      },
      {
        url: "/",
        title: "Spartan",
        logo: "/images/sponsors/spartan.svg",
      },
      {
        url: "/",
        title: "Noble",
        logo: "/images/sponsors/noble.png",
      },
      {
        url: "/",
        title: "Skip",
        logo: "/images/sponsors/skip.png",
      },
      {
        url: "/",
        title: "Finoa",
        logo: "/images/sponsors/finoa.png",
      },
      {
        url: "/",
        title: "01 Node",
        logo: "/images/sponsors/01Node.png",
      },
      {
        url: "/",
        title: "DoraHacks",
        logo: "/images/sponsors/Dorahacks.png",
      },
      {
        url: "/",
        title: "Signature Ventures",
        logo: "/images/sponsors/signature-ventures.png",
      },
      {
        url: "/",
        title: "Gelato",
        logo: "/images/sponsors/gelato.png",
      },
      {
        url: "/",
        title: "Espresso",
        logo: "/images/sponsors/espresso.png",
      },
      {
        url: "/",
        title: "Nuffle Labs",
        logo: "/images/sponsors/nuffle.png",
      },
    ],
  },
];
