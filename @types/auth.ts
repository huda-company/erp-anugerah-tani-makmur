export type SignUpReq = {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  birthDate: string;
};

export type SignUpVerifyReq = {
  type: string;
  email: string;
  code: string;
};
