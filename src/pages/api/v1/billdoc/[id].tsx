import { addBillDoc, getBilldocs } from "@/controllers/billdoc";
import { ErrorType } from "^/config/apiRespMsg";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  const reqMeth = String(req.method);
  switch (reqMeth) {
    case "GET":
      getBilldocs(req, res);
      break;

    case "POST":
      addBillDoc(req, res);
      break;

    default:
      return res.status(405).json({ message: ErrorType.METHOD_NOT_ALLOWED });
  }
}
