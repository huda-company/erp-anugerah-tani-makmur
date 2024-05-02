import connectToDatabase from "^/mongodb/connDb";

export const findOneAndUpdateOrCreate = async (
  collectionName: string,
  query: any,
  updateData: any
) => {
  const conn = await connectToDatabase();
  const db = conn.connection.db;
  const collection = db.collection(collectionName);

  try {
    // Attempt to find a document that matches the query
    const existingDocument = await collection.findOne(query);

    if (existingDocument) {
      // Document found, you can update it if needed
      // Perform your update logic here if needed
      // Example: await collection.updateOne(query, { $set: updateData });
      await collection.updateOne(query, { $set: updateData });
    } else {
      // Document not found, insert a new document
      const result = await collection.insertOne(updateData);
      const newDocument = result;

      newDocument;
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log("errr", error);
  }
};
