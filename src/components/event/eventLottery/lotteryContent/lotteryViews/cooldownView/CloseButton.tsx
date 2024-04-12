import { X } from "lucide-react";
import { Button, ButtonProps } from "@chakra-ui/react";

interface IProps extends ButtonProps {
  onClick: () => void;
}
export const CloseButton = ({ onClick, ...rest }: IProps) => {
  return (
    <Button
      w={"50px"}
      h={"50px"}
      onClick={onClick}
      rounded={"100%"}
      bg={"transparent"}
      border={"1px solid"}
      p={0}
      {...rest}
    >
      <X size={26} />
    </Button>
  );
};
