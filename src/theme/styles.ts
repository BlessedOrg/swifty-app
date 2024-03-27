import { mode } from "@chakra-ui/theme-tools";
import { colors } from "./colors";

export const globalStyles = {
  colors: colors,
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("#fdfeff", "#242424")(props),
      },
      input: {
        color: "gray.700",
      },
    }),
  },
};
