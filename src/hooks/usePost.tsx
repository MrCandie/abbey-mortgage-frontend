import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";

type PostDataArgs = {
  url: string;
  body: any;
  message?: string;
  token: string;
  contentType?: string;
  authorization?: string;
  logout: () => void;
};

const postData = async ({
  url,
  body,
  message,
  token,
  contentType = "application/json",
  authorization,
  logout,
}: PostDataArgs) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
    Authorization: authorization || `Bearer ${token}`,
  };

  try {
    const { data } = await axios.post(url, body, { headers });

    if (message) {
      toast.success(message);
    }

    return data;
  } catch (error: any) {
    const statusCode = error?.response?.status || 500;
    const errorBody =
      error?.response?.data?.message || "Something went wrong";

    if (String(errorBody).toLowerCase() === "unauthenticated") {
      logout();
    }

    const message =
      typeof errorBody === "string"
        ? errorBody
        : "Something went wrong";

    toast.error(message);

    const customError: any = new Error(message);
    customError.statusCode = statusCode;

    throw customError;
  }
};

type UsePostArgs = {
  queryKey: string;
  url: string;
  title?: string;
  onSuccess?: (data: any, variables: any) => void;
  onError?: (
    error: { statusCode: number | string; message: string },
    variables: any
  ) => void;
  contentType?: string;
  authorization?: string;
};

export const usePost = ({
  queryKey,
  url,
  title,
  onSuccess,
  onError,
  contentType,
  authorization,
}: UsePostArgs) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) =>
      postData({
        url,
        body,
        message: title,
        token,
        contentType,
        authorization,
        logout,
      }),

    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },

    onError: (error: any, variables) => {
      const statusCode = error?.statusCode || "Unknown";
      const errorMessage = error?.message || "An error occurred";

      onError?.(
        { statusCode, message: errorMessage },
        variables
      );
    },
  });
};