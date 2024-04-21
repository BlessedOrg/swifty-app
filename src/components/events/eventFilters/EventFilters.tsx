import { EventFilterSelectCard } from "@/components/events/eventFilterSelectCard/EventFilterSelectCard";
import {
  Button,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import useSWR from "swr";
import { swrFetcher } from "../../../requests/requests";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { addHours } from "date-fns";
import { DateRangePicker } from "react-date-range";
import { EventFilterCard } from "@/components/events/eventFilterCard/EventFilterCard";
import { LocationsPickerModal } from "@/components/events/locationsPickerModal/LocationsPickerModal";

export const EventFilters = ({
  categoryParam,
  speakerParam,
  locationParam,
  dateParams,
}) => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const toggleLocationModal = () => {
    setIsLocationModalOpen((prev) => !prev);
  };
  const defaultDate = !!dateParams?.length
    ? {
        startDate: new Date(dateParams[0]),
        endDate: new Date(dateParams[1]),
      }
    : {
        startDate: new Date(),
        endDate: new Date(),
      };
  const [dateRange, setDateRange] = useState<any>([
    {
      ...defaultDate,
      key: "selection",
    },
  ]);
  const { data: filters, isLoading: filterLoading } = useSWR(
    "/api/events/filterOptions",
    swrFetcher,
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const defaultStartDate = new Date().toISOString().slice(0, 10);

  const onLocationChange = (locations: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.delete("where");
    for (const city of locations) {
      if (!!locations?.length) {
        const isExist = !!params.getAll("where").length;
        const isLocationAlreadyAdded = params
          .getAll("where")
          .some((i) => i === city);
        if (!isExist) {
          params.set("where", city);
        } else {
          if (isLocationAlreadyAdded) {
            return;
          } else {
            params.append("where", city);
          }
        }
      } else {
        params.delete("where");
      }
    }

    router.replace(`${pathname}?${params.toString()}`);
  };
  const onCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== "all") {
      params.set("what", category);
    } else {
      params.delete("what");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  const onSpeakerChange = (speaker: string) => {
    const params = new URLSearchParams(searchParams);
    if (speaker && speaker !== "all") {
      params.set("who", speaker);
    } else {
      params.delete("who");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  const onDateRangeChange = (dateRange) => {
    const startDate = addHours(dateRange?.[0]?.startDate, 2)
      ?.toISOString()
      ?.slice(0, 10);
    const endDate = addHours(dateRange?.[0]?.endDate, 2)
      ?.toISOString()
      ?.slice(0, 10);

    const params = new URLSearchParams(searchParams);
    if (startDate !== defaultStartDate || endDate !== defaultStartDate) {
      params.set("when", startDate);
      params.append("when", endDate);
    } else {
      params.delete("when");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  const speakerOptions = filters?.availableSpeakers || [];
  const eventsByContinent = filters?.eventsByContinent || [];

  const categories = [
    { label: "All", value: "all" },
    { label: "Conference", value: "conference" },
    { label: "Event", value: "event" },
    { label: "Concerts", value: "concert" },
  ];
  const defaultCategory =
    (!!categoryParam && categories.find((i) => i.value === categoryParam)) ||
    null;
  const defaultSpeaker =
    (!!speakerParam &&
      !!speakerOptions?.length &&
      speakerOptions?.find((speaker) => speaker.value === speakerParam)) ||
    null;

  const dateLabel =
    !!dateParams?.length &&
    `${dateRange?.[0]?.startDate?.toISOString().slice(5, 10)}` +
      "/" +
      `${dateRange?.[0]?.endDate?.toISOString().slice(5, 10)}`;

  return (
    <Flex gap={2} justifyContent={"center"} my={10}>
      <EventFilterSelectCard
        options={categories}
        defaultValue={defaultCategory}
        selectLabel={"What"}
        placeholder={"Category"}
        onParamsChange={onCategoryChange}
        isLoading={filterLoading}
      />
      <EventFilterCard
        label={!!locationParam.length ? locationParam.join(",") : ""}
        placeholder={"Location"}
        title={"Where"}
        isLoading={filterLoading}
        onClick={toggleLocationModal}
      />
      <Popover>
        <PopoverTrigger>
          <Flex as={"button"}>
            <EventFilterCard
              label={dateLabel}
              placeholder={"Date"}
              isLoading={filterLoading}
              title={"When"}
            />
          </Flex>
        </PopoverTrigger>
        <Portal>
          <PopoverContent display={"flex"} flexDirection={"column"} gap={1}>
            <DateRangePicker
              onChange={(item) => {
                onDateRangeChange([item.selection]);
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
