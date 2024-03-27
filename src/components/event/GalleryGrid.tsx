import { Flex, Grid, GridItem, Box, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";

interface IProps {
  images?: string[];
}

export const GalleryGrid = ({ images }: IProps) => {
  const [isMobile] = useMediaQuery("(max-width: 767px)");
  const radiusObj = {
    2: {
      borderTopRightRadius: "24px",
    },
    4: {
      borderBottomRightRadius: "24px",
    },
  } as any;

  return (
    <Flex gap={"24px"} flexDirection={{ base: "column", md: "row" }}>
      <Flex
        w={{ base: "100%", md: "80%" }}
        maxH={{ base: "500px", md: "none" }}
        overflow={"hidden"}
        borderBottomLeftRadius={{ base: "none", md: "24px" }}
        borderTopLeftRadius={{ base: "none", md: "24px" }}
      >
        <Image
          src={`/images/event1.png`}
          alt={`event1 image`}
          layout="responsive"
          width={400}
          height={400}
        />
      </Flex>
      <Grid
        w={"100%"}
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
        gap={4}
      >
        {Array.from({ length: 4 }, (_, idx) => {
          const key = String(idx + 1);
          const radiusStyles = radiusObj[key];
          return (
            <GridItem key={idx}>
              <Box
                w={"100%"}
                h={"0"}
                pb={"100%"}
                position="relative"
                {...(!!radiusStyles && !isMobile ? radiusStyles : null)}
                overflow={"hidden"}
              >
                <Image
                  src={`/images/event${idx % 2 !== 0 ? 1 : 2}.png`}
                  alt={`event${idx % 2 !== 0 ? 1 : 2} image`}
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
            </GridItem>
          );
        })}
      </Grid>
    </Flex>
  );
};
