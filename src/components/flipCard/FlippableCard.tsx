"use client";
import Card from "./card/Card";
import { CSSTransition } from "react-transition-group";
import { ReactNode } from "react";
import { FlexProps, Flex } from "@chakra-ui/react";

interface IProps {
  front: ReactNode;
  back: ReactNode;
  showFront: boolean;
}
function FlippableCard({
  front,
  back,
  showFront,
  ...rest
}: IProps & FlexProps) {
  return (
    <Flex h={{base: "242px", iwMid: "452px"}} style={{ perspective: "1000px" }} {...rest}>
      <CSSTransition in={showFront} timeout={300} classNames="flip">
        <Card front={front} back={back} />
      </CSSTransition>
    </Flex>
  );
}

export default FlippableCard;
