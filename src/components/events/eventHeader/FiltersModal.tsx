import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { EventFilterCard } from "@/components/events/eventHeader/eventFilters/eventFilterCard/EventFilterCard";
import { LocalizationsGrid } from "@/components/events/locationsPickerModal/LocationsPickerModal";
import { Suspense, useState } from "react";
import {
  FiltersPropsData,
  FiltersWrapper,
} from "@/components/events/eventHeader/filtersWrapper/FiltersWrapper";
import { DateRangePicker } from "react-date-range";
import Image from "next/image";

export const FiltersModal = ({
  isOpen,
  onClose,
  locationParam,
  speakerParam,
  categoryParam,
  dateParams,
  filters,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Filter events</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Suspense>
            <FiltersWrapper
              locationParam={locationParam}
              speakerParam={speakerParam}
              categoryParam={categoryParam}
              dateParams={dateParams}
              filters={filters}
            >
              <FilterTabs onClose={onClose} />
            </FiltersWrapper>
          </Suspense>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface IProps extends FiltersPropsData {
  onClose: any;
}

const FilterTabs = (props: IProps) => {
  const [tabIndex, setTabIndex] = useState(0);

  //location
  const [selectedAddresses, setSelectedAddresses] = useState<any>([]);

  const {
    eventsByContinent,
    locationParam,
    onLocationChange,
    onClose,
    dateParams,
    dateRange,
    onDateRangeChange,
    setDateRange,
    onCategoryChange,
    defaultCategory,
    dateLabel,
    speakerOptions,
    onSpeakerChange,
    defaultSpeaker,
  } = props;

  const onFilterLocation = () => {
    const payload = selectedAddresses.map((i) => i.city);
    onLocationChange(payload);
  };

  const onClearSelectedAddresses = () => {
    setSelectedAddresses([]);
    onLocationChange([]);
  };

  //categories
  const [selectedCategory, setSelectedCategory] = useState(
    !!defaultCategory?.value ? defaultCategory.value : "all"
  );
  const onUpdateCategories = (e) => {
    setSelectedCategory(e);
  };
  //speakers
  const [selectedSpeaker, setSelectedSpeaker] = useState(
    defaultSpeaker?.value || ""
  );
  const onSubmitFilters = () => {
    if (!!selectedCategory) {
      onCategoryChange(selectedCategory);
    } else {
      onCategoryChange(null);
    }
    if (selectedAddresses?.length) {
      onFilterLocation();
    } else {
      onClearSelectedAddresses();
    }
    if (!!selectedSpeaker) {
      onSpeakerChange(selectedSpeaker);
    } else {
      onSpeakerChange("");
    }
    onClose();
  };

  const categories = [
    {
      title: "What",
      placeholder: "Category",
      label: defaultCategory?.label || "",
    },
    {
      title: "Where",
      placeholder: "Location",
      label: !!locationParam.length ? locationParam.join(",") : "",
    },
    {
      title: "When",
      placeholder: "Date",
      label: dateLabel,
    },
    {
      title: "Who",
      placeholder: "Speaker",
      label:
        speakerOptions?.find((i) => i.value === selectedSpeaker)?.label || "",
    },
  ];

  const onSpeakerPickHandler = (speaker) => {
    if (speaker === selectedSpeaker) {
      setSelectedSpeaker("");
    } else {
      setSelectedSpeaker(speaker);
    }
  };

  return (
    <Tabs variant={"unstyled"} onChange={(index) => setTabIndex(index)}>
      <TabList overflowX={"auto"} py={4}>
        {categories.map((category, idx) => {
          return (
            <Tab key={idx} px={1}>
              <EventFilterCard
                {...category}
                isLoading={false}
                isSmallView={true}
              />
            </Tab>
          );
        })}
      </TabList>

      <TabPanels>
        <TabPanel height={"60vh"} maxH={"60vh"} overflowY={"auto"}>
          <RadioGroup
            onChange={onUpdateCategories}
            value={selectedCategory || ""}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
          >
            <Radio value="all" fontSize="1.7rem" fontWeight="bold">
              All
            </Radio>
            <Radio value="event" fontSize="1.7rem" fontWeight="bold">
              Event
            </Radio>
            <Radio value="conference" fontSize="1.7rem" fontWeight="bold">
              Conference
            </Radio>
            <Radio value="concert" fontSize="1.7rem" fontWeight="bold">
              Concerts
            </Radio>
          </RadioGroup>
        </TabPanel>
        <TabPanel maxHeight={"60vh"} overflowY={"auto"}>
          <LocalizationsGrid
            events={eventsByContinent}
            defaultValues={locationParam}
            selectedAddresses={selectedAddresses}
            setSelectedAddresses={setSelectedAddresses}
          />
        </TabPanel>
        <TabPanel
          height={"60vh"}
          maxH={"60vh"}
          overflowY={"auto"}
          p={0}
          overflow={"hidden"}
        >
          <DateRangePicker
            onChange={(item) => {
              if (
                item?.selection?.startDate?.toISOString() !==
                item?.selection?.endDate?.toISOString()
              ) {
                onDateRangeChange([item.selection]);
              }
              setDateRange([item.selection]);
            }}
            months={1}
            ranges={dateRange}
            showMonthAndYearPickers={false}
            showDateDisplay={false}
            staticRanges={[]}
            inputRanges={[]}
            editableDateInputs={false}
            direction="horizontal"
          />
        </TabPanel>
        <TabPanel maxHeight={"60vh"} overflowY={"auto"} p={0}>
          {speakerOptions.map((speaker: any, idx) => {
            return (
              <SpeakerCard
                key={speaker.value}
                {...speaker}
                onClick={onSpeakerPickHandler}
                isSelected={selectedSpeaker === speaker?.value}
              />
            );
          })}
        </TabPanel>
      </TabPanels>

      <ModalFooter>
        {tabIndex === 2 && (
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              const resetValue = [
                {
                  startDate: new Date(),
                  endDate: new Date(),
                  key: "selection",
                },
              ];
              onDateRangeChange(resetValue);
              setDateRange(resetValue);
            }}
          >
            Clear date
          </Button>
        )}
        {tabIndex !== 2 && (
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        )}
        <Button variant="ghost" onClick={onSubmitFilters}>
          Apply
        </Button>
      </ModalFooter>
    </Tabs>
  );
};

const SpeakerCard = ({ avatarUrl, label, isSelected, onClick, value }) => {
  return (
    <Flex
      as={"button"}
      gap={2}
      alignItems={"center"}
      bg={isSelected ? "#ece9e9" : "transparent"}
      transition={"all 200ms"}
      py={"12px"}
      cursor={"pointer"}
      borderBottom={"1px solid"}
      borderColor={"#ddd"}
      px={4}
      _hover={{}}
      transitionDuration={"all 150ms"}
      onClick={() => {
        onClick(value);
      }}
      w={"100%"}
    >
      <Image
        src={avatarUrl || "/images/logo_dark.svg"}
        alt={`${label} avatar image`}
        width={50}
        height={50}
        style={{
          objectFit: "cover",
          borderRadius: "100%",
          maxHeight: "50px",
        }}
      />

      <Text
        fontSize={"14px"}
        fontWeight={"600"}
        whiteSpace={"nowrap"}
        overflow={"hidden"}
        textOverflow={"ellipsis"}
      >
        {label}
      </Text>
    </Flex>
  );
};
