import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { buttonStyles } from "@/theme/components/button";
import { tabsStyles } from "@/theme/components/tab";
import { Poppins } from "next/font/google";
import { globalStyles } from "@/theme/styles";
import { components } from "@/theme/components/components";
import { breakpoints } from "@/theme/breakpoints";

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
  { breakpoints }
);
export default theme;
