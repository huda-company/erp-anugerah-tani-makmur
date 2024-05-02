import Link from "next/link";
import { useRouter } from "next/router";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import clsxm from "^/utils/clsxm";

export default function LocaleSwitcher() {
  const { locale, route } = useRouter();

  return (
    <div className="flex w-fit items-center justify-between gap-[0.3rem] rounded-[1rem] bg-gray-200 p-1">
      <Link href={route} locale="id">
        <Avatar
          className={clsxm(locale == "id" && "border-4 border-indigo-500", "h-[1.5rem] w-[1.5rem]")}
        >
          <AvatarImage src="/id_flag.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>

      <div className="h-[1rem] border-r-2 border-indigo-500"></div>
      <Link href={route} locale="en">
        <Avatar
          className={clsxm(locale == "en" && "border-4 border-indigo-500", "h-[1.5rem] w-[1.5rem]")}
        >
          <AvatarImage src="/en_flag.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}
