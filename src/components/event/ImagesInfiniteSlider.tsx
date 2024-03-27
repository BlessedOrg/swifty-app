import Slider from "react-infinite-logo-slider";
import Image from "next/image";
import { Flex } from "@chakra-ui/react";

export const ImagesInfiniteSlider = () => {
  const images = [
    "/images/sponsors/astria.png",
    "/images/sponsors/mantle.png",
    "/images/sponsors/risczero.png",
    "/images/sponsors/signature.png",
    "/images/sponsors/largan.png",
    "/images/sponsors/spartan.png",
    "/images/sponsors/hyperlane.png",
    "/images/sponsors/espresso.png",
  ];
  return (
    <Flex my={10}>
      <Slider
        width="200px"
        duration={40}
        pauseOnHover={false}
        blurBorders={false}
      >
        {images.map((i, idx) => {
          return (
            <Slider.Slide key={idx}>
              <Flex justifyContent={"center"} w={"100%"} mr={10}>
                <Image
                  width={200}
                  height={75}
                  style={{
                    objectFit: "cover",
                    width: "auto",
                    height: "auto",
                  }}
                  src={i}
                  alt="any"
                  className="w-36"
                />
              </Flex>
            </Slider.Slide>
          );
        })}
      </Slider>
    </Flex>
  );
};
