export function formatRandomNumber(num: bigint | number, tickets: number) {
    return Number(num) % tickets;
}
