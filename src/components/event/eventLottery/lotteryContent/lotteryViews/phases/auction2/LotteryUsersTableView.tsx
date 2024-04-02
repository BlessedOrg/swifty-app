import {
  TableContainer,
  Table,
  Tr,
  Th,
  Thead,
  Tbody,
  Td,
  Flex,
  Text,
} from "@chakra-ui/react";
import {
  ArrowDown,
  ArrowRightCircle,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import Image from "next/image";
interface IProps {}
export const LotteryUsersTableView = ({}: IProps) => {
  return (
    <TableContainer
      w={"100%"}
      color={"#000"}
      h={"452px"}
      overflowY={"auto"}
      pos={"relative"}
    >
      <Table variant="simple">
        <Thead pos={"sticky"} left={0} zIndex={"docked"}>
          <Tr>
            <Th pr={"10px"}>No</Th>
            <Th display={"flex"} justifyContent={"center"}>
              <ArrowDown size={16} />
            </Th>
            <Th>User</Th>
            <Th>Price</Th>
            <Th isNumeric>Time</Th>
          </Tr>
        </Thead>
        <Tbody overflowY={"auto"}>
          {Array.from({ length: 23 }, (_, idx) => {
            return (
              <Tr key={idx}>
                <Td pr={"10px"}>{idx}</Td>
                <Td>
                  <Flex justifyContent={"center"}>
                    {idx % 2 === 0 ? (
                      <ArrowUpCircle color={"green"} />
                    ) : (
                      <ArrowDownCircle color={"red"} />
                    )}
                  </Flex>
                </Td>
                <Td>
                  <Flex gap={1} alignItems={"center"}>
                    <Image
                      src={"/images/profile.png"}
                      alt={""}
                      width={32}
                      height={32}
                      style={{ borderRadius: "100%" }}
                    />
                    <Text>Marvin McKinney</Text>
                  </Flex>
                </Td>
                <Td>273$</Td>
                <Td isNumeric={true}>00:25.345</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
