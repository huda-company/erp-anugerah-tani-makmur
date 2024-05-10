export const buildReqHeader = (accToken: string) => {
  return {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
  };
};

export const buildReqHeaderFData = (accToken: string) => {
  return {
    headers: {
      Authorization: `Bearer ${accToken}`,
      "Content-Type": "multipart/form-data",
    },
  };
};
