import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// 1. Define the shape of your data
interface FormData {
  type: string;
  jurisdiction: string;
  industry: string;
  otherDetails: string;
  topics: string[];
}

// 2. Define the context value (data + setter)
interface FormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// 3. Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// 4. Create a provider component
export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>({
    type: "",
    jurisdiction: "",
    industry: "",
    otherDetails: "",
    topics: [],
  });

  useEffect(() => {
    console.log(formData, new Date());
  }, [formData.type]);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

// 5. Create a custom hook for easier consumption
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
