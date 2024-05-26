import useAppSelector from "./useAppSelector";
import useAppDispatch from "./useAppDispatch";
import {
  actions as toastActs,
  selectors as toastSelectors,
} from "@/redux/toast";

const useCloseAlertModal = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(toastSelectors.toast);

  const closeAlertModal = async () => {
    await dispatch(
      toastActs.callShowToast({
        ...toast,
        show: false,
      })
    );
  };
  return { closeAlertModal };
};

export default useCloseAlertModal;
