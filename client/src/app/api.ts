import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import { tagTypes } from "./apiTags";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_BASE_URL,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (!args) {
    throw new Error("Arguments for baseQuery cannot be undefined");
  }

  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    console.warn("Access token expired. Attempting refresh...");

    const refreshEndpoint = "/auth/refresh-token";

    const refreshResult = await baseQuery(
      { url: refreshEndpoint, method: "POST" },

      api,

      extraOptions
    );
    if (refreshResult.data) {
      api.dispatch({
        type: "auth/tokenRefreshed",
        payload: refreshResult.data,
      });
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.warn("Refresh token invalid. Logging out.");
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: tagTypes,
  endpoints: () => ({}),
});
