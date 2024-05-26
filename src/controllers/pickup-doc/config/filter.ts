import { ObjectId } from "mongodb";

export const onPickupDocFilter = (query: Record<string, string>) => {
  const filter: any = {
    removed: "",
  };

  if (query["param[search]"]) {
    filter.$or = [
      { name: { $regex: query["param[search]"], $options: "i" } },
      {
        "createdBy.first_name": {
          $regex: query["param[search]"],
          $options: "i",
        },
      },
      { "createdBy.email": { $regex: query["param[search]"], $options: "i" } },
    ];
  }
  if (query["param[startDate]"] && query["param[endDate]"]) {
    filter.createdAt = {
      $gte: new Date(query["param[startDate]"] + "T00:00:00.000Z"), // Start of the day
      $lte: new Date(query["param[endDate]"] + "T23:59:59.999Z"), // End of the day
    };
  }

  if (query["id"]) filter["_id"] = new ObjectId(query["id"]);
  if (query["purchaseid"])
    filter["purchase"] = new ObjectId(query["purchaseid"]);
  if (query["param[paymPurchId]"])
    filter["paymentPurchase"] = new ObjectId(query["param[paymPurchId]"]);
  if (query["ownerId"]) filter["ownerId"] = new ObjectId(query["ownerId"]);
  if (query["param[id]"]) filter["_id"] = query["param[id]"];
  if (query["param[ownerId]"]) filter["ownerId"] = query["param[ownerId]"];
  if (query["param[store]"]) filter["store"] = query["param[store]"];
  if (query["param[userId]"]) {
    filter["$or"] = [
      { "createdBy.userId": query["param[userId]"] },
      { "collaborators.email": query["param[userId]"] },
    ];
  }

  return filter;
};
