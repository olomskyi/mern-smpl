
import type { User } from "../types";
import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User; token?: string }, { email: string; password: string }>({
      query: (userData) => ({
        url: "/login",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: User, meta) => {
        const tokenHeader = meta?.response?.headers.get("Authorization");
        const cleanToken = tokenHeader ? tokenHeader.replace("Bearer ", "") : undefined;
        console.log("Transform token:", cleanToken);
        return { user: response, token: cleanToken };
      },
    }),
    register: builder.mutation<
      { email: string; password: string; name: string },
      { email: string; password: string; name: string }
    >({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    current: builder.query<User, undefined>({
      query: () => ({
        url: "/current",
        method: "GET",
      }),
    }),
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation<User, { userData: FormData; id: string }>({
      query: ({ userData, id }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: userData,
      }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useCurrentQuery,
  useLazyCurrentQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
} = userApi;
export const { endpoints: { login, register, current, getUserById, updateUser } } = userApi;
