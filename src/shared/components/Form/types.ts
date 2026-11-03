export type FormDataType = {
  name: string;
  phoneNumber: string;
  blogAddress: string;
  message?: string;
};

export interface FormUserData {
  name?: string | null;
  phoneNumber?: string | null;
  blogAddress?: string | null;
}

export interface FormProps {
  onClick?: (v: FormDataType) => void;
  showTextArea?: boolean;
  buttonText?: string;
  user?: FormUserData | null;
}
