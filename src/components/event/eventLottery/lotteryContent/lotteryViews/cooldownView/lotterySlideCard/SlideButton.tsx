import { Button, ButtonProps } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface FormFieldProps extends ButtonProps {
  children?: string | ReactNode;
}

export const SlideButton = ({ children, ...rest }: FormFieldProps) => {
  return (
    <Button
      bg={"#665CFB"}
      h={"52px"}
      rounded={"10px"}
      color={"#fff"}
      px={8}
      border={"1px solid"}
      borderColor={"#1D1D1B"}
      {...rest}
    >
      {children}
    </Button>
  );
};
