import { NextApplicationPage } from "^/@types/client";

export const withAuth = (Component: NextApplicationPage) => {
  Component.requireAuth = true;
  return Component;
};
