import { pageRowsArr } from "^/config/supplier/config";
import { useSession } from "next-auth/react";

import { IBranchFieldRequest } from "^/@types/models/branch";

import { getOverviewAPI } from "^/services/dashboard";
import { useQuery } from "@tanstack/react-query";

const useGetOverview = () => {
  const { data: session } = useSession();

  const {
    data: dashboardStat,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["dashboardStat"],
    retry: 2,
    queryFn: async () => {
      const dashStatData = await fetch();
      return dashStatData;
    },
  });

  const fetch = async (
    payload: Omit<IBranchFieldRequest["query"], "name"> = {
      page: 1,
      limit: pageRowsArr[2],
      "sort[key]": "name",
      "sort[direction]": "asc",
    }
  ) => {
    if (!session) {
      throw new Error("No session available");
    }

    try {
      const response = await getOverviewAPI(session, payload);

      if (response && response.data) {
        const { data: resData } = response;
        return resData.data;
      }
    } catch (error: any) {
      throw error;
    }
  };

  return {
    loading,
    fetch,
    dashboardStat,
    error,
  };
};

export default useGetOverview;
