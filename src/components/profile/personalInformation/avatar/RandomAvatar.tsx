import { minidenticon } from "minidenticons";
import { useMemo } from "react";
import { Box } from "@chakra-ui/react";

export const RandomAvatar = ({
  username = "unlogged_user",
  saturation = 50,
  lightness = 50,
  width = 52,
  height = 52,
  rounded = false,
  lighter = false
}) => {
  const svgURI = useMemo(
    () => "data:image/svg+xml;utf8," + encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness],
  );
  return (
    <Box bg={lighter ? "#E8E8E8" : "#D9D9D9"} borderRadius={rounded ? "50%" : "initial"}>
      <img src={svgURI} alt={username} width={width} height={height} />
    </Box>
  );
};
