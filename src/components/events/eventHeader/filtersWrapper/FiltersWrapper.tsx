import { cloneElement, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addHours } from "date-fns";
import { filterCategories } from "@/components/events/eventHeader/eventFilters/EventFilters";

export interface FiltersPropsData {
  categoryParam?: any;
  dateLabel?: any;
  dateParams?: any;
  dateRange?: any;
  defaultCategory?: any;
  defaultDate?: any;
  defaultSpeaker?: any;
  defaultStartDate?: any;
  eventsByContinent?: any;
  filters?: any;
  locationParam?: any;
  onCategoryChange?: any;
  onDateRangeChange?: any;
  onLocationChange?: any;
  onSpeakerChange?: any;
  setDateRange?: any;
  speakerOptions?: any;
}

export const FiltersWrapper = ({
  children,
  dateParams,
  filters,
  categoryParam,
  speakerParam,
  locationParam,
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const defaultStartDate = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams(searchParams);

  const onLocationChange = (locations: string[]) => {
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
    if (category && category !== "all") {
      params.set("what", category);
    } else {
      params.delete("what");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  const onSpeakerChange = (speaker: string) => {
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

  const defaultCategory =
    (!!categoryParam &&
      filterCategories.find((i) => i.value === categoryParam)) ||
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

  const props = {
    defaultCategory,
    defaultDate,
    defaultSpeaker,
    defaultStartDate,
    dateLabel,
    dateRange,
    dateParams,
    categoryParam,
    eventsByContinent,
    locationParam,
    onLocationChange,
    onCategoryChange,
    onDateRangeChange,
    onSpeakerChange,
    filters,
    setDateRange,
    speakerOptions,
  };

  const clonedChildren = cloneElement(children, { ...props });

  return clonedChildren;
};
