import momentTZ from "moment-timezone";
import "moment-timezone";

import Supplier from "^/mongodb/schemas/supplier";
import Purchase from "^/mongodb/schemas/purchase";
import intToRoman from "./intToRoman";
import { timezone } from "^/config/env";
import { formNumLeadZeros } from "./helpers";

const generatePoNumber = async (suppId: string) => {
  let poNo = "";

  const currentDateInTimezone = momentTZ().tz(String(timezone));
  const monthInRoman = intToRoman(Number(currentDateInTimezone.format("MM")));
  const year = currentDateInTimezone.format("YYYY");

  const supplier = await Supplier.findOne({ _id: suppId, removed: "" });

  if (supplier) {
    const searchTerm = `ATM\\/${supplier.supplierCode}\\/${monthInRoman}\\/${year}`;

    const regexTerm = new RegExp(searchTerm);

    const checkTotalRow = await Purchase.countDocuments({
      poNo: { $regex: regexTerm },
    });

    const formatIncrementNo = formNumLeadZeros(checkTotalRow + 1, 3);

    poNo = `${formatIncrementNo}/ATM/${supplier.supplierCode}/${monthInRoman}/${year}`;
  }

  return poNo;
};

export default generatePoNumber;
