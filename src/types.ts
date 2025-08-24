export interface IFormValue {
  value: string;
  error: string | null;
}

export interface IWhatToCreate {
  type: string;
  jurisdiction: string;
  industry: string;
  otherDetails: string;
}

export interface IFollowupQuestion {
  question: string;
  suggested_answer: string;
}
