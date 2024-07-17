import {extendTheme, HTMLChakraProps, type ThemeConfig, ThemingProps} from "@chakra-ui/react";
import { buttonStyles } from "@/theme/components/button";
import { tabsStyles } from "@/theme/components/tab";
import { Poppins } from "next/font/google";
import { globalStyles } from "@/theme/styles";
import { components } from "@/theme/components/components";
import { breakpoints } from "@/theme/breakpoints";
import {CardComponent} from "@/theme/components/card";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const theme = extendTheme(
  { config },
  buttonStyles,
  tabsStyles,
  {
    fonts: {
      Poppins: poppins.style.fontFamily,
    },
  },
  globalStyles,
  components,
    CardComponent,
  { breakpoints }
);
export default theme;
export interface CustomCardProps extends HTMLChakraProps<"div">, ThemingProps {}