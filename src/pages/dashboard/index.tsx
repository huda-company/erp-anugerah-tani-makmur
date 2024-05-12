import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStaticProps } from "^/utils/getStaticProps";

import { withAuth } from "^/utils/withAuth";
import useGetOverview from "@/hooks/dashboard/useGetOverview";
import Loading from "@/components/Loading";
import { useTranslations } from "next-intl";
import { capitalizeStr } from "^/utils/capitalizeStr";
import { IoCartOutline } from "react-icons/io5";
import { IoStorefrontOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { PiUserSoundFill } from "react-icons/pi";
import { LiaUserSlashSolid } from "react-icons/lia";
import { FaBox } from "react-icons/fa6";
import { BiCategoryAlt } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AUTH_PAGE_URL } from "@/constants/pageURL";

const Dashboard = () => {
  const t = useTranslations("");

  const router = useRouter();

  useSession({
    required: true,
    onUnauthenticated() {
      router.push(AUTH_PAGE_URL.SIGNIN);
    },
  });

  const { loading, overview } = useGetOverview();

  return (
    <>
      {loading == true && <Loading />}

      {!loading && overview && (
        <DashboardLayout>
          <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 md:p-8">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {capitalizeStr(t("Sidebar.purchaseOrder"))}
                        </CardTitle>
                        <IoCartOutline className="h-6 w-6" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Number(overview.countPurchase)}
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                          </p> */}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {capitalizeStr(t("DashboardPage.totalUser"))}
                        </CardTitle>
                        <FaUsers className="h-6 w-6" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Number(overview.countUserActive) +
                            Number(overview.countUserInActive)}
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                          </p> */}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {capitalizeStr(t("Sidebar.branch"))}
                        </CardTitle>
                        <IoStorefrontOutline className="h-6 w-6" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Number(overview.countBranch)}
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +19% from last month
                          </p> */}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {capitalizeStr(t("Sidebar.item"))}
                        </CardTitle>
                        <FaBox className="h-6 w-6" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Number(overview.countItem)}
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +201 since last hour
                          </p> */}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {capitalizeStr(t("Sidebar.itemCategory"))}
                        </CardTitle>
                        <BiCategoryAlt className="h-6 w-6" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Number(overview.countItemCat)}
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +201 since last hour
                          </p> */}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {capitalizeStr(t("DashboardPage.activeUser"))}
                        </CardTitle>
                        <PiUserSoundFill className="h-6 w-6" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Number(overview.countUserActive)}
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +201 since last hour
                          </p> */}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {capitalizeStr(t("DashboardPage.inActiveUser"))}
                        </CardTitle>
                        <LiaUserSlashSolid className="h-6 w-6" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Number(overview.countUserInActive)}
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +201 since last hour
                          </p> */}
                      </CardContent>
                    </Card>
                  </div>
                  {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                      <Card className="col-span-4">
                        <CardHeader>
                          <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                          aasas
                        </CardContent>
                      </Card>
                      <Card className="col-span-4 md:col-span-3">
                        <CardHeader>
                          <CardTitle>Recent Sales</CardTitle>
                          <CardDescription>
                            You made 265 sales this month.
                          </CardDescription>
                        </CardHeader>
                        <CardContent> <RecentSales /></CardContent>
                      </Card>
                    </div> */}
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                          +20.1% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Subscriptions
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Sales
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Now
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                          +201 since last hour
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                      <CardHeader>
                        <CardTitle>Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="pl-2">
                        {/* <Overview /> */}
                      </CardContent>
                    </Card>
                    <Card className="col-span-4 md:col-span-3">
                      <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                          You made 265 sales this month.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>{/* <RecentSales /> */}</CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </DashboardLayout>
      )}
    </>
  );
};

export { getStaticProps };

export default withAuth(Dashboard);
