export function extractTxErrorReason(text) {
  if (text.includes("User rejected the request.")) {
    return "Transaction rejected"
  }
  const reasonPattern = /reason:\s*([\s\S]*?)\n\nContract Call:/;
  const match = text.match(reasonPattern);
  return match ? match[1].trim() : null;
}