import { useRouter } from "next/navigation";
import { FC } from "react";
import { BsArrowLeftSquare } from "react-icons/bs";

import { HeaderModuleProps } from "./types";
import Typography from "../Typography";
import dynamic from "next/dynamic";
import { MdAddToPhotos } from "react-icons/md";

import { Button } from "../ui/button";
import { noop } from "^/utils/helpers";
import { capitalizeStr } from "^/utils/capitalizeStr";

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
        </div>
      </div>

      {bcumbs && (
        <div className="flex items-center">
          <CustomBcumbNoSSR separator=">" items={bcumbs} />
        </div>
      )}

      <div className="flex">
        <Button
          className="bg-gray-500 text-white hover:bg-primary-foreground"
          onClick={() => {
            addPageURL ? router.push(addPageURL) : noop;
          }}
        >
          <MdAddToPhotos className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default HeaderModule;
