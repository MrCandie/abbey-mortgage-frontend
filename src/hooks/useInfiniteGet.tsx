import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/auth";

type FetchPageArgs = {
  url: string;
  token: string;
  logout: () => void;
  pageParam: number;
  useHeaders: boolean;
};

const fetchPage = async ({
  url,
  token,
  logout,
  pageParam,
  useHeaders,
}: FetchPageArgs) => {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const { data } = await axios.get(url, {
      params: { page: pageParam },
      ...(useHeaders ? { headers } : {}),
    });

    return data;
  } catch (error: any) {
    const errMessage = error?.response?.data?.message || "Something went wrong";

    if (String(errMessage).toLowerCase() === "unauthenticated") {
      logout();
    }

    throw new Error(errMessage, { cause: error });
  }
};

type UseInfiniteGetArgs = {
  url: string;
  queryKey: string;
  useHeaders?: boolean;
  initialPageParam?: number;
  getNextPageParam?: (lastPage: any, allPages: any[]) => number | undefined;
};

const useInfiniteGet = ({
  url,
  queryKey,
  useHeaders = true,
  initialPageParam = 1,
  getNextPageParam,
}: UseInfiniteGetArgs) => {
  const { token, logout } = useAuth();

  return useInfiniteQuery({
    queryKey: [queryKey],
    initialPageParam,
    queryFn: ({ pageParam }) =>
      fetchPage({
        url,
        token,
        logout,
        pageParam,
        useHeaders,
      }),
    getNextPageParam:
      getNextPageParam ??
      ((lastPage: any) => {
        const pagination = lastPage?.pagination;
        if (!pagination) return undefined;

        const { page, pages } = pagination;

        if (page < pages) return page + 1;

        return undefined;
      }),
    // onError: () => {
    //   toast.error("An unexpected error occurred");
    // },
  });
};

export default useInfiniteGet;
