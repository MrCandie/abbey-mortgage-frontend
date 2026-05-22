import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";

type PatchDataArgs = {
  url: string;
  body: any;
  message?: string;
  token: string;
  contentType?: string;
};

const patchData = async ({
  url,
  body,
  message,
  token,
  contentType = "application/json",
}: PatchDataArgs) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
    Authorization: `Bearer ${token}`,
  };

  try {
    const { data } = await axios.patch(url, body, { headers });

    if (message) {
      toast.success(message);
    }

    return data;
  } catch (error: any) {
    const statusCode = error?.response?.status || 500;
    const errorBody = error?.response?.data?.message || "Something went wrong";

    const message =
      typeof errorBody === "string" ? errorBody : "Something went wrong";

    toast.error(message);

    const customError: any = new Error(message);
    customError.statusCode = statusCode;

    throw customError;
  }
};

type UsePatchArgs = {
  queryKey: string;
  url: string;
  title?: string;
  onSuccess?: (data: any, variables: any) => void;
};

export const usePatch = ({ queryKey, url, title, onSuccess }: UsePatchArgs) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) =>
      patchData({
        url,
        body,
        message: title,
        token,
      }),

    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};
