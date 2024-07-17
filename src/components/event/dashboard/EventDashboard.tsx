"use client";
import { columnsDataComplex } from "./variables/columnsData";
import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { MdAttachMoney, MdBarChart, MdPeople, MdPercent } from "react-icons/md";
import BarChartCard from "./components/BarChartCard";
import { TableData } from "./variables/columnsData";
import BoldBarChartCard from "./components/BoldBarChartCard";
import MiniStatistics from "./components/MiniStatistics";
import IconBox from "./components/IconBox";
import ComplexTable from "./components/ComplexTable";
import useSWR from "swr";
import { fetcher } from "../../../requests/requests";

import {
  revenuePerPhaseChartData,
  revenuePerPhaseOptionsConsumption,
  participantsPerPhaseChartData,
} from "./variables/charts";
import {
  barChartDepositsPerPhaseData,
  barChartDepositsPerPhaseOptions,
} from "./variables/charts";
import { useUserContext } from "@/store/UserContext";
import { useParams } from "next/navigation";
import { TicketPercent } from "lucide-react";

export const EventDashboard = () => {
  const { userId } = useUserContext();
  const { id: eventId } = useParams();
  const { data: statsData, isLoading: statsLoading } = useSWR(
    `/api/events/${eventId}/stats`,
    fetcher,
    {
      refreshInterval: 10000,
    },
  );
  const { data: eventData } = useSWR(`/api/events/${eventId}`, fetcher);
  const event = (eventData?.event || null) as IEvent | null;
  if (!!event && event.sellerId !== userId) {
    return (
      <Flex justifyContent={"center"} my={10}>
        <Text fontWeight={"bold"} fontSize={"1.5rem"}>
          Not authorized
        </Text>
      </Flex>
    );
  }

  const stats = (statsData?.saleStats || null) as ISaleStats | null;
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const chartDataRevenuePerPhase = revenuePerPhaseChartData(
    stats?.revenuePerPhase,
  );
  const chartDataParticipantsPerPhase = participantsPerPhaseChartData(
    stats?.participantsPerPhase,
  );
  const depositsPerPhaseData = barChartDepositsPerPhaseData(
    stats?.depositsPerPhase,
  );

  const tableDataComplex = [
    {
      name: "Lottery V1",
      status: "Finished",
      soldOut: stats?.statsPerPhase.lv1.soldOut ? "YES" : "NO",
      avgTicketPrice: stats?.statsPerPhase?.lv1?.averagePricePerTicket || 0,
      progress: stats?.sellProgressPerPhase?.lv1 || 0,
    },
    {
      name: "Lottery V2",
      status: "Finished",
      soldOut: stats?.statsPerPhase.lv2.soldOut ? "YES" : "NO",
      avgTicketPrice: stats?.statsPerPhase?.lv2?.averagePricePerTicket || 0,
      progress: stats?.sellProgressPerPhase?.lv2 || 0,
    },
    {
      name: "Auction V1",
      status: "In Progress",
      soldOut: stats?.statsPerPhase.av1.soldOut ? "YES" : "NO",
      avgTicketPrice: stats?.statsPerPhase?.av1?.averagePricePerTicket || 0,
      progress: stats?.sellProgressPerPhase?.av1 || 0,
    },
    {
      name: "Auction V2",
      status: "In Progress",
      soldOut: stats?.statsPerPhase.av2.soldOut ? "YES" : "NO",
      avgTicketPrice: stats?.statsPerPhase?.av2?.averagePricePerTicket || 0,
      progress: stats?.sellProgressPerPhase?.av2 || 0,
    },
  ];
  return (
    <Box pt={{ base: "1rem", md: "1.5rem", xl: "2rem" }} maxW={"1400px"}>
      <Flex justifyContent={"center"} mb={4}>
        <Text
          fontSize={"2.5rem"}
          fontWeight={"bold"}
          fontFamily={"TT Bluescreens"}
        >
          {event?.title}
        </Text>
      </Flex>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 5 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={TicketPercent} color={brandColor} />
              }
            />
          }
          name="Tickets Circulation"
          value={stats?.totalTicketsCap}
          isLoading={statsLoading}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Tickets Sold"
          value={stats?.totalTicketsSold || 0}
          isLoading={statsLoading}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdPercent} color={brandColor} />
              }
            />
          }
          name="Tickets Sold Percentage"
          value={stats?.totalTicketsSoldPercentage || 0}
          symbol={"%"}
          isLoading={statsLoading}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Revenue"
          value={stats?.totalRevenue || 0}
          symbol={"$"}
          isLoading={statsLoading}
          color={"#1dc51e"}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />}
            />
          }
          name="All Participants"
          value={stats?.allParticipants || 0}
          isLoading={statsLoading}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <BarChartCard
          title={"Revenue per phase"}
          chartData={chartDataRevenuePerPhase}
          chartOptions={revenuePerPhaseOptionsConsumption}
          isLoading={statsLoading}
        />
        <BarChartCard
          title={"Participants per phase"}
          chartData={chartDataParticipantsPerPhase}
          chartOptions={revenuePerPhaseOptionsConsumption}
          isLoading={statsLoading}
        />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex as unknown as TableData[]}
          isLoading={statsLoading}
        />
        <BoldBarChartCard
          chartOptions={barChartDepositsPerPhaseOptions}
          chartData={depositsPerPhaseData}
          title={"Deposits per phase"}
          valueName={"Total deposits"}
          value={stats?.totalDepositsAmount}
          symbol={"$"}
          isLoading={statsLoading}
        />
      </SimpleGrid>
    </Box>
  );
};
