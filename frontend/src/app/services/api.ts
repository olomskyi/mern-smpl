import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { BASE_URL } from "../../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const htoken = (getState() as RootState).user.token;
    const ltoken = localStorage.getItem("token");

    console.log("Header Token received:", htoken);
    console.log("Local Token received:", ltoken);

    const token = htoken ?? ltoken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    } else {
      console.log("NO token received!");
    }
    return headers;
  },
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
})
