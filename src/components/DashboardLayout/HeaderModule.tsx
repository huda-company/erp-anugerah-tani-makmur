import { useRouter } from "next/navigation";
import { FC } from "react";

import { HeaderModuleProps } from "./types";
import Typography from "../Typography";
import dynamic from "next/dynamic";
import { BsArrowLeftSquare } from "react-icons/bs";

import { noop } from "^/utils/helpers";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { MdOutlineAddToPhotos } from "react-icons/md";
import CustomToolTip from "../CustomTooltip";
import { useTranslations } from "next-intl";

const CustomBcumbNoSSR = dynamic(
  () => import("../CustomBreadcrumb/CustomBreadcrumb"),
  { ssr: false }
);

const HeaderModule: FC<HeaderModuleProps> = ({ title, bcumbs, addPageURL }) => {
  const router = useRouter();
  const t = useTranslations("");

  return (
    <div className="flex justify-between rounded-lg border-2 border-primary p-1 dark:border-gray-700 ">
      <div className="flex gap-x-3">
        <div className="flex flex-row items-center gap-x-3">
          <div onClick={router.back} className="cursor-pointer">
            <CustomToolTip
              elm={<BsArrowLeftSquare color="black" size={20} />}
              content={<p>{capitalizeStr(t("Common.back"))}</p>}
            />
          </div>

          <Typography className="text-xl font-bold text-black underline">
            {capitalizeStr(title)}
          </Typography>

          <CustomToolTip
            elm={
              <MdOutlineAddToPhotos
                onClick={() => {
                  addPageURL ? router.push(addPageURL) : noop;
                }}
                className="h-6 w-6 cursor-pointer"
              />
            }
            content={<p>{capitalizeStr(t("Common.add"))}</p>}
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
