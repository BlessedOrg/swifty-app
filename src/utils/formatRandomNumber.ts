export function formatRandomNumber(num: bigint | number, tickets: number) {
  if (tickets === 0) return 0;
  return Number(num) % tickets;
}


export function formatRandomNumberToFirstTwoDigit(num: bigint | number, tickets: number) {
  if(typeof num === 'bigint'){
    return BigInt(num).toString().slice(0,2)
  }
  if (tickets === 0) return 0;
  return Number(num).toString().slice(0,2)
}
