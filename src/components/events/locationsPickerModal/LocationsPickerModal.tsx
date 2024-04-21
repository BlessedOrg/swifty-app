import {
  Button,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { colorGenerator } from "@/utilscolorGenerator";

export const LocationsPickerModal = ({
  onClose,
  isOpen,
  events = [] as any[],
  onSubmit,
  defaultValues = [] as string[],
}) => {
  const [selectedAddresses, setSelectedAddresses] = useState<any>([]);

  const handleAddressClick = (address) => {
    const isAddressSelected = selectedAddresses.some(
      (selectedAddress) => selectedAddress.city === address.city,
    );

    if (isAddressSelected) {
      setSelectedAddresses((prevSelected) =>
        prevSelected.filter(
          (selectedAddress) => selectedAddress.city !== address.city,
        ),
      );
    } else {
      setSelectedAddresses((prevSelected) => [...prevSelected, address]);
    }
  };

  const handleFilterClick = () => {
    const payload = selectedAddresses.map((i) => i.city);
    onSubmit(payload);

    onClose();
  };

  const clearSelectedValuesHandler = () => {
    setSelectedAddresses([]);
    onSubmit([]);
    onClose();
  };

  useEffect(() => {
    if (!!defaultValues.length && !selectedAddresses.length) {
      const defaultAddresses = events
        .flatMap((event) => event.addresses)
        .filter((address) => defaultValues.includes(address.city));
      setSelectedAddresses(defaultAddresses);
    }
  }, [defaultValues]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Discover Events</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection={"column"} gap={6}>
            {events.map((item, idx) => {
              return (
                <Flex key={idx} flexDirection={"column"} gap={2}>
                  <Text fontSize={"1rem"} color={"#757575"} fontWeight={"bold"}>
                    {item.continent} ({item.count})
                  </Text>

                  <Grid
                    gridTemplateColumns={
                      "repeat(auto-fill, minmax(180px, 1fr))"
                    }
                    gap={2}
                  >
                    {item?.addresses?.map((address, idx) => {
                      const isSelected = selectedAddresses.some(
                        (i) => i.city === address.city,
                      );
                      return (
                        <CityCard
                          key={idx}
                          isSelected={isSelected}
                          onClick={() => handleAddressClick(address)}
                          address={address}
                        />
                      );
                    })}
                  </Grid>
                </Flex>
              );
            })}
          </Flex>
        </ModalBody>

        <ModalFooter mt={10}>
          <Button
            variant={"ghost"}
            mr={3}
            onClick={clearSelectedValuesHandler}
            h={"52px"}
          >
            Clear
          </Button>
          <Button variant="purple" px={6} onClick={handleFilterClick}>
            Filter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const CityCard = ({ isSelected, onClick, address }) => {
  const generateBrightColor = useMemo(colorGenerator, []);

  return (
    <Flex
      as={"button"}
      textAlign={"start"}
      gap={3}
      alignItems={"center"}
      rounded={"8px"}
      p={2}
      bg={isSelected ? "#f3f3f3" : "transparent"}
      onClick={onClick}
      _hover={
        !isSelected
          ? {
              bg: "#f9f8f8",
            }
          : {}
      }
      transition={"all 150ms"}
    >
      <Flex
        bg={generateBrightColor}
        w={"40px"}
        h={"40px"}
        rounded={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {address?.countryFlag}
      </Flex>
      <Flex flexDirection={"column"}>
        <Text fontSize={"1.1rem"} color={"#242323"} fontWeight={"bold"}>
          {address.city}
        </Text>
        <Text fontSize={"1rem"} color={"#757575"} fontWeight={500}>
          {address?.count} Events
        </Text>
      </Flex>
    </Flex>
  );
};
