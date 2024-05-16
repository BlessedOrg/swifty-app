export function calculateWinningProbability(tickets: number, users: string[]): string | number {
    const totalUsers = users.length;

    if (totalUsers === 0) {
        return 0;
    }

    const minTicketsUsers = Math.min(tickets, totalUsers);

    const probability = (minTicketsUsers / totalUsers) * 100;

    return probability.toFixed(0);
}