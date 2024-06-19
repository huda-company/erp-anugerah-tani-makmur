import { ObjectId } from "mongodb";

export const onStockHistFilter = (query: Record<string, string>) => {
  const filter: any = {
    removed: "",
  };

  if (query["param[item]"] || query["param[supplier]"]) {
    filter.$or = [
      { item: query["param[item]"] },
      { supplier: query["param[supplier]"] },
    ];
  }

  if (query["param[startDate]"] && query["param[endDate]"]) {
    filter.createdAt = {
      $gte: new Date(query["param[startDate]"] + "T00:00:00.000Z"), // Start of the day
      $lte: new Date(query["param[endDate]"] + "T23:59:59.999Z"), // End of the day
    };
  }

  if (query["id"]) filter["_id"] = new ObjectId(query["id"]);
  if (query["param[stockId]"]) {
    filter["stockId"] = new ObjectId(query["param[stockId]"]);
  }

  return filter;
};
