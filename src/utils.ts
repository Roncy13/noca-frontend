import { IFormValue } from "./types";
import Joi from "joi";

export function GenerateFormValue() {
  return {
    value: "",
    error: null,
  } as IFormValue;
}

export const ValidateForm = () => {};
