import { GetStaticPaths } from "next";

// Define the getStaticPaths function
export const getStaticPaths: GetStaticPaths = async () => {
  // Return an empty array if the paths are not known at build time
  return {
    paths: [],
    fallback: true, // Set fallback to true if some paths may not be known at build time
  };
};
