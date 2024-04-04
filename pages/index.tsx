import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { EventsGrid } from "@/components/events/EventsGrid";
import { ReactNode } from "react";
import Head from "next/head";

export default function Home() {
  return (
    <Flex>
      <Head>
        <title>Blessed</title>
      </Head>
      <Tabs
        variant="soft-rounded"
        display={"flex"}
        flexDirection={"column"}
        gap={"4.5rem"}
        w={"100%"}
      >
        <TabList
          alignSelf={"center"}
          boxShadow={"0px 4px 18px 0px rgba(0, 0, 0, 0.17)"}
          rounded={"50px"}
        >
          <CustomTab>Where?</CustomTab>
          <CustomTab>When?</CustomTab>
          <CustomTab>Who?</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <EventsGrid />
          </TabPanel>
          <TabPanel>
            <EventsGrid />
          </TabPanel>
          <TabPanel>
            <EventsGrid />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

const CustomTab = ({ children }: { children: ReactNode }) => (
  <Tab
    py={{
      base: "10px",
      md: "24px",
    }}
    px={{
      base: "16px",
      md: "72px",
    }}
  >
    {children}
  </Tab>
);
