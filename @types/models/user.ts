export enum Gender {
  Male = "male",
  Female = "female",
}

export interface IUserDocument extends Document {
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

export interface ISortOptions {
  name?: number;
  // Add other sorting options as needed
}
