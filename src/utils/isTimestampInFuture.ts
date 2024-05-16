function isTimestampInFuture(timestamp) {
  const now = Date.now();
  return timestamp > now;
}

export default isTimestampInFuture;
