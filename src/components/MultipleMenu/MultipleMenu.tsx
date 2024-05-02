import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { AUTH_PAGE_URL } from "@/constants/pageURL";

import UserNav from "../DashboardLayout/UserNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { capitalizeStr } from "^/utils/capitalizeStr";
import { getStaticProps } from "^/utils/getStaticProps";

const MultipleMenu = () => {
  const t = useTranslations("");

  const { status } = useSession();

  return (
    <>
      <div className="flex flex-row gap-x-4">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="hover: cursor-pointer">Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-30 bg-white"
              align="center"
              forceMount
            >
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/">{capitalizeStr(t("Index.home"))}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {capitalizeStr(t("AboutUs.aboutUs"))}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {capitalizeStr(t("ContactUs.contactUs"))}
                </DropdownMenuItem>
                {status !== "authenticated" && (
                  <>
                    <DropdownMenuItem>
                      <a href={AUTH_PAGE_URL.SIGNIN} className="w-full">
                        {capitalizeStr(t("Signin.signin"))}
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href={AUTH_PAGE_URL.SIGNUP} className="w-full">
                        {capitalizeStr(t("Signup.register"))}
                      </a>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>{status == "authenticated" && <UserNav />}</div>
      </div>
    </>
  );
};

export { getStaticProps };

export default MultipleMenu;
