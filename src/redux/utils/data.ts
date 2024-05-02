import type { SidebarState, UtilsState } from "./models";

const initialSidebar: SidebarState = {
  show: true,
};

export const initialState: UtilsState = {
  sidebar: initialSidebar,
};
