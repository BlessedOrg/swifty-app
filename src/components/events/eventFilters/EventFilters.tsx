import { EventFilterCard } from "@/components/events/eventFilterCard/EventFilterCard";
import {
  Button,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import useSWR from "swr";
import { swrFetcher } from "../../../requests/requests";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { addHours } from "date-fns";
import { DateRangePicker } from "react-date-range";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { ChevronDown } from "lucide-react";

export const EventFilters = ({
  categoryParam,
  speakerParam,
  locationParam,
  dateParams,
}) => {
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

  const onLocationChange = (location) => {
    const params = new URLSearchParams(searchParams);
    if (location && location !== "all") {
      params.set("where", location);
    } else {
      params.delete("where");
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
  const locationOptions = filters?.availableLocations || [];

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

  const defaultLocation =
    (!!locationParam &&
      !!locationOptions?.length &&
      locationOptions?.find((location) => location?.value === locationParam)) ||
    null;

  const dateLabel =
    !!dateParams?.length &&
    `${dateRange?.[0]?.startDate?.toISOString().slice(5, 10)}` +
      "/" +
      `${dateRange?.[0]?.endDate?.toISOString().slice(5, 10)}`;

  return (
    <Flex gap={2} justifyContent={"center"} my={10}>
      <EventFilterCard
        options={categories}
        defaultValue={defaultCategory}
        selectLabel={"What"}
        placeholder={"Category"}
        onParamsChange={onCategoryChange}
        isLoading={filterLoading}
      />
      <EventFilterCard
        options={[
          { label: "All", value: "all", clearField: true },
          ...locationOptions,
        ]}
        defaultValue={defaultLocation}
        selectLabel={"Where"}
        withBrowser
        placeholder={"Location"}
        onParamsChange={onLocationChange}
        isLoading={filterLoading}
      />
      <Popover>
        <PopoverTrigger>
          <Flex
            as={"button"}
            display={"flex"}
            style={{
              boxShadow: "0px 8px 24px 0px rgba(29, 29, 29, 0.08)",
            }}
            px={"2rem"}
            py={"1rem"}
            rounded={"100px"}
            gap={1}
            alignItems={"center"}
            justifyContent={"space-between"}
            width={"225px"}
          >
            <Flex
              flexDirection={"column"}
              alignItems={"flex-start"}
              maxW={"calc(100% - 28px)"}
            >
              <Text fontWeight={"bold"} fontSize={"15px"}>
                When
              </Text>

              {!filterLoading && !dateLabel && (
                <Text fontSize={"20px"} fontWeight={"bold"} color={"#D3D3D3"}>
                  Date
                </Text>
              )}
              {!filterLoading && !!dateLabel && (
                <Text
                  fontSize={"20px"}
                  fontWeight={"bold"}
                  color={"#665CFB"}
                  whiteSpace={"nowrap"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  maxW={"100%"}
                >
                  {dateLabel}
                </Text>
              )}
              {filterLoading && <LoadingDots />}
            </Flex>
            <ChevronDown />
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
      <EventFilterCard
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
    </Flex>
  );
};
