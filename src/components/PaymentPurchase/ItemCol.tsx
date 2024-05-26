import { PaymPurchItemResp } from "^/@types/models/paymentpurchase";
import { thsandSep } from "^/utils/helpers";
import { FC } from "react";

interface ItemColProps {
  items: PaymPurchItemResp[];
}

const ItemCol: FC<ItemColProps> = ({ items }) => {
  if (Array.isArray(items) && items.length > 0) {
    return (
      <div>
        <ol>
          {items.map((listItem: PaymPurchItemResp) => (
            <li key={listItem._id}>
              {listItem.item.name} ({listItem.quantity}) (
              {thsandSep(Number(listItem.total))})
            </li>
          ))}
        </ol>
      </div>
    );
  } else {
    return "-----";
  }
};

export default ItemCol;
