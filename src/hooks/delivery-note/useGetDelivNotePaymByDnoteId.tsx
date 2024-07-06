import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomTblBody } from "@/components/CustomTable/types";
import { initSuppReqPrm } from "^/config/supplier/config";
import { thsandSep } from "^/utils/helpers";
import { Session } from "next-auth";
import { getDelivNotePaymAPI } from "^/services/payment-deliverynote";
import {
  IPaymDelivNoteGetReq,
  PaymentDelivnoteResp,
} from "^/@types/models/paymentdelivnote";
import { formatDate } from "^/utils/dateFormatting";
import { calculatePaymDelivNoteTotal } from "^/config/purchase/config";

const useGetDelivNotePaymByDnoteId = (session: Session | null) => {
  const router = useRouter();
  const { id: dNoteId } = router.query;
  const queryClient = useQueryClient();

  const [reqPrm, setReqPrm] = useState<IPaymDelivNoteGetReq>({
    ...initSuppReqPrm,
    "param[deliverynoteid]": dNoteId ? String(dNoteId) : "",
  });

  useEffect(() => {
    if (dNoteId) {
      setReqPrm((prev) => ({
        ...prev,
        "param[deliverynoteid]": String(dNoteId),
      }));
    }
  }, [dNoteId]);

  const fetchPaymDelivNote = async (
    session: any,
    payload: IPaymDelivNoteGetReq
  ) => {
    if (!session?.accessToken || !reqPrm["param[deliverynoteid]"]) {
      return null;
    }

    const response = await getDelivNotePaymAPI(session, payload);

    if (response && response.data) {
      const { data: resData } = response;
      const prchse = resData.data.items;

      paymPurchTotal = calculatePaymDelivNoteTotal(prchse);

      await queryClient.setQueryData(["deliv-note-payment", dNoteId], prchse);

      return prchse;
    }

    return null;
  };

  const {
    data: delivNote,
    error: delivNoteErr,
    isLoading: delivNoteLoading,
  } = useQuery<PaymentDelivnoteResp[], Error>({
    queryKey: ["deliv-note-payment", dNoteId],
    queryFn: () => fetchPaymDelivNote(session, reqPrm),
    enabled: !!session && !!reqPrm["param[deliverynoteid]"],
    refetchOnMount: false,
  });

  let paymPurchTotal = delivNote ? calculatePaymDelivNoteTotal(delivNote) : 0;

  //build table row
  let tblBd: CustomTblBody[] = [];
  if (delivNote && Array.isArray(delivNote)) {
    tblBd = delivNote.map((x: PaymentDelivnoteResp) => ({
      items: [
        {
          value: formatDate(x.date.toString()),
          className: "text-left w-[15rem]",
        },
        {
          value: thsandSep(Number(x.amount)),
          className: "text-left w-[6rem] pl-0",
        },
        { value: x.paymentMode.name, className: "text-left w-[6rem] pl-0" },
        { value: x.description, className: "text-left w-[6rem] pl-0" },
      ],
    }));
  }

  return {
    reqPrm,
    tblBd,
    delivNote,
    delivNoteErr,
    delivNoteLoading,
    paymPurchTotal,
    fetchPaymDelivNote,
  };
};

export default useGetDelivNotePaymByDnoteId;
