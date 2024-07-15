"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const BarChart = ({ chartOptions, chartData }) => {
  const [isDOM, setIsDom] = useState(false);
  useEffect(() => {
    setIsDom(true);
  });
const dataExist = chartData?.[0]?.data?.filter((i) => !!i.y)?.length || chartData?.some(item => item.data.some(value => value > 0))

  if (isDOM  && dataExist) {
    return (
      <Chart
        options={chartOptions}
        series={chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    );
  } else
    return (
      <Flex
        w={"100%"}
        h={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        fontWeight={'bold'}
      >
        No data yet
      </Flex>
    );
};
