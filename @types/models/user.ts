import { BaseFormProps, FormMode } from "../global";

export enum Gender {
  Male = "male",
  Female = "female",
}

export interface IUserDocument extends Document {
  removed: string;
  removedBy: string;
  enabled: boolean;
  name: string;
  email: string;
  password: string;
  plainPassword: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  phoneVerifAt: Date;
  emailVerifAt: Date;
  emailVerifCode: string;
  roles: string[];
}

export interface IUserFieldRequest {
  sort: {
    key: "name";
    direction: string;
  };
  query: {
    name: string;
    id?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    startDate?: Date;
    endDate?: Date;
    "sort[key]"?: IUserFieldRequest["sort"]["key"];
    "sort[direction]"?: IUserFieldRequest["sort"]["direction"];
  };
}

export interface ISortOptions {
  name?: number;
  // Add other sorting options as needed
}

export type IUserForm = {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  enabled: string;
  birthDate: string;
};

export type UserFormProps = {
  mode: FormMode;
  initialFormVals: IUserForm;
  doRefresh: () => void;
} & BaseFormProps;
