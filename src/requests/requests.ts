export const swrFetcher = async (url, options?: RequestInit | undefined) => {
  return await fetch(url, options).then((res: Response) => res.json());
};
