import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const getAccessToken = () => AsyncStorage.getItem(ACCESS_KEY);
const getRefreshToken = () => AsyncStorage.getItem(REFRESH_KEY);
const setAccessToken = (t: string) => AsyncStorage.setItem(ACCESS_KEY, t);
const setRefreshToken = (t: string) => AsyncStorage.setItem(REFRESH_KEY, t);
const clearAuthStorage = () => AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
import { toast } from "@/utils/toast";
import { BASE_URL } from "@/config";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      const refreshResult = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResult.ok) {
        const data = await refreshResult.json();
        const newAccess = data?.data?.accessToken ?? data?.accessToken;
        const newRefresh = data?.data?.refreshToken ?? data?.refreshToken;

        if (newAccess) {
          await setAccessToken(newAccess);
          if (newRefresh) await setRefreshToken(newRefresh);
          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        toast.error("Session expired. Please log in again.");
        await clearAuthStorage();
      }
    } else {
      await clearAuthStorage();
    }
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 30,
  tagTypes: ["user", "Profile", "notification"],
  endpoints: () => ({}),
});

export default apiSlice;
