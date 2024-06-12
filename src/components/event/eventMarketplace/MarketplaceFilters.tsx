import { EventFilterSelectCard } from "@/components/events/eventHeader/eventFilters/eventFilterSelectCard/EventFilterSelectCard";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
} from "@chakra-ui/react";
import { GitCommitHorizontal, DollarSign, ChevronDown } from "lucide-react";
import { useState } from "react";

export const MarketplaceFilters = () => {
  const [currentPriceRange, setCurrentPriceRange] = useState([110, 500]);
  return (
    <Flex justifyContent={"space-around"}>
      <Popover>
        <PopoverTrigger>
          <Button
            rounded={"1.5rem"}
            w={"fit-content"}
            _active={{}}
            _hover={{}}
            rightIcon={<GitCommitHorizontal />}
            bg={"transparent"}
            color={"#737373"}
            fontWeight={"normal"}
            borderColor={"#1D1D1B"}
            border="1px solid"
          >
            Price range
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>Tickets available: 43</PopoverHeader>
            <PopoverBody display={"flex"} flexDirection={"column"} gap={2}>
              <RangeSlider
                onChange={(e) => setCurrentPriceRange(e)}
                defaultValue={[120, 500]}
                min={0}
                max={500}
                step={5}
                value={currentPriceRange}
              >
                <RangeSliderTrack bg="red.100">
                  <RangeSliderFilledTrack bg="tomato" />
                </RangeSliderTrack>
                <RangeSliderThumb boxSize={6} index={0} bg={"#ff4a4a"} />
                <RangeSliderThumb boxSize={6} index={1} bg={"#ff4a4a"} />
              </RangeSlider>
              <Text fontWeight={600}>Price range</Text>
              <Flex gap={2}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <DollarSign />
                  </InputLeftElement>
                  <Input
                    type="number"
                    placeholder="Minimum"
                    value={currentPriceRange[0]}
                  />
                </InputGroup>
                -
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <DollarSign />
                  </InputLeftElement>
                  <Input
                    type="number"
                    placeholder="Maximum"
                    value={currentPriceRange[1]}
                  />
                </InputGroup>
              </Flex>
              <Button variant={"black"} h="2.5rem" mt={4}>
                Apply
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
      <Button
        rounded={"1.5rem"}
        w={"fit-content"}
        _active={{}}
        _hover={{}}
        rightIcon={<ChevronDown />}
        bg={"transparent"}
        color={"#737373"}
        fontWeight={"normal"}
        borderColor={"#1D1D1B"}
        border="1px solid"
      >
        Select user
      </Button>
    </Flex>
  );
};
