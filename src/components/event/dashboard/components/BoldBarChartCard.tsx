import {Box, Flex, Skeleton, Text, useColorModeValue} from '@chakra-ui/react';
import { BarChart } from "./BarChart";
import Card from "./Card";
import React from "react";

export default function BoldBarChartCard(props: {symbol: string, isLoading?: boolean, value?: number | string, title: string, valueName?: string, chartData: any[], chartOptions: any, [x: string]: any }) {
	const {chartData, isLoading,symbol="", chartOptions,valueName, value, title, ...rest } = props;

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	return (
    <Card alignItems="center" flexDirection="column" w="100%" {...rest}>
      <Flex justify="space-between" align="start" px="10px" pt="5px" w="100%">
        <Flex flexDirection="column" align="start" me="20px">
          <Text color="secondaryGray.600" fontSize="sm" fontWeight="500">
            {title}
          </Text>
          <Flex align="end">
            <Text
              color={"#5E37FF"}
              fontSize="34px"
              fontWeight="700"
              lineHeight="100%"
            >
              {value ? `${value}${symbol}` : <Skeleton height='20px' mt={2} rounded={'7px'}/>}
            </Text>
            {valueName &&
              <Text
                ms="6px"
                color="secondaryGray.600"
                fontSize="sm"
                fontWeight="500"
              >
                {!!value && valueName}
              </Text>
            }
          </Flex>
        </Flex>
      </Flex>
      <Box h="240px" mt="auto" w={'100%'}>
          {isLoading ?  <Skeleton rounded={"20px"} mt={3} w={"100%"} h={"90%"} endColor={"#ececec"}/> :
              <BarChart chartData={chartData} chartOptions={chartOptions} />}
      </Box>
    </Card>
  );
}
