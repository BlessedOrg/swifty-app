function isTimestampInFuture(timestamp) {
  return timestamp > new Date().getTime();
}

export default isTimestampInFuture;
