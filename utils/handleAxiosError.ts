import axios from "axios";

export const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    // Handle the error based on the HTTP status code
    const serverResponse = error.response;
    throw new Error(
      serverResponse?.data.message || "An unknown error occurred"
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error("There was an error in the request setup");
  }
};
