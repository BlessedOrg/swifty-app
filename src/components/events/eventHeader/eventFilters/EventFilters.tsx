import { EventFilterSelectCard } from "@/components/events/eventHeader/eventFilters/eventFilterSelectCard/EventFilterSelectCard";
import {
  Button,
  Flex,
  FlexProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { EventFilterCard } from "@/components/events/eventHeader/eventFilters/eventFilterCard/EventFilterCard";
import { LocationsPickerModal } from "@/components/events/locationsPickerModal/LocationsPickerModal";
import { FiltersPropsData } from "@/components/events/eventHeader/filtersWrapper/FiltersWrapper";

interface IProps extends FlexProps, FiltersPropsData {
  filters: any;
  filterLoading: any;
  isSmallView: any;
}

export const filterCategories = [
  { label: "All", value: "all" },
  { label: "Conference", value: "conference" },
  { label: "Event", value: "event" },
  { label: "Concerts", value: "concert" },
];
export const EventFilters = (props: IProps) => {
  const {
    eventsByContinent,
    locationParam,
    onLocationChange,
    dateParams,
    dateRange,
    onDateRangeChange,
    setDateRange,
    onCategoryChange,
    defaultCategory,
    dateLabel,
    speakerOptions,
    onSpeakerChange,
    categoryParam,
    filters,
    filterLoading,
    isSmallView,
    defaultSpeaker,
    ...rest
  } = props;
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const popoverRef = useRef<any>(null);
  useOutsideClick({
    ref: popoverRef,
    handler: () => {
      setShowDateRange(false);
    },
  });
  const toggleLocationModal = () => {
    setIsLocationModalOpen((prev) => !prev);
  };

  const [showDateRange, setShowDateRange] = useState(false);

  const toggleDateRangePopover = () => {
    setShowDateRange((prev) => !prev);
  };
  return (
    <Flex gap={2} justifyContent={"center"} {...rest}>
      <EventFilterSelectCard
        options={filterCategories}
        defaultValue={defaultCategory}
        selectLabel={"What"}
        placeholder={"Category"}
        onParamsChange={onCategoryChange}
        isLoading={filterLoading}
        isSmallView={isSmallView}
      />
      <EventFilterCard
        label={!!locationParam.length ? locationParam.join(",") : ""}
        placeholder={"Location"}
        title={"Where"}
        isLoading={filterLoading}
        onClick={toggleLocationModal}
        isSmallView={isSmallView}
      />
      <Popover
        isOpen={showDateRange}
        onOpen={toggleDateRangePopover}
        onClose={toggleDateRangePopover}
      >
        <PopoverTrigger>
          <Flex as={"button"}>
            <EventFilterCard
              label={dateLabel}
              placeholder={"Date"}
              isLoading={filterLoading}
              title={"When"}
              isSmallView={isSmallView}
            />
          </Flex>
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            display={"flex"}
            flexDirection={"column"}
            gap={1}
            w={"fit-content"}
            ref={popoverRef}
          >
            <DateRangePicker
              onChange={(item) => {
                if (
                  item?.selection?.startDate?.toISOString() !==
                  item?.selection?.endDate?.toISOString()
                ) {
                  onDateRangeChange([item.selection]);
                  toggleDateRangePopover();
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
            <Button
              rounded={"0"}
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
                toggleDateRangePopover();
              }}
            >
              Clear
            </Button>
          </PopoverContent>
        </Portal>
      </Popover>
      <EventFilterSelectCard
        options={[
          { label: "All", value: "all", clearField: true },
          ...speakerOptions,
        ]}
        placeholder={"Speaker"}
        defaultValue={defaultSpeaker}
        selectLabel={"Who"}
        withImage={true}
        onParamsChange={onSpeakerChange}
        isLoading={filterLoading}
        isSmallView={isSmallView}
      />

      <LocationsPickerModal
        isOpen={isLocationModalOpen}
        onClose={toggleLocationModal}
        events={eventsByContinent}
        onSubmit={onLocationChange}
        defaultValues={locationParam || []}
      />
    </Flex>
  );
};
