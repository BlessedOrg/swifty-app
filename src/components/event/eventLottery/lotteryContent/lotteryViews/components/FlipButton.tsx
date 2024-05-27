import {Button, ButtonProps} from "@chakra-ui/react";
import { Undo2 } from "lucide-react";

interface IProps extends ButtonProps{
  onClick: any;
}
export const FlipButton = ({ onClick, ...rest }: IProps) => {
  return (
    <Button
      onClick={onClick}
      bg={"none"}
      border={"1px solid"}
      h={"40px"}
      fontSize={"1rem"}
      borderLeft={"none"}
      roundedTopLeft={0}
      roundedBottomLeft={0}
      roundedTopRight={"24px"}
      roundedBottomRight={"24px"}
      px={4}
      minW={"176px"}
      rightIcon={<Undo2 />}
      style={{ transform: "translateX(-1rem)" }}
      mt={4}
      borderColor={"#1D1D1B"}
      {...rest}
    >
      Take a break
    </Button>
  );
};
