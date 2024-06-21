export const fetcher = async (
  url: string,
  options?: RequestInit | undefined
) => {
  const { headers, ...rest } = options || {};

  return fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  }).then((res: Response) => res.json());
};
