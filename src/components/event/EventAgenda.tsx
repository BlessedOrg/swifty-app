import {
  Badge,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { PlayCircle } from "lucide-react";
export const EventAgenda = () => {
  return (
    <Flex flexDirection={"column"} w={"100%"} bg={"#F0F0F0"} py={6} px={20}>
      <Flex justifyContent={"space-between"} gap={2}>
        <Flex flexDirection={"column"}>
          <Text fontWeight={"bold"} fontSize={"3rem"} mb={10}>
            Agenda
          </Text>
          <Flex flexDirection={"column"}>
            <Flex
              flexDirection={"column"}
              gap={2}
              bg={"#fff"}
              p={4}
              rounded={"10px"}
            >
              <Text fontSize={"20px"} fontWeight={"bold"}>
                Galois Stage
              </Text>
              <Flex textTransform={"uppercase"} gap={2}>
                <BadgeCard bgColor={"#EF4444"} label={"Rollups"} />
                <BadgeCard bgColor={"#3B82F6"} label={"Data availability"} />
                <BadgeCard bgColor={"#22C55E"} label={"ZK"} />
              </Flex>
            </Flex>
            <Flex flexDirection={"column"} gap={2} p={4} rounded={"10px"}>
              <Text fontSize={"20px"} fontWeight={"bold"}>
                Fourier Stage
              </Text>
              <Flex
                textTransform={"uppercase"}
                gap={2}
                maxW={"260px"}
                flexWrap={"wrap"}
              >
                <BadgeCard bgColor={"#F97316"} label={"Infrastructure"} />
                <BadgeCard bgColor={"#A855F7"} label={"Shared seq"} />
                <BadgeCard bgColor={"#EC4899"} label={"RAAS"} />
                <BadgeCard bgColor={"#14B8A6"} label={"modular interop"} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Tabs variant="unstyled" w={"100%"}>
          <TabList justifyContent={"flex-end"} mb={10} gap={2} h={"72px"}>
            <Tab
              bg="#E0E0E0"
              color={"#000"}
              rounded={"7px"}
              fontWeight={"bold"}
              _selected={{ color: "#000", bg: "#fff" }}
              h={"fit-content"}
            >
              Day 1
            </Tab>
            <Tab
              bg="#E0E0E0"
              color={"#000"}
              rounded={"7px"}
              fontWeight={"bold"}
              _selected={{ color: "#000", bg: "#fff" }}
              h={"fit-content"}
            >
              Day 2
            </Tab>
          </TabList>
          <Flex
            py={4}
            bg={"#4F02EC"}
            rounded={"10px"}
            color={"#fff"}
            justifyContent={"space-between"}
            px={6}
          >
            <Text>Watch the recording on YouTube</Text>

            <Flex gap={2}>
              <PlayCircle />
              <Text textTransform={"uppercase"} fontWeight={"bold"}>
                Watch now
              </Text>
            </Flex>
          </Flex>
          <TabPanels>
            <TabPanel p={0}>
              <Flex flexDirection={"column"}>
                {agendaItems.map((item, idx) => {
                  return <AgendaStageCard key={idx} item={item} />;
                })}
              </Flex>
            </TabPanel>
            <TabPanel p={0}>
              <Flex flexDirection={"column"}>
                {agendaItems.map((item, idx) => {
                  return <AgendaStageCard key={idx} item={item} />;
                })}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
};

const BadgeCard = ({ bgColor, label }) => {
  return (
    <Badge bg={bgColor} py={2} px={4} rounded={"5px"} color={"#fff"}>
      {label}
    </Badge>
  );
};

const AgendaStageCard = ({ item }) => {
  return (
    <Flex
      flexDirection={"column"}
      borderLeft={"2px solid"}
      borderColor={item.stageColor}
      pt={6}
      px={4}
      gap={4}
    >
      <Text fontSize={"1.5rem"} fontWeight={"bold"}>
        {item.title}
      </Text>
      <Flex gap={6}>
        <Text as={"span"} fontWeight={"bold"}>
          {item.date}
        </Text>
        <Text as={"span"} fontWeight={"bold"}>
          Speakers:{" "}
          {item.speakers.map((speaker, index) => (
            <Text as={"span"} key={index} fontWeight={"400"}>
              {speaker}
            </Text>
          ))}
        </Text>
      </Flex>
      {item?.description && (
        <Text fontSize={"14px"} fontWeight={"400"}>
          {item.description}
        </Text>
      )}
      <Flex h={"2px"} w={"100%"} bg={"#DFDFDF"} mt={4}></Flex>
    </Flex>
  );
};

const agendaItems = [
  {
    title: "Opening words",
    date: "2023. July 21 - 10:00",
    speakers: ["Balder Bomans"],
    stageColor: "#EF4444",
  },
  {
    title: "Modular State of the Union",
    date: "2023. July 21 - 10:20",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#3B82F6",
  },
  {
    title: "World Engine: Horizontally Scaling Rollups With Shards",
    date: "2023. July 21 - 10:40",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#EF4444",
  },
  {
    title: "Anoma ❤️ Celestia: intent-centric rollups",
    date: "2023. July 21 - 11:00",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#EF4444",
  },
  {
    title: "Fireside chat with Sandeep of Polygon",
    date: "2023. July 21 - 11:20",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#EF4444",
  },
  {
    title: "Avail: Architecture and Use Cases",
    date: "2023. July 21 - 11:40",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#3B82F6",
  },
  {
    title: "Data Availability Panel",
    date: "2023. July 21 - 12:00",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#3B82F6",
  },
  {
    title: "Light nodes are not just a meme",
    date: "2023. July 21 - 12:20",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#3B82F6",
  },
  {
    title: "DA as broadband",
    date: "2023. July 21 - 12:40",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#3B82F6",
  },
  {
    title: "Lunch Break",
    date: "2023. July 21 - 13:00",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "transparent",
  },
  {
    title: "Bonsai: a Verifiable & ZK Computing Platform for a Modular World",
    date: "2023. July 21 - 14:00",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#22C55E",
  },
  {
    title: "Write Code, NOT Circuits",
    date: "2023. July 21 - 14:20",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#22C55E",
    description:
      "Privacy is hard. We describe the abstraction layers and modular technologies required to turn zero-knowledge cryptography\n" +
      "into a tool that can empower the next generation of web3 products.",
  },
  {
    title: "Shielded Transactions Are Rollups",
    date: "2023. July 21 - 14:40",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#22C55E",
  },
  {
    title: "Modular ZK Systems Panel",
    date: "2023. July 21 - 15:00",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#22C55E",
  },
  {
    title: "Break",
    date: "2023. July 21 - 15:20",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#22C55E",
  },
  {
    title: "Aggregation is all you need",
    date: "2023. July 21 - 15:30",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#22C55E",
  },
  {
    title:
      "Axiom: The first ZK coprocessor scaling data-rich applications on\n" +
      "Ethereum",
    date: "2023. July 21 - 15:50",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#22C55E",
  },
  {
    title: "Modular ZK Architecture Panel",
    date: "2023. July 21 - 16:10",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "#22C55E",
  },
  {
    title: "Fireside Chat with Mustafa and Mike",
    date: "2023. July 21 - 16:30",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "transparent",
  },
  {
    title: "Happy Hour",
    date: "2023. July 21 - 17:00",
    speakers: ["Mustafa Al-Bassam"],
    stageColor: "transparent",
  },
];
