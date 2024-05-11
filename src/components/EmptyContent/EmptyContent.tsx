/* eslint-disable @next/next/no-img-element */
import { useTranslations } from "next-intl";
import { FC } from "react";

interface EmptyContentProps {
  wording?: string;
}

const EmptyContent: FC<EmptyContentProps> = ({ wording }) => {
  const t = useTranslations("");

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <img src={"/empty-folder.png"} height={100} width={100} alt="no data" />
      <h1>{wording ?? t("NotFound.dataNotFound")}</h1>
    </div>
  );
};

export default EmptyContent;
