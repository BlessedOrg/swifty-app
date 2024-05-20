export function formatRandomNumber(num: bigint | number, tickets: number) {
  if (tickets === 0) return 0;
  return Number(num) % tickets;
}


export function formatRandomNumberToFirstTwoDigit(num: bigint | number, tickets: number) {
  if (tickets === 0) return 0;
  return Number(num).toString().slice(0,2)
}
