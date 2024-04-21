import { mode } from "@chakra-ui/theme-tools";

export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        color: "red",
        borderRadius: "14px",
        boxShadow: "45px 76px 113px 7px rgba(112, 144, 176, 0.08)",
        transition: ".25s all ease",
        boxSizing: "border-box",
        _focus: {
          boxShadow: "none",
        },
        _active: {
          boxShadow: "none",
        },
      },
      variants: {
        purple: () => ({
          borderRadius: "10px",
          color: "#fff",
          background:
            "linear-gradient(163deg, rgba(153,119,212,1) 0%, rgba(99,55,174,1) 100%)",
          height: "52px",
          fontWeight: "bold",
          boxShadow:
            "0px 4px 6px -1px rgba(99, 55, 174, 0.25), 0px 4px 6px -1px rgba(99, 55, 174, 0.25), 0px 2px 4px 0px rgba(99, 55, 174, 0.25) inset",
          _disabled: {
            background: "linear-gradient(180deg, #D3D3D3 0%, #BEBEBE 100%)",
            opacity: 1,
          },
          _hover: null,
        }),
        red: () => ({
          borderRadius: "8px",
          color: "#fff",
          background: "#FF3300",
          height: "52px",
          fontWeight: "bold",
          _disabled: {
            background: "linear-gradient(180deg, #D3D3D3 0%, #BEBEBE 100%)",
            opacity: 1,
          },
          _hover: null,
        }),
      },
    },
  },
};
