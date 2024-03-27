import { mode } from "@chakra-ui/theme-tools";

export const tabsStyles = {
  components: {
    Tabs: {
      variants: {
        "soft-rounded": {
          tab: {
            color: mode("#000", "#fff"),
            padding: "24px 72px",
            _selected: {
              color: mode("#000", "#fff"),

              bg: "rgba(151, 71, 255, 0.2)",
            },
          },
        },
      },
    },
  },
};
