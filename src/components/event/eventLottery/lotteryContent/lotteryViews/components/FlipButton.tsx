import { Button } from "@chakra-ui/react";
import { Undo2 } from "lucide-react";

export const FlipButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      bg={"none"}
      border={"1px solid"}
      h={"40px"}
      fontSize={"1rem"}
      borderLeft={'none'}
      roundedTopLeft={0}
      roundedBottomLeft={0}
      roundedTopRight={"24px"}
      roundedBottomRight={"24px"}
      px={4}
      minW={'176px'}
      rightIcon={<Undo2 />}
      style={{transform: "translateX(-1rem)"}}
      mt={4}
      borderColor={'#1D1D1B'}
    >
      Take a break
    </Button>
  );
};
