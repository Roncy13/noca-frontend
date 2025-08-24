import axios, { AxiosResponse } from "axios";
import {
  IFollowupQuestion,
  IGenerateDraftSections,
  IGenerateSectionContent,
  IWhatToCreate,
} from "../types";
export const BASE_URL = "http://localhost:4000";

const axiosApi = axios.create({
  baseURL: BASE_URL,
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

// Generate topics, returning string[]
export async function generateDraftSections(
  payload: IWhatToCreate & { supportingDetails: string[] }
): Promise<IGenerateDraftSections> {
  const response = await axiosApi.post<{ result: IGenerateDraftSections }>(
    "/documents/generateDraft",
    payload
  );

  return getApiResult<IGenerateDraftSections>(response);
}

// Generate topics, returning string[]
export async function generateSectionContent(
  payload: IWhatToCreate & {
    supportingDetails: string[];
    outline: string;
    no: number;
  }
): Promise<IGenerateSectionContent> {
  const response = await axiosApi.post<{ result: IGenerateSectionContent }>(
    "/documents/generateSectionContent",
    payload
  );

  return getApiResult<IGenerateSectionContent>(response);
}

export async function updateLogoAndFont(
  font: string,
  logo: string
): Promise<any> {
  const response = await axiosApi.post<{ result: any }>(
    "/documents/attachInformation",
    { font, logo }
  );

  return getApiResult<any>(response);
}

export async function updateContent(
  content: string,
  index: number
): Promise<IGenerateSectionContent> {
  const response = await axiosApi.post<{ result: IGenerateSectionContent }>(
    "/documents/updateContent",
    { content, index }
  );

  return getApiResult<IGenerateSectionContent>(response);
}
