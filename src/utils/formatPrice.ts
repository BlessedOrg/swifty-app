export const formatPrice = (price: number | null) => {
  if (typeof price === "number") {
    const formattedPrice = price / 100;
    return formattedPrice;
  }

  return "Wrong format";
};
