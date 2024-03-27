"use client";
export const periodDate = (period: {
  from: Date | string;
  to: Date | string;
}) => {
  const from =
    typeof period.from === "string" ? new Date(period.from) : period.from;
  const to = typeof period.to === "string" ? new Date(period.to) : period.to;

  const month = from.toLocaleString("en-US", { month: "long" });
  const dayFrom = from.getDate();
  const dayTo = to.getDate();
  const year = from.getFullYear();

  return `${month} ${dayFrom} - ${dayTo} ${year}`;
};
