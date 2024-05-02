import { useRouter } from "next/navigation";
import { FC } from "react";
import { BsArrowLeftSquare } from "react-icons/bs";

import { HeaderModuleProps } from "./types";
import Typography from "../Typography";
import CustomBreadcrumb from "../CustomBreadcrumb/CustomBreadcrumb";
import { BreadcrumbItem } from "../CustomBreadcrumb/types";

const HeaderModule: FC<HeaderModuleProps> = ({ title, bcumbs }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between rounded-lg border-2 border-gray-200 p-2 dark:border-gray-700 ">
      <div className="flex gap-x-3">
        <div className="flex flex-row gap-x-3">
          <div onClick={router.back} className="cursor-pointer">
            <BsArrowLeftSquare color="black" size={20} />
          </div>
          <Typography className="text-xl font-bold text-black underline">
            {title}
          </Typography>
        </div>
      </div>
      <div>
        <CustomBreadcrumb separator="#" items={bcumbs} />
      </div>
    </div>
  );
};

export default HeaderModule;
