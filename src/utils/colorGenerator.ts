export const colorGenerator = () => {
  const minBrightness = 180;
  const maxColorValue = 255;

  const red = Math.floor(
    Math.random() * (maxColorValue - minBrightness + 1) + minBrightness,
  );
  const green = Math.floor(
    Math.random() * (maxColorValue - minBrightness + 1) + minBrightness,
  );
  const blue = Math.floor(
    Math.random() * (maxColorValue - minBrightness + 1) + minBrightness,
  );

  return `rgb(${red}, ${green}, ${blue})`;
};
