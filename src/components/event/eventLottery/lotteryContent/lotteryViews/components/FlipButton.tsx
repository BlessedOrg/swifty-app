import { Button } from "@chakra-ui/react";

export const FlipButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      bg={"none"}
      border={"1px solid"}
      h={"3rem"}
      fontSize={"20px"}
      rounded={"24px"}
      px={4}
      w={"120px"}
    >
      Flip
    </Button>
  );
};
