export const capitalizeStr = (str: string) => {
  return str.replace(/(?:^|\s)\S/g, function (match) {
    return match.toUpperCase();
  });
};
