import { Flex, Grid, Text } from "@chakra-ui/react";
import Image from "next/image";
import { HeartCrack } from "lucide-react";

export const Speakers = ({ speakers }: { speakers: IEvent["speakers"] }) => {
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      textAlign={"center"}
      w={"100%"}
      my={'10%'}
      px={'2rem'}
      backgroundImage={'/images/7bars_grey.png'}
      backgroundRepeat={'no-repeat'}

    >
      <Flex flexDirection={'column'} gap={0} mb={17}>
        <Text textTransform={'uppercase'} fontWeight={'bold'}>holy</Text>
        <Text fontWeight={"bold"} fontSize={"3rem"} textTransform={'uppercase'}>
          Speakers
        </Text>
        <Text>Don't miss these wonderful people</Text>
      </Flex>

      {!speakers?.length && (
        <Flex
          my={16}
          justifyContent={"center"}
          textAlign={"center"}
          gap={2}
          alignItems={"center"}
          fontSize={"1.2rem"}
        >
          <Text fontWeight={"bold"}>No speakers yet</Text>
          <HeartCrack />
        </Flex>
      )}
      {!!speakers?.length && (
          <Flex maxW="1260px" overflowX="auto" gap={10} w={'100%'}>

            {speakers.map((speaker, idx) => {
              const id= (idx % 3)
              const speakerColorPerOdd = {
                0: {
                  bg: "rgba(6, 248, 129, 1)",
                  color: "#000"
                },
                1: {
                  bg: "rgba(97, 87, 255, 1)",
                  color: "#fff"
                },
                2: {
                  bg: "rgba(29, 29, 27, 1)",
                  color: "#fff"
                }
              }
              return (
                  <Flex
                      {...(!!speaker.url ? { as: "a", href: speaker.url } : {})}
                      gap={4}
                      flexDirection={"column"}
                      key={idx}
                      alignItems={"center"}
                      textAlign={"center"}
                      bg={speakerColorPerOdd[id]?.bg}
                      color={speakerColorPerOdd[id]?.color}
                      px={2}
                      pt={4}
                      pb={8}
                      w={'100%'}
                      // minW={'340px'}
                      maxW={'340px'}
                      flexShrink={0}
                      h={'424px'}
                      fontSize={"1.5rem"}
                      fontWeight={'bold'}
                  >
                    <Image
                        key={idx}
                        src={speaker.avatarUrl || "/images/logo_dark.svg"}
                        alt={`speaker ${speaker.name} avatar`}
                        width={300}
                        height={300}
                        style={{
                          objectFit: "cover",
                          borderRadius: "100%",
                          width: "300px",
                          height: "300px",
                        }}
                    />
                    <Flex flexDirection={"column"} alignItems={"center"} fontSize={'20px'}>
                      <Text>
                        {speaker.name}
                      </Text>
                      {!!speaker.position && (
                          <Text >{speaker.position}</Text>
                      )}
                      {!!speaker.company && (
                          <Text >{speaker.company}</Text>
                      )}
                    </Flex>
                  </Flex>
              )
            })}
          </Flex>
      )}
    </Flex>
  );
};
