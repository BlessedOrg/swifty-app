import { mode } from "@chakra-ui/theme-tools";

const colors = {
  gray: {
    400: "#FAFCFE",
  },
  bgDark: "#242424",
  brand: "#9747FF",
  neonGreen: {
    50: "#e6fff2",
    100: "#b3ffdc",
    200: "#80ffc6",
    300: "#4dffb0",
    400: "#1aff9a",
    500: "#06f881", // main neonGreen color
    600: "#00cc66",
    700: "#009f4d",
    800: "#007333",
    900: "#00471a",
  },
};


export const globalStyles = {
  colors,
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("#fdfeff", "#242424")(props),
      },
      input: {
        color: "gray.700",
      },
      h1: {
        fontFamily: "TT Bluescreens"
      },
      h2: {
        fontFamily: "TT Bluescreens"
      },
      h3: {
        fontFamily: "TT Bluescreens"
      },
      h4: {
        fontFamily: "TT Bluescreens"
      },
    }),
  },
};
