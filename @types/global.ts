export enum FormMode {
  ADD = "ADD",
  VIEW = "VIEW",
  EDIT = "EDIT",
}

export type BaseFormProps = {
  mode: FormMode;
  doRefresh: () => void;
};

export type Options = {
  value: string;
  text: string;
};
