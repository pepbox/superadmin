import { api } from "../../app/api";
import { API_TAGS } from "../../app/apiTags";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),

    fetchUser: build.query({
      query: () => ({
        url: "/auth/fetch",
        method: "GET",
      }),
      providesTags: [API_TAGS.AUTH],
    }),

    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),
  }),
});

export const { useLoginMutation, useFetchUserQuery, useLogoutMutation } = authApi;
