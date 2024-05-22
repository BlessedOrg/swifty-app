import { keyframes } from "@chakra-ui/react";

export const shake = keyframes`
    0% {
        transform: rotate(-5deg);
    }
    25% {
        transform: rotate(0deg);
    }
    50% {
        transform: rotate(3deg);
    }
    75% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(-5deg);
    }

`;
export const smallScale = keyframes`
    0% {
        scale: 1;
    }
    25% {
        scale: 1.05;
    }
    50% {
        scale: 1;

    }
    75% {
        scale: 0.95;

    }
    100% {
        scale: 1;
    }

`;
export const shakeWithResize = keyframes`
    0% {
        transform: rotate(-2deg);
        scale: 1;
    }
    25% {
        transform: rotate(0deg);
        scale: 1.05;
    }
    50% {
        transform: rotate(2deg);
        scale: 1;

    }
    75% {
        transform: rotate(0deg);
        scale: 0.95;

    }
    100% {
        transform: rotate(-2deg);
        scale: 1;

    }

`;
