import axios, { AxiosResponse } from "axios";
import { IFollowupQuestion, IWhatToCreate } from "../types";

const axiosApi = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 300_000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ITopicResponse {
  topics: string[];
}

// Make getApiResult generic
export const getApiResult = <T>(
  axiosResponse: AxiosResponse<{ result: T }>
): T => {
  return axiosResponse.data.result;
};

// Generate topics, returning string[]
export async function generateTopics(
  payload: IWhatToCreate
): Promise<ITopicResponse> {
  const response = await axiosApi.post<{ result: ITopicResponse }>(
    "/documents/topics",
    payload
  );

  return getApiResult<ITopicResponse>(response);
}

// Generate topics, returning string[]
export async function generateFollowupQuestion(
  payload: IWhatToCreate & { topic: string }
): Promise<IFollowupQuestion> {
  const response = await axiosApi.post<{ result: IFollowupQuestion }>(
    "/documents/askFollowupQuestion",
    payload
  );

  return getApiResult<IFollowupQuestion>(response);
}
