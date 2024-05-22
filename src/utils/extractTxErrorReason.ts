export function extractTxErrorReason(text) {
    const reasonPattern = /reason:\s*([\s\S]*?)\n\nContract Call:/;
    const match = text.match(reasonPattern);
    return match ? match[1].trim() : null;
}