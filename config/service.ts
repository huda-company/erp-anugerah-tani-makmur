export const buildReqHeader = (accToken: string) => {
  return {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
  };
};
