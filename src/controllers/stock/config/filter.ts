import { ObjectId } from "mongodb";

export const onStockFilter = (query: Record<string, string>) => {
  const filter: any = {
    removed: "",
  };

  if (
    (query["param[item]"] && query["param[item]"].length > 0) ||
    (query["param[supplier]"] && query["param[supplier]"].length > 0)
  ) {
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

  return filter;
};
