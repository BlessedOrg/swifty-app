const getMatchingKey = (addresses, contractAddress) => {
  for (const [key, value] of Object.entries(addresses)) {
    if (value === contractAddress) {
      return key;
    }
  }
  return null;
}

export default getMatchingKey;
