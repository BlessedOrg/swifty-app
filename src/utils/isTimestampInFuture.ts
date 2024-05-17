function isTimestampInFuture(timestamp) {
  return timestamp > Date.now();
}

export default isTimestampInFuture;
