import {
  Box,
  Flex,Skeleton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { BarChart } from "./BarChart";
import React from 'react'
import Card from "./Card";

export default function BarChartCard (props: { isLoading: boolean, title: string, chartData: any[], chartOptions: any,[x: string]: any }) {
  const {  chartData, chartOptions, title,isLoading, ...rest } = props

  const textColor = useColorModeValue('secondaryGray.900', 'white')

  return (
    <Card w='100%' {...rest}>
      <Flex align='center' w='100%' px='15px' py='10px'>
        <Text
          me='auto'
          color={textColor}
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'
        >
          {title}
        </Text>
      </Flex>

      <Box h="240px" mt="auto" w={'100%'}>
        {isLoading ?  <Skeleton rounded={"20px"} mt={3} w={"100%"} h={"90%"} endColor={"#ececec"}/> :
            <BarChart
                chartData={chartData}
                chartOptions={chartOptions}
            />}
      </Box>
    </Card>
  )
}
