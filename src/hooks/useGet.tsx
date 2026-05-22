import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/auth";

type FetchDataFn = (
  url: string,
  token: string,
  logout: () => void,
  useHeaders: boolean,
) => Promise<any>;

const fetchData: FetchDataFn = async (url, token, logout, useHeaders) => {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const { data } = await axios.get(url, useHeaders ? { headers } : {});

    return data;
  } catch (error: any) {
    const errMessage = error?.response?.data?.message || "Something went wrong";

    if (String(errMessage).toLowerCase() === "unauthenticated") {
      logout();
    }

    throw new Error(errMessage, { cause: error });
  }
};

type UseGetArgs = {
  url: string;
  queryKey: string;
  useHeaders?: boolean;
};

export const useGet = ({ url, queryKey, useHeaders = true }: UseGetArgs) => {
  const { token, logout } = useAuth();

  return useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchData(url, token, logout, useHeaders),
    // onError: () => {
    //   toast.error("An unexpected error occurred");
    // },
  });
};
