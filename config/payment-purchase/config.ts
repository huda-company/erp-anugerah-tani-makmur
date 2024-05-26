import {
  FormattedPaymentPurchForm,
  IPaymentPurchaseForm,
} from "^/@types/models/paymentpurchase";

export const initialPaymPurchaseForm: IPaymentPurchaseForm = {
  purchase: "",
  amount: 0,
  date: new Date(),
  description: "",
  paymentMode: "",
  ref: "",
  file: undefined,
  items: [
    {
      item: "",
      unit: "",
      price: 0,
      quantity: 0,
      total: 0,
    },
  ],
};

export const formatPurchaseData = (
  data: IPaymentPurchaseForm
): FormattedPaymentPurchForm => {
  const items = data.items;

  const item = items.map((i) => i.item).join(";");
  const quantity = items.map((i) => i.quantity).join(";");
  const price = items.map((i) => i.price).join(";");
  const unit = items.map((i) => i.unit).join(";");
  const total = items.map((i) => i.total).join(";");

  return { item, quantity, price, total, unit };
};
