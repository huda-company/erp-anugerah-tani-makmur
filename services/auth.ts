import axios, { AxiosError, AxiosResponse } from "axios";

import { API_VERSION, BASE_URL } from "^/config/env";
import { SignUpReq, SignUpVerifyReq } from "^/@types/models/auth";

export const signInAPI = async (credentials: any) => {
  try {
    return await axios.post(
      `${BASE_URL}/api/${API_VERSION}/signin`,
      credentials
    );
  } catch (error: any) {
    return error;
  }
};

export const signupAPI = async (params: SignUpReq) => {
  try {
    return await axios.post(`${BASE_URL}/api/${API_VERSION}/signup`, params);
  } catch (error: any) {
    // If the error is an AxiosError with a response, throw the response data
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      // If it's not an AxiosError or there is no response, throw the original error
      throw error;
    }
  }
};

export const signupVerifAPI = async (params: SignUpVerifyReq) => {
  try {
    return await axios.post(
      `${BASE_URL}/api/${API_VERSION}/signup/verify`,
      params
    );
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};
