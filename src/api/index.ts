import axios, { AxiosResponse } from "axios";
import { IWhatToCreate } from "../types";

const axiosApi = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 300_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Make getApiResult generic
export const getApiResult = <T>(
  axiosResponse: AxiosResponse<{ result: T }>
): T => {
  return axiosResponse.data.result;
};

// Generate topics, returning string[]
export async function generateTopics(
  payload: IWhatToCreate
): Promise<string[]> {
  const response = await axiosApi.post<{ result: string[] }>(
    "/documents/topics",
    payload
  );

  return getApiResult<string[]>(response);
}
