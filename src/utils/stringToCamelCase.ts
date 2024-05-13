export function stringToCamelCase(input: string): string {
    const words = input.toLowerCase().split(' ');
    for (let i = 1; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join('');
}