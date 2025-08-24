import React, { createContext, useContext, useState, ReactNode } from "react";

// ----- 1. Define the shape of your data -----
export interface FormData {
  type: string;
  jurisdiction: string;
  industry: string;
  otherDetails: string;
  topics: string[];
  questions: {
    question: string;
    answer: string;
  }[];
}

// ----- 2. Define the context value -----
interface FormContextType {
  formData: FormData;
  setFormData: (
    value: Partial<FormData> | ((prev: FormData) => FormData)
  ) => void;
}

// ----- 3. Create the context -----
const FormContext = createContext<FormContextType | undefined>(undefined);

// ----- 4. Provider component -----
export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormDataState] = useState<FormData>(() => {
    const saved = localStorage.getItem("formData");
    return saved
      ? JSON.parse(saved)
      : {
          type: "",
          jurisdiction: "",
          industry: "",
          otherDetails: "",
          topics: [],
        };
  });

  // Wrapper to update state and persist to localStorage
  const setFormData = (
    value: Partial<FormData> | ((prev: FormData) => FormData)
  ) => {
    console.log(value, "set value ");
    setFormDataState((prev) => {
      const newState =
        typeof value === "function" ? value(prev) : { ...prev, ...value };
      localStorage.setItem("formData", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

// ----- 5. Custom hook for easier consumption -----
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context)
    throw new Error("useFormContext must be used within a FormProvider");
  return context;
};
