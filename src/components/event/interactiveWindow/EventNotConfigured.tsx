import { Box, Button, Divider, Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import { getExplorerUrl } from "services/web3Config";
import { Check, X } from "lucide-react";
import { fetcher } from "requests/requests";

const PropListItem = ({ objKey, value, isListItem }) => (
  <ListItem>
    <Flex justifyContent="space-between" w="100%">
      <span>{objKey} </span>
      <span>{value ? <Check color="green" /> : <X color="red" />}</span>
    </Flex>
    {!isListItem ? <Divider style={{ borderColor: "#b4b4b4" }} /> : null}
  </ListItem>
);

const LinkWrapper = ({ children, value }) =>
  value ? <Link href={getExplorerUrl(value)} rel="noopener nofollow" target="_blank">{children}</Link> : children;

const EventNotConfigured = ({ eventData }) => {
  const retry = async () => (
    await fetcher(`/api/events/${eventData?.id}/resume`)
  );

  return (
    <Box>
      <Text align="center" fontWeight="bold" fontSize="150%" mb={6} color="red">
        Event is not configured properly on-chain wise!
      </Text>
      <Box maxWidth="350px" marginInline="auto">
        <List>
          {Object.entries(eventData.checks).map(([key, value], index) => (
            <LinkWrapper value={value}>
              <PropListItem
                objKey={key}
                value={value}
                isListItem={Object.keys(eventData.checks).length - 1 === index}
              />
            </LinkWrapper>
          ))}
        </List>
        <Flex justifyContent="center">
          <Button
            mt={8}
            onClick={retry}
            bg={"#69737D"}
            color={"#fff"}
            _hover={{
              bg: "#fff",
              color: "#69737D"
            }}
          >
            Retry
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default EventNotConfigured;
