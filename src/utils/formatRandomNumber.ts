export function formatRandomNumber(num: bigint | number, tickets: number) {
  if (tickets === 0) return 0;
  return Number(num) % tickets;
}
