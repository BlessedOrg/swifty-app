import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ArrowDown, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { shortenAddress } from "thirdweb/utils";
import { RandomAvatar } from "@/components/profile/personalInformation/avatar/RandomAvatar";

interface IProps {
  participants: IAuctionV2Data["participantsStats"] | undefined;
}

export const LotteryUsersTableView = ({ participants }: IProps) => {
  return (
    <TableContainer
      w={"100%"}
      color={"#000"}
      h={{ base: "250px", iwMid: "420px" }}
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
          {!!participants?.length &&
            participants
              ?.sort((a, b) => {
                if (a.amount !== b.amount) {
                  return b.amount - a.amount;
                } else {
                  return b.timestamp - a.timestamp;
                }
              })
              ?.map((user, idx) => {
                return (
                  <Tr
                    key={idx}
                    bg={user.isWinner ? "rgb(110,243,102,0.27)" : "initial"}
                  >
                    <Td pr={"10px"}>{idx + 1}</Td>
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
                        <RandomAvatar
                          username={user.address}
                          width={32}
                          height={32}
                          rounded
                        />
                        <Text>{shortenAddress(user.address)}</Text>
                      </Flex>
                    </Td>
                    <Td>{user.amount}$</Td>
                    <Td isNumeric={true}>
                      {calculateTimeElapsed(user.timestamp)}
                    </Td>
                  </Tr>
                );
              })}
        </Tbody>
      </Table>
      {!participants?.length && (
        <Flex
          w={"100%"}
          justifyContent={"center"}
          textAlign={"center"}
          alignItems={"center"}
          p={6}
        >
          <Text fontWeight={"bold"}>No participants yet. Be first!</Text>
        </Flex>
      )}
    </TableContainer>
  );
};

function calculateTimeElapsed(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const timeDifference = now - timestamp;

  const hours = Math.floor(timeDifference / 3600);
  const minutes = Math.floor((timeDifference % 3600) / 60);
  const seconds = timeDifference % 60;

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  return formattedTime;
}
