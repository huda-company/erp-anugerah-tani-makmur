import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomTblBody } from "@/components/CustomTable/types";
import { DelivNoteResp, IDelivNoteGetReq } from "^/@types/models/deliverynote";
import { getDelivNoteAPI } from "^/services/delivery-note";
import { initSuppReqPrm } from "^/config/supplier/config";
import { thsandSep } from "^/utils/helpers";
import { Session } from "next-auth";
import { initialPaymPurchaseForm } from "^/config/payment-purchase/config";
import { PaymPurchItem } from "^/@types/models/paymentpurchase";

const useGetDelivNoteById = (session: Session | null) => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const [reqPrm, setReqPrm] = useState<IDelivNoteGetReq>({
    ...initSuppReqPrm,
    id: id ? String(id) : "",
  });

  useEffect(() => {
    if (id) {
      setReqPrm((prev) => ({
        ...prev,
        id: String(id),
      }));
    }
  }, [id]);

  const fetchDelivNote = async (session: any, payload: IDelivNoteGetReq) => {
    if (!session?.accessToken || !reqPrm.id) {
      return null;
    }

    const response = await getDelivNoteAPI(session, payload);

    if (response && response.data) {
      const { data: resData } = response;
      const prchse = resData.data.items[0];

      await queryClient.setQueryData(["deliv-note-detail", id], prchse);

      return prchse;
    }

    return null;
  };

  const {
    data: delivNote,
    error: delivNoteErr,
    isLoading: delivNoteLoading,
  } = useQuery<DelivNoteResp, Error>({
    queryKey: ["deliv-note-detail", id],
    queryFn: () => fetchDelivNote(session, reqPrm),
    enabled: !!session && !!reqPrm.id,
    refetchOnMount: false,
  });

  //build table row
  let tblBd: CustomTblBody[] = [];
  if (delivNote && Array.isArray(delivNote.items)) {
    tblBd = delivNote.items.map((x: any) => ({
      items: [
        { value: x.item.name, className: "text-left w-[15rem]" },
        {
          value: thsandSep(Number(x.price)),
          className: "text-left w-[6rem] pl-0",
        },
        { value: thsandSep(x.quantity), className: "text-left w-[6rem] pl-0" },
        { value: x.unit ?? "kg", className: "text-left w-[6rem] pl-0" },
        { value: x.discount, className: "text-left w-[6rem] pl-0" },
        {
          value: thsandSep(Number(x.total)),
          className: "text-left w-[6rem] pl-0",
        },
      ],
    }));
  }

  let paymPurcFormVal = initialPaymPurchaseForm;
  if (delivNote) {
    const paymPurchFormat = {
      amount: 0,
      date: new Date(),
      description: "",
      purchase: delivNote.purchase.id,
      paymentMode: "cash",
      ref: "",
      items: delivNote.items.map((itm: any) => {
        const paymPurchItm: PaymPurchItem = {
          item: itm.item.id,
          unit: itm.unit,
          price: itm.price,
          quantity: itm.quantity,
          total: itm.total,
        };
        return paymPurchItm;
      }),
    };

    paymPurcFormVal = paymPurchFormat;
  }

  return {
    reqPrm,
    tblBd,
    delivNote,
    delivNoteErr,
    delivNoteLoading,
    paymPurcFormVal,
    fetchDelivNote,
  };
};

export default useGetDelivNoteById;
