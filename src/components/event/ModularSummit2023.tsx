import { useEffect, useRef, useState } from "react";
import { Box, Divider, Grid, GridItem, Heading, Link, List, ListItem, Text, useMediaQuery } from "@chakra-ui/react";

export const ModularSummitVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState(videos[0].url);
  const [isMobile] = useMediaQuery("(max-width: 767px)");
  const [listHeight, setListHeight] = useState(350);
  const listRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (listRef.current) {
        setListHeight((listRef as any)?.current.offsetHeight);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box p={5}>
      <Heading as="h2" size="xl" mb={10}>
        What happened at Modular Summit 2023
      </Heading>
      <Grid templateColumns={`repeat(${isMobile ? 1 : 2}, 1fr)`} gap={6}>
        <GridItem>
          <Box
            as="iframe"
            width="100%"
            height={listHeight}
            src={selectedVideo}
            title="Modular Summit Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </GridItem>
        <GridItem>
          <List spacing={3} ref={listRef}>
            {videos.map(video => (
              <ListItem key={video.url}>
                <Link
                  onClick={() => setSelectedVideo(video.url)}
                  cursor="pointer"
                >
                  <Text
                    color={selectedVideo === video.url ? "var(--neonGreen)" : "initial"}
                  >
                    <strong>{video.title}</strong>
                  </Text>
                  <Text>
                    {video.speakers}
                  </Text>
                </Link>
                <Divider />
              </ListItem>
            ))}
          </List>
        </GridItem>
      </Grid>
    </Box>
  );
};

const videos = [
  {
    title: "The End Game",
    speakers: "Mustafa Al-Bassam, Anatoly Yakovenko, Vitalik Buterin, Tarun Chitra",
    url: "https://www.youtube.com/embed/9t8JCf_XWmg"
  },
  {
    title: "Aggregation is all you need",
    speakers: "Uma Roy",
    url: "https://www.youtube.com/embed/DX938dphios"
  },
  {
    title: "Exploring MEV Capture in Modular Systems",
    speakers: "Evan Forbes",
    url: "https://www.youtube.com/embed/AVKS1Km2pG8"
  },
  {
    title: "Builders and More Advanced Forms of Aggregation",
    speakers: "Vitalik Buterin",
    url: "https://www.youtube.com/embed/TSLUpOpsPF0"
  },
  {
    title: "Modular Devrel Panel: Build Whatever",
    speakers: "Yaz Khoury, Camila Ramos, Henri Lieutaud, David Phelps, Daniel Helm",
    url: "https://www.youtube.com/embed/cYUvGwDZbs4"
  },
  {
    title: "Celestia Light Node Tutorial",
    speakers: "Josh Stein",
    url: "https://www.youtube.com/embed/3kLuHOJariY"
  },
  {
    title: "Astria’s Vision for the Endgame",
    speakers: "Josh Bowen",
    url: "https://www.youtube.com/embed/_fRsXlWyeaA"
  }
];
