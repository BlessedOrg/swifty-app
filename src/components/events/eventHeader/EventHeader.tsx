import { Button, Flex, useMediaQuery } from "@chakra-ui/react";
import { TypeAnimation } from "react-type-animation";
import { EventFilters } from "@/components/events/eventHeader/eventFilters/EventFilters";
import { Suspense, useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FiltersModal } from "@/components/events/eventHeader/FiltersModal";
import { FiltersWrapper } from "@/components/events/eventHeader/filtersWrapper/FiltersWrapper";

export const EventHeader = ({
  filters,
  filterLoading,
  categoryParam,
  locationParams,
  dateParams,
  speakerParam,
}) => {
  const [isDom, setIsDOM] = useState<boolean>(false);
  const [isMobile] = useMediaQuery("(max-width: 1123px)");

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
  useEffect(() => {
    setIsDOM(true);
  }, []);

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const toggleFiltersModal = () => {
    setIsFiltersModalOpen((prev) => !prev);
  };

  return (
    <>
      {!isMobile && isDom && (
        <Flex h={isScrolled ? "0" : "230px"} transition={"all 450ms"}>
          <Flex
            flexDirection={"column"}
            gap={1}
            alignItems={"center"}
            pos={"fixed"}
            top={isScrolled ? "70px" : "265px"}
            left={"50%"}
            style={{ transform: "translate(-50%, -50%)" }}
            zIndex={106}
            transition={"all 250ms"}
            w={isScrolled ? "auto":'100%'}
          >
            {!isScrolled && (
              <Flex minH={"75px"} lineHeight={'normal'} w={isScrolled ? "auto":'100%'} justifyContent={'center'}>
                {!filterLoading && (
                  <TypeAnimation
                    sequence={[
                      "Attend what you love!",
                      1000,
                      "Go where you love!",
                      1000,
                      "Visit when you love!",
                      1000,
                      "See who you love!",
                      1000,
                    ]}
                    wrapper={"span"}
                    speed={50}
                    style={{
                      fontSize: "9rem",
                      fontWeight: "bold",
                      display: "inline-block",
                      fontVariantNumeric: "tabular-nums",
                      color: "#06F881",
                      textTransform: "uppercase",
                      fontFamily: "TT Bluescreens",
                    }}
                    repeat={Infinity}
                  />
                )}
              </Flex>
            )}
            <Suspense>
              <FiltersWrapper
                locationParam={locationParams}
                speakerParam={speakerParam}
                categoryParam={categoryParam}
                dateParams={dateParams}
                filters={filters}
              >
                {/*@ts-ignore*/}
                <EventFilters
                  filterLoading={filterLoading}
                  isSmallView={isScrolled}
                />
              </FiltersWrapper>
            </Suspense>
          </Flex>
        </Flex>
      )}

      {isMobile && isDom && (
        <Flex justifyContent={"center"}>
          <Button
            onClick={toggleFiltersModal}
            rounded={"1.5rem"}
            rightIcon={<SlidersHorizontal />}
            bg={"#fff"}
            boxShadow={"rgba(29, 29, 29, 0.08) 0px 8px 24px 0px"}
            py={2}
            px={6}
            fontWeight={"bold"}
            mb={4}
            _active={{}}
            _focusWithin={{}}
            _focus={{}}
            _selected={{}}
            _hover={{}}
          >
            WHAT, WHEN, WHERE, WHO?
          </Button>
        </Flex>
      )}

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={toggleFiltersModal}
        locationParam={locationParams}
        speakerParam={speakerParam}
        categoryParam={categoryParam}
        dateParams={dateParams}
        filters={filters}
      />
    </>
  );
};
