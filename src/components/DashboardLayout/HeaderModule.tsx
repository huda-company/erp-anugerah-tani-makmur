import { useRouter } from "next/navigation";
import { FC } from "react";

import { HeaderModuleProps } from "./types";
import Typography from "../Typography";
import dynamic from "next/dynamic";
import { BsArrowLeftSquare } from "react-icons/bs";

import { noop } from "^/utils/helpers";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { MdOutlineAddToPhotos } from "react-icons/md";

const CustomBcumbNoSSR = dynamic(
  () => import("../CustomBreadcrumb/CustomBreadcrumb"),
  { ssr: false }
);

const HeaderModule: FC<HeaderModuleProps> = ({ title, bcumbs, addPageURL }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between rounded-lg border-2 border-primary p-1 dark:border-gray-700 ">
      <div className="flex gap-x-3">
        <div className="flex flex-row items-center gap-x-3">
          <div onClick={router.back} className="cursor-pointer">
            <BsArrowLeftSquare color="black" size={20} />
          </div>
          <Typography className="text-xl font-bold text-black underline">
            {capitalizeStr(title)}
          </Typography>

          <MdOutlineAddToPhotos
            onClick={() => {
              addPageURL ? router.push(addPageURL) : noop;
            }}
            className="h-6 w-6 cursor-pointer"
          />
        </div>
      </div>

      {bcumbs && (
        <div className="flex">
          <CustomBcumbNoSSR separator=">" items={bcumbs} />
        </div>
      )}
    </div>
  );
};

export default HeaderModule;
