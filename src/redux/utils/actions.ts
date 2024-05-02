import { utilsActions } from "./slices";
import { AppDispatch, AppThunk } from "../store";
import { toastActions } from "../toast/slices";

const { logout } = utilsActions;
const { resetToast } = toastActions;

const callLogout = (): AppThunk => (dispatch: AppDispatch) => {
  dispatch(logout());
};

const callResetToast = (): AppThunk => (dispatch: AppDispatch) => {
  dispatch(resetToast());
};

const actions = {
  callLogout,
  callResetToast,
};

export default actions;
