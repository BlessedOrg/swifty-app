import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue, Skeleton
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table'
import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md'
import { TableProps } from '../variables/columnsData'
import Card from "./Card";

export default function ColumnsTable (props: { isLoading: boolean }&TableProps ) {
  const { columnsData, tableData , isLoading} = props

  const columns = useMemo(() => columnsData, [columnsData])
  const data = useMemo(() => tableData, [tableData])

  const tableInstance = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState
  } = tableInstance
  initialState.pageSize = 5

  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100')
  return (
    <Card
      flexDirection='column'
      w='100%'
      px='0.5rem'
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px='25px' justify='space-between' mb='10px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'
        >
          Sale Stats
        </Text>
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'
                  >
                    {column.render('Header')}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {!isLoading && page.map((row, index) => {
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data
                  if (cell.column.Header === 'NAME') {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    )
                  } else if (cell.column.Header === 'Avg. TICKET PRICE') {
                    data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}$
                        </Text>
                    )
                  } else if (cell.column.Header === 'SOLD OUT') {
                    data = (
                      <Flex align='center'>
                        <Icon
                          w='24px'
                          h='24px'
                          me='5px'
                          color={
                            cell.value === 'YES'
                              ? 'green.500'
                              : cell.value === 'Disable'
                              ? 'red.500'
                              : cell.value === 'NO'
                              ? 'orange.500'
                              : undefined
                          }
                          as={
                            cell.value === 'YES'
                              ? MdCheckCircle
                              : cell.value === 'NO'
                              ? MdCancel
                              : cell.value === 'Error'
                              ? MdOutlineError
                              : undefined
                          }
                        />
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    )
                  }  else if (cell.column.Header === 'SELL PROGRESS') {
                    data = (
                      <Flex align="center" gap={1}>
                        <Progress
                          variant="table"
                          colorScheme="green"
                          bg={"#ddd"}
                          h="8px"
                          w="108px"
                          value={cell.value}
                        />
                        <Text fontWeight={'bold'} fontSize={'0.9rem'}>{cell.value}%</Text>
                      </Flex>
                    );
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: '14px' }}
                      maxH='30px !important'
                      py='8px'
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor='transparent'
                    >
                      {data}
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      {isLoading && <Skeleton rounded={"20px"} w={"100%"} h={"90%"} endColor={"#ececec"}/>}

    </Card>
  )
}
